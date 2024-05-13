import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    Orderdate: '',
    ClientName: '',
    Count: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/orders');
        setOrders(response.data);
      } catch (error) {
        setError('Ошибка при получении данных: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`/orders/${id}`);
      setOrders(orders.filter(order => order.Id !== id));
    } catch (error) {
      setError('Ошибка при удалении заказа: ' + error.message);
    }
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setFormData({
      Orderdate: order.Orderdate,
      ClientName: order.ClientName,
      Count: order.Count
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleModalSubmit = async () => {
    try {
      await axios.put(`/orders/${selectedOrder.Id}`, formData);
      // Обновляем данные в списке заказов
      const updatedOrders = orders.map(order => {
        if (order.Id === selectedOrder.Id) {
          return { ...order, ...formData };
        }
        return order;
      });
      setOrders(updatedOrders);
      setIsModalOpen(false);
    } catch (error) {
      setError('Ошибка при обновлении заказа: ' + error.message);
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
      <h1>Заказы</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID заказа</th>
            <th>Дата заказа</th>
            <th>Имя клиента</th>
            <th>Количество</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.Id}>
              <td>{order.Id}</td>
              <td>{order.Orderdate}</td>
              <td>{order.ClientName}</td>
              <td>{order.Count}</td>
              <td>
                <button onClick={() => handleDeleteOrder(order.Id)}>Удалить</button>
                <button onClick={() => handleUpdateOrder(order)}>Обновить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Обновление заказа</h2>
            <form onSubmit={handleModalSubmit}>
              <div>
                <label htmlFor="Orderdate">Дата заказа:</label>
                <input
                  type="date"
                  id="Orderdate"
                  name="Orderdate"
                  value={formData.Orderdate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="ClientName">Имя клиента:</label>
                <input
                  type="text"
                  id="ClientName"
                  name="ClientName"
                  value={formData.ClientName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Count">Количество:</label>
                <input
                  type="number"
                  id="Count"
                  name="Count"
                  value={formData.Count}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Сохранить</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
