import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [formData, setFormData] = useState({
    Description: '',
    Date: ''
  });
  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get/orders');
      setOrders(response.data);
    } catch (error) {
      setError('Ошибка при получении данных: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get/products');
      setProducts(response.data);
    } catch (error) {
      setError('Ошибка при получении данных: ' + error.message);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/get/itemorder/${orderId}`);
      setOrderItems(response.data);
      setIsItemModalOpen(true);
    } catch (error) {
      setError('Ошибка при получении данных: ' + error.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/order/${id}`);
      setOrders(orders.filter(order => order.Id !== id));
    } catch (error) {
      setError('Ошибка при удалении заказа: ' + error.message);
    }
  };

  const handleCreateOrder = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowProductSelection(false);
    setSelectedProducts([]);
  };

  const handleItemModalClose = () => {
    setIsItemModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProductSelectChange = (productId, count) => {
    setSelectedProducts(prevState => {
      const existingProduct = prevState.find(p => p.ProductId === productId);
      if (existingProduct) {
        return prevState.map(p =>
          p.ProductId === productId ? { ...p, Count: count } : p
        );
      } else {
        return [...prevState, { ProductId: productId, Count: count }];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date(formData.Date);
    if (isNaN(date.getTime())) {
      setError('Invalid date');
      return;
    }
    try {
      // Create the order
      await axios.post('http://localhost:5000/post/order', formData);
      
      // Fetch the latest orders to get the last order ID
      const response = await axios.get('http://localhost:5000/get/orders');
      const latestOrders = response.data;
      const lastOrderId = latestOrders[latestOrders.length - 1].Id;

      // Create ItemOrder entries with the last order ID
      await Promise.all(selectedProducts.map(product =>
        axios.post('http://localhost:5000/post/itemorder', {
          OrderId: lastOrderId,
          ProductId: product.ProductId,
          Count: product.Count
        })
      ));
      
      fetchOrders(); // Refresh the orders list
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating order:', error.message);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Заказы</h1>
      <Button onClick={handleCreateOrder}>Создать заказ</Button>
      {error && <p className="error">{error}</p>}
      <div>
        <Table>
          <thead>
            <tr>
              <th>ID заказа</th>
              <th>Description</th>
              <th>Дата</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.Id}>
                <td>{order.Id}</td>
                <td>{order.Description}</td>
                <td>{new Date(order.Date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDeleteOrder(order.Id)}>Удалить</button>
                  <button onClick={() => fetchOrderItems(order.Id)}>Посмотреть содержимое</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Создать заказ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="Description">Описание:</label>
              <input
                type="text"
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="Date">Дата заказа:</label>
              <input
                type="date"
                id="Date"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
                required
              />
            </div>
            <Button variant="primary" onClick={() => setShowProductSelection(true)}>
              Выбрать составляющее заказа
            </Button>
            {showProductSelection && (
              <div>
                <h3>Выберите продукты</h3>
                {products.map(product => (
                  <div key={product.Id}>
                    <label>{product.Name}</label>
                    <input
                      type="number"
                      min="1"
                      onChange={(e) =>
                        handleProductSelectChange(product.Id, parseInt(e.target.value))
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            <button type="submit">Создать</button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isItemModalOpen} onHide={handleItemModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Содержимое заказа</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>Наименование продукта</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map(item => (
                <tr key={item.ProductId}>
                  <td>{products.find(p => p.Id === item.ProductId)?.Name}</td>
                  <td>{item.Count}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleItemModalClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Orders;
