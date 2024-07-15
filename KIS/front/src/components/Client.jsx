import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phonenumber: '',
    bonus: '',
    moneyspend: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get/clients');
      setClients(response.data);
    } catch (error) {
      setError('Ошибка при получении данных: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/client/${id}`);
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      setError('Ошибка при удалении клиента: ' + error.message);
    }
  };

  const handleUpdateClient = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      phonenumber: client.phonenumber,
      bonus: client.bonus,
      moneyspend: client.moneyspend
    });
    setIsModalOpen(true);
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setFormData({
      name: '',
      phonenumber: '',
      bonus: '',
      moneyspend: ''
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        await axios.put(`http://localhost:5000/put/client/${selectedClient.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/post/client', formData);
      }
      fetchClients(); // Refresh the clients list
      setIsModalOpen(false);
    } catch (error) {
      setError('Ошибка при сохранении клиента: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Клиенты</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Номер телефона</th>
              <th>Бонус</th>
              <th>Потраченные деньги</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.phonenumber}</td>
                <td>{client.bonus}</td>
                <td>{client.moneyspend}</td>
                <td>
                  <button onClick={() => handleDeleteClient(client.id)}>Удалить</button>
                  <button onClick={() => handleUpdateClient(client)}>Обновить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={handleCreateClient}>Создать клиента</Button>
      </div>
      <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedClient ? 'Обновление клиента' : 'Создание клиента'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleModalSubmit}>
            <div>
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phonenumber">Номер телефона:</label>
              <input
                type="text"
                id="phonenumber"
                name="phonenumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="bonus">Бонус:</label>
              <input
                type="number"
                id="bonus"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="moneyspend">Потраченные деньги:</label>
              <input
                type="number"
                id="moneyspend"
                name="moneyspend"
                value={formData.moneyspend}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit">{selectedClient ? 'Обновить' : 'Создать'}</Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Client;
