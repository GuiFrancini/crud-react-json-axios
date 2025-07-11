import React, { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null); // Para controlar o modo de edição

  // READ: Carregar usuários da API
  useEffect(() => {
    api.get('/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error("Houve um erro ao buscar os usuários:", error));
  }, []);

  // Handler para mudanças nos inputs do formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };
  
  // CREATE: Adicionar um novo usuário
  const handleAddUser = (event) => {
    event.preventDefault();
    api.post('/users', newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ name: '', email: '' }); // Limpa o formulário
      })
      .catch(error => console.error("Houve um erro ao adicionar o usuário:", error));
  };

  // UPDATE: Iniciar a edição de um usuário
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  // UPDATE: Salvar as alterações do usuário
  const handleUpdateUser = (event) => {
    event.preventDefault();
    if (!editingUser) return;
    
    api.put(`/users/${editingUser.id}`, editingUser)
      .then(response => {
        setUsers(users.map(user => (user.id === editingUser.id ? response.data : user)));
        setEditingUser(null); // Sai do modo de edição
      })
      .catch(error => console.error("Houve um erro ao atualizar o usuário:", error));
  };
  
  // DELETE: Deletar um usuário
  const handleDeleteUser = (id) => {
    api.delete(`/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => console.error("Houve um erro ao deletar o usuário:", error));
  };

  // Formulário para adicionar ou editar
  const renderForm = () => {
    const isEditing = !!editingUser;
    const user = isEditing ? editingUser : newUser;
    const handleSubmit = isEditing ? handleUpdateUser : handleAddUser;
    const buttonText = isEditing ? "Salvar Alterações" : "Adicionar Usuário";

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          placeholder="Nome"
          required
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <button type="submit">{buttonText}</button>
        {isEditing && <button onClick={() => setEditingUser(null)}className='btn-cancelar'>Cancelar Edição</button>}
      </form>
    );
  };

  return (
    <div className="App">
      <h1>CRUD de Usuários</h1>

      <h2>{editingUser ? "Editar Usuário" : "Adicionar Novo Usuário"}</h2>
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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button className="edit" onClick={() => handleEditUser(user)}>Editar</button>
                <button className="delete" onClick={() => handleDeleteUser(user.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;