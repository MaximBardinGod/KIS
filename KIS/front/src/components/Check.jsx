import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Check = () => {
  const [checks, setChecks] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCheck, setSelectedCheck] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemMenu, setItemMenu] = useState([]);

  const [formData, setFormData] = useState({
    Sum: '',
    Date: '',
    PaymentType: ''
  });

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get/Checks');
        setChecks(response.data);
      } catch (error) {
        setError('Ошибка при получении данных: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get/Clients');
        setClients(response.data);
      } catch (error) {
        setError('Ошибка при получении данных о клиентах: ' + error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get/Products');
        setProducts(response.data);
      } catch (error) {
        setError('Ошибка при получении данных о продуктах: ' + error.message);
      }
    };

    fetchChecks();
    fetchClients();
    fetchProducts();
  }, []);

  const handleDeleteCheck = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/Check/${id}`);
      setChecks(checks.filter(check => check.Id !== id));
    } catch (error) {
      setError('Ошибка при удалении записи: ' + error.message);
    }
  };

  const handleUpdateCheck = (check) => {
    setSelectedCheck(check);
    setFormData({
      Sum: check.Sum,
      Date: new Date(check.Date).toISOString().split('T')[0],
      PaymentType: check.PaymentType
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedCheck(null);
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        Id: selectedCheck.Id,
        Sum: formData.Sum,
        Date: formData.Date,
        PaymentType: formData.PaymentType
      };
      await axios.put('http://localhost:5000/put/Check', data);
      const updatedChecks = checks.map(check => {
        if (check.Id === selectedCheck.Id) {
          return { ...check, ...formData };
        }
        return check;
      });
      setChecks(updatedChecks);
      setIsModalOpen(false);
    } catch (error) {
      setError('Ошибка при обновлении записи: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleViewContents = async (checkId) => {
    try {
      const response = await axios.get(`http://localhost:5000/get/itemmenu/${checkId}`);
      const itemMenuData = response.data.map(item => ({
        ...item,
        ProductName: products.find(p => p.Id === item.ProductId)?.Name || 'Неизвестный продукт'
      }));
      setItemMenu(itemMenuData);
      setIsModalOpen(true);
    } catch (error) {
      setError('Ошибка при получении данных о содержимом чека: ' + error.message);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Чеки</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Тип оплаты</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {checks.map(check => {
              const client = clients.find(c => c.Id === check.ClientId);
              return (
                <tr key={check.Id}>
                  <td>{check.Id}</td>
                  <td>{client ? client.Name : 'Клиент не найден'}</td>
                  <td>{check.Sum}</td>
                  <td>{new Date(check.Date).toLocaleDateString()}</td>
                  <td>{check.PaymentType}</td>
                  <td>
                    <button onClick={() => handleDeleteCheck(check.Id)}>Удалить</button>
                    <button onClick={() => handleViewContents(check.Id)}>Посмотреть содержимое</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      {isModalOpen && (
        <Modal show={isModalOpen} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Содержимое чека</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {itemMenu.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <th>Название продукта</th>
                    <th>Количество</th>
                  </tr>
                </thead>
                <tbody>
                  {itemMenu.map(item => (
                    <tr key={item.Id}>
                      <td>{item.ProductName}</td>
                      <td>{item.Count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Содержимое чека отсутствует.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Check;
