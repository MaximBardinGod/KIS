import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateSpecificationForm from './CreateSpecificationForm';
import BreakdownModal from './BreakdownModal';

const Specifications = () => {
  const [specifications, setSpecifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSpecification, setSelectedSpecification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);  
  const [breakdownData, setBreakdownData] = useState([]);

  const [formData, setFormData] = useState({
    ParentId: '',
    Description: '',
    QuantityPerParent: '',
    Measure: ''
  });

  useEffect(() => {
    const fetchSpecifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get/specifications');
        setSpecifications(response.data);
      } catch (error) {
        setError('Ошибка при получении данных: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecifications();
  }, []);

  const handleDeleteSpecification = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/specifications/${id}`);
      setSpecifications(specifications.filter(specification => specification.Id !== id));
    } catch (error) {
      setError('Ошибка при удалении спецификации: ' + error.message);
    }
  };

  const handleUpdateSpecification = (specification) => {
    setSelectedSpecification(specification);
    setFormData({
      ParentId: specification.ParentId,
      Description: specification.Description,
      QuantityPerParent: specification.QuantityPerParent,
      Measure: specification.Measure
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedSpecification(null);
    setIsModalOpen(false);
  };

  const handleBreakdownModalClose = () => {
    setIsBreakdownModalOpen(false);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        Id: selectedSpecification.Id,
        ParentId: formData.ParentId,
        Description: formData.Description,
        QuantityPerParent: formData.QuantityPerParent,
        Measure: formData.Measure
      };
      console.log('Sending data:', data);
      await axios.put('http://localhost:5000/put/specifications', data);
      const updatedSpecifications = specifications.map(specification => {
        if (specification.Id === selectedSpecification.Id) {
          return { ...specification, ...formData };
        }
        return specification;
      });
      setSpecifications(updatedSpecifications);
      setIsModalOpen(false);
    } catch (error) {
      setError('Ошибка при обновлении спецификации: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBreakdown = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/get/specificationBreakdown/${id}`);
      setBreakdownData(response.data);
      setIsBreakdownModalOpen(true);
    } catch (error) {
      setError('Ошибка при разложении спецификации: ' + error.message);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Спецификации</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Parent ID</th>
              <th>Description</th>
              <th>Quantity Per Parent</th>
              <th>Measure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {specifications.map(specification => (
              <tr key={specification.Id}>
                <td>{specification.Id}</td>
                <td>{specification.ParentId}</td>
                <td>{specification.Description}</td>
                <td>{specification.QuantityPerParent}</td>
                <td>{specification.Measure}</td>
                <td>
                  <button onClick={() => handleDeleteSpecification(specification.Id)}>Удалить</button>
                  <button onClick={() => handleUpdateSpecification(specification)}>Обновить</button>
                  <button onClick={() => handleBreakdown(specification.Id)}>Разложить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <CreateSpecificationForm />
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Обновление спецификации</h2>
            <form onSubmit={handleModalSubmit}>
              <div>
                <label htmlFor="ParentId">ParentId:</label>
                <input
                  type="number"
                  id="ParentId"
                  name="ParentId"
                  value={formData.ParentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Description">Description:</label>
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
                <label htmlFor="QuantityPerParent">Quantity Per Parent:</label>
                <input
                  type="number"
                  id="QuantityPerParent"
                  name="QuantityPerParent"
                  value={formData.QuantityPerParent}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Measure">Measure:</label>
                <input
                  type="text"
                  id="Measure"
                  name="Measure"
                  value={formData.Measure}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Сохранить</button>
            </form>
          </div>
        </div>
      )}
      {isBreakdownModalOpen && (
        <BreakdownModal
          breakdownData={breakdownData}
          onClose={handleBreakdownModalClose}
        />
      )}
    </div>
  );
};

export default Specifications;
