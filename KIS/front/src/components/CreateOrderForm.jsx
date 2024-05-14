import React, { useState } from 'react';
import axios from 'axios';

const CreateOrderForm = () => {
  const [formData, setFormData] = useState({
    SpecificationId: '',
    OrderDate: '',
    ClientName: '',
    Count: '',
    Status: 'не выполнено'
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/post/orders', formData);
      // Дополнительные действия после успешного создания заказа, если нужно
      console.log('Order created successfully!');
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      setIsSubmitting(false);
      setIsFormVisible(false); // Скрыть форму после отправки
    }
  };

  return (
    <div>
      <button onClick={() => setIsFormVisible(true)}>Создать заказ</button>
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="SpecificationId">SpecificationId:</label>
          <input
            type="number"
            id="SpecificationId"
            name="SpecificationId"
            value={formData.SpecificationId}
            onChange={handleChange}
            required
          />
          <label htmlFor="OrderDate">Дата заказа:</label>
          <input
            type="date"
            id="OrderDate"
            name="OrderDate"
            value={formData.OrderDate}
            onChange={handleChange}
            required
          />
          <label htmlFor="ClientName">Имя клиента:</label>
          <input
            type="text"
            id="ClientName"
            name="ClientName"
            value={formData.ClientName}
            onChange={handleChange}
            required
          />
          <label htmlFor="Count">Количество:</label>
          <input
            type="number"
            id="Count"
            name="Count"
            value={formData.Count}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateOrderForm;
