import React, { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [usuario, setusuario] = useState([]);
  const [novoUsuario, setnovoUsuario] = useState({ name: '', email: '' });
  const [editarUsuario, seteditarUsuario] = useState(null); // Para controlar o modo de edição

  // READ: Carregar usuários da API
  useEffect(() => {
    api.get('/usuario')
      .then(response => {
        setusuario(response.data);
      })
      .catch(error => console.error("Houve um erro ao buscar os usuários:", error));
  }, []);

  // Handler para mudanças nos inputs do formulário
  const update = (event) => {
    const { name, value } = event.target;
    if (editarUsuario) {
      seteditarUsuario({ ...editarUsuario, [name]: value });
    } else {
      setnovoUsuario({ ...novoUsuario, [name]: value });
    }
  };

  // CREATE: Adicionar um novo usuário
  const create = (event) => {
    event.preventDefault();
    api.post('/usuario', novoUsuario)
      .then(response => {
        setusuario([...usuario, response.data]);
        setnovoUsuario({ name: '', email: '' }); // Limpa o formulário
      })
      .catch(error => console.error("Houve um erro ao adicionar o usuário:", error));
  };

  // UPDATE: Iniciar a edição de um usuário
  const edicao = (user) => {
    seteditarUsuario(user);
  };

  // UPDATE: Salvar as alterações do usuário
  const updateSave = (event) => {
    event.preventDefault();
    if (!editarUsuario) return;

    api.put(`/usuario/${editarUsuario.id}`, editarUsuario)
      .then(response => {
        setusuario(usuario.map(user => (user.id === editarUsuario.id ? response.data : user)));
        seteditarUsuario(null); // Sai do modo de edição
      })
      .catch(error => console.error("Houve um erro ao atualizar o usuário:", error));
  };

  // DELETE: Deletar um usuário
  const excluir = (id) => {
    api.delete(`/usuario/${id}`)
      .then(() => {
        setusuario(usuario.filter(user => user.id !== id));
      })
      .catch(error => console.error("Houve um erro ao deletar o usuário:", error));
  };

  // Formulário para adicionar ou editar
  const renderForm = () => {
    const isEditing = !!editarUsuario;
    const user = isEditing ? editarUsuario : novoUsuario;
    const handleSubmit = isEditing ? updateSave : create;
    const buttonText = isEditing ? "Salvar Alterações" : "Adicionar Usuário";

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={update}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={update}
          placeholder="Email"
          required
        />
        <button type="submit">{buttonText}</button>
        {isEditing && <button onClick={() => seteditarUsuario(null)}>Cancelar Edição</button>}
      </form>
    );
  };

  return (
    <div className="App">
      <h1>CRUD de Usuários</h1>

      <h2>{editarUsuario ? "Editar Usuário" : "Adicionar Novo Usuário"}</h2>
      {renderForm()}

      <h2>Lista de Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuario.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="edit" onClick={() => edicao(user)}>Editar</button>
                <button className="delete" onClick={() => excluir(user.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody> 
      </table>
    </div>
  );
}

export default App;


