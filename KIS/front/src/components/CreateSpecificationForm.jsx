import React, { useState } from 'react';
import axios from 'axios';

const CreateSpecificationForm = () => {
  const [formData, setFormData] = useState({
    ParentId: '',
    Description: '',
    QuantityPerParent: '',
    Measure: ''
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
      await axios.post('http://localhost:5000/post/specifications', formData);
      console.log('Specification created successfully!');
    } catch (error) {
      console.error('Failed to create specification:', error);
    } finally {
      setIsSubmitting(false);
      setIsFormVisible(false);
    }
  };

  return (
    <div>
      <button onClick={() => setIsFormVisible(true)}>Добавить спецификацию</button>
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="ParentId">ParentId:</label>
          <input
            type="number"
            id="ParentId"
            name="ParentId"
            value={formData.ParentId}
            onChange={handleChange}
            required
          />
          <label htmlFor="Description">Description:</label>
          <input
            type="text"
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            required
          />
          <label htmlFor="QuantityPerParent">QuantityPerParent:</label>
          <input
            type="number"
            id="QuantityPerParent"
            name="QuantityPerParent"
            value={formData.QuantityPerParent}
            onChange={handleChange}
            required
          />
          <label htmlFor="Measure">Measure:</label>
          <input
            type="text"
            id="Measure"
            name="Measure"
            value={formData.Measure}
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

export default CreateSpecificationForm;
