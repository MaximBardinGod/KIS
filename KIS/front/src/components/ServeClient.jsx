import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ServeClient = () => {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Карта');

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных о клиентах:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных о продуктах:', error);
    }
  };

  useEffect(() => {
    calculateTotalSum();
  }, [selectedProducts, productQuantities]);

  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };

  const handleProductChange = (event) => {
    const { value, checked } = event.target;
    const [productName, productCost] = value.split('|');

    if (checked) {
      setProductQuantities(prevQuantities => ({
        ...prevQuantities,
        [productName]: 1
      }));
      setSelectedProducts(prevSelected => [...prevSelected, productName]);
    } else {
      const { [productName]: deleted, ...newQuantities } = productQuantities;
      setProductQuantities(newQuantities);
      setSelectedProducts(prevSelected =>
        prevSelected.filter(item => item !== productName)
      );
    }
  };

  const handleQuantityChange = (event, productName) => {
    const quantity = event.target.value;
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productName]: Number(quantity)
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const calculateTotalSum = () => {
    let sum = 0;
    selectedProducts.forEach(productName => {
      const product = products.find(p => p.Name === productName);
      const quantity = productQuantities[productName] || 0;
      if (product) {
        sum += product.Cost * quantity;
      }
    });
    setTotalSum(sum);
  };

  const handleSubmit = async () => {
    const client = clients.find(c => c.Name === selectedClient);
  
    if (!client) {
      alert('Пожалуйста, выберите клиента.');
      return;
    }
  
    try {
      // Форматирование даты в нужный формат YYYY-MM-DD
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // Получаем только дату в формате YYYY-MM-DD
  
      // Создаем чек
      const checkData = {
        ClientId: client.Id,
        Sum: totalSum,
        Date: formattedDate, // Используем отформатированную дату
        PaymentType: paymentMethod,
      };
  
      // Отправляем POST запрос на создание чека
      const response = await axios.post('http://localhost:5000/post/check', checkData);
  
      // Получаем последний созданный CheckId
      const response1 = await axios.get('http://localhost:5000/get/checks');
      const latestChecks = response1.data;
      const lastId = latestChecks[latestChecks.length - 1].Id;

      // Создаем записи в ItemMenu
      await Promise.all(selectedProducts.map(async productName => {
        const productId = products.find(p => p.Name === productName).Id;
        const count = productQuantities[productName];

        // Отправляем отдельный POST запрос для каждой записи в ItemMenu
        await axios.post('http://localhost:5000/post/itemmenu', {
          CheckId: lastId,
          ProductId: productId,
          Count: count
        });
      }));
  
      alert('Заказ успешно оформлен!');
    } catch (error) {
      console.error('Ошибка при создании чека или записей в ItemMenu:', error);
      alert('Произошла ошибка при оформлении заказа.');
    }
};

  

  return (
    <div>
      <h2>Обслуживание клиента</h2>

      <div className="form-group">
        <label htmlFor="clientSelect">Выберите клиента:</label>
        <select
          className="form-control"
          id="clientSelect"
          value={selectedClient}
          onChange={handleClientChange}
        >
          <option value="">Выберите клиента...</option>
          {clients.map(client => (
            <option key={client.Id} value={client.Name}>
              {client.Name} - {client.PhoneNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Выберите продукты:</label>
        {products.map(product => (
          <div key={product.Id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={product.Id}
              value={`${product.Name}|${product.Cost}`}
              checked={selectedProducts.includes(product.Name)}
              onChange={handleProductChange}
            />
            <label className="form-check-label" htmlFor={product.Id}>
              {product.Name} - {product.Cost} руб.
            </label>
            {selectedProducts.includes(product.Name) && (
              <input
                type="number"
                className="form-control ml-3"
                value={productQuantities[product.Name] || ''}
                onChange={(e) => handleQuantityChange(e, product.Name)}
                placeholder="Количество"
                min="1"
              />
            )}
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Способ оплаты:</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="paymentCash"
            name="paymentMethod"
            value="Наличные"
            checked={paymentMethod === 'Наличные'}
            onChange={handlePaymentMethodChange}
          />
          <label className="form-check-label" htmlFor="paymentCash">
            Наличные
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            id="paymentCard"
            name="paymentMethod"
            value="Карта"
            checked={paymentMethod === 'Карта'}
            onChange={handlePaymentMethodChange}
          />
          <label className="form-check-label" htmlFor="paymentCard">
            По карте
          </label>
        </div>
      </div>

      <div className="footer">
        <h3>Сумма: {totalSum} руб.</h3>
        <button className="btn btn-primary" onClick={handleSubmit}>Оплатить</button>
      </div>
    </div>
  );
};

export default ServeClient;
