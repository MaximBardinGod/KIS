import React, { useState } from 'react';
import axios from 'axios';

const CreateStockForm = () => {
  const [formData, setFormData] = useState({
    SpecificationId: '',
    Dateoperation: '',
    Receivedquantity: '',
    Shippedquantity: ''
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
      await axios.post('http://localhost:5000/post/stocks', formData);
      console.log('Stock created successfully!');
    } catch (error) {
      console.error('Failed to create stock:', error);
    } finally {
      setIsSubmitting(false);
      setIsFormVisible(false); 
    }
  };

  return (
    <div>
      <button onClick={() => setIsFormVisible(true)}>Создать</button>
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
          <label htmlFor="Dateoperation">Dateoperation</label>
          <input
            type="Date"
            id="Dateoperation"
            name="Dateoperation"
            value={formData.Dateoperation}
            onChange={handleChange}
            required
          />
          <label htmlFor="Receivedquantity">Receivedquantity</label>
          <input
            type="number"
            id="Receivedquantity"
            name="Receivedquantity"
            value={formData.Receivedquantity}
            onChange={handleChange}
            required
          />
          <label htmlFor="Shippedquantity">Shippedquantity</label>
          <input
            type="number"
            id="Shippedquantity"
            name="Shippedquantity"
            value={formData.Shippedquantity}
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

export default CreateStockForm;