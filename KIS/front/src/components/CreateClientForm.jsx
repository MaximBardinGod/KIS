import React, { useState } from 'react';
import axios from 'axios';

const CreateClientForm = () => {
  const [formData, setFormData] = useState({
    Name: '',
    PhoneNumber: '',
    Bonus: '',
    MoneySpend: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/post/Client', formData);
      console.log('Client created:', response.data);
    } catch (error) {
      console.error('Error creating client:', error.message);
    }
  };

  return (
    <div>
      <h2>Создать нового клиента</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="Name">Имя:</label>
          <input
            type="text"
            id="Name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="PhoneNumber">Номер телефона:</label>
          <input
            type="text"
            id="PhoneNumber"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="Bonus">Бонус:</label>
          <input
            type="number"
            id="Bonus"
            name="Bonus"
            value={formData.Bonus}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="MoneySpend">Потраченные деньги:</label>
          <input
            type="number"
            id="MoneySpend"
            name="MoneySpend"
            value={formData.MoneySpend}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

export default CreateClientForm;
