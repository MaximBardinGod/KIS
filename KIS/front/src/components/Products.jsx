import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProductForm from './CreateProductForm';
import BreakdownModal from './BreakdownModal';
import Table from 'react-bootstrap/Table'

const Product = () => {
  const [Product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);  
  const [breakdownData, setBreakdownData] = useState([]);

  const [formData, setFormData] = useState({
    ParentId: '',
    Name: '',
    QuantityPerParent: '',
    Measure: '',
    Calories:''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get/Products');
        setProduct(response.data);
      } catch (error) {
        setError('Ошибка при получении данных: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/Product/${id}`);
      setProduct(Product.filter(Product => Product.Id !== id));
    } catch (error) {
      setError('Ошибка при удалении продукта: ' + error.message);
    }
  };

  const handleUpdateProduct = (Product) => {
    setSelectedProduct(Product);
    setFormData({
      ParentId: Product.ParentId,
      Name: Product.Name,
      QuantityPerParent: Product.QuantityPerParent,
      Measure: Product.Measure,
      Calories: Product.Calories
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleBreakdownModalClose = () => {
    setIsBreakdownModalOpen(false);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        Id: selectedProduct.Id,
        ParentId: formData.ParentId,
        Name: formData.Name,
        QuantityPerParent: formData.QuantityPerParent,
        Measure: formData.Measure,
        Calories: formData.Calories
      };
      console.log('Sending data:', data);
      await axios.put('http://localhost:5000/put/Product', data);
      const updatedProduct = Product.map(Product => {
        if (Product.Id === selectedProduct.Id) {
          return { ...Product, ...formData };
        }
        return Product;
      });
      setProduct(updatedProduct);
      setIsModalOpen(false);
    } catch (error) {
      setError('Ошибка при обновлении продукта: ' + error.message);
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
      const response = await axios.get(`http://localhost:5000/get/ProductBreakdown/${id}`);
      setBreakdownData(response.data);
      setIsBreakdownModalOpen(true);
    } catch (error) {
      setError('Ошибка при разложении продукта: ' + error.message);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Продукты</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID родителя</th>
              <th>Название</th>
              <th>Количество на родителя</th>
              <th>Количество</th>
              <th>Калории</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {Product.map(Product => (
              <tr key={Product.Id}>
                <td>{Product.Id}</td>
                <td>{Product.ParentId}</td>
                <td>{Product.Name}</td>
                <td>{Product.QuantityPerParent}</td>
                <td>{Product.Measure}</td>
                <td>{Product.Calories}</td>
                <td>
                  <button onClick={() => handleDeleteProduct(Product.Id)}>Удалить</button>
                  <button onClick={() => handleUpdateProduct(Product)}>Обновить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <CreateProductForm />
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Обновление продукта</h2>
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
                <label htmlFor="Name">Name:</label>
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
              <div>
                <label htmlFor="Calories">Calories:</label>
                <input
                  type="number"
                  id="Calories"
                  name="Calories"
                  value={formData.Calories}
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

export default Product;
