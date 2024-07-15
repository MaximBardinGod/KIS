import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateProductForm from './CreateProductForm';
import Table from 'react-bootstrap/Table';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    linktopicture: '',
    description: '',
    price: '',
    compound: '',
    calories: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get/products');
        setProducts(response.data); // Assuming response.data is an array
      } catch (error) {
        setError('Ошибка при получении данных: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/product/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      setError('Ошибка при удалении продукта: ' + error.message);
    }
  };

  const handleUpdateProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      type: product.type,
      linktopicture: product.linktopicture,
      description: product.description,
      price: product.price,
      compound: product.compound,
      calories: product.calories
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleModalSubmit = async (e) => {
    try {
      const data = {
        id: selectedProduct.id,
        name: formData.name,
        type: formData.type,
        linktopicture: formData.linktopicture,
        description: formData.description,
        price: formData.price,
        compound: formData.compound,
        calories: formData.calories
      };
      console.log('Sending data:', data);
      await axios.put('http://localhost:5000/put/product', data);
      const updatedProducts = products.map(product => {
        if (product.id === selectedProduct.id) {
          return { ...product, ...formData };
        }
        return product;
      });
      setProducts(updatedProducts);
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
              <th>Название</th>
              <th>Тип</th>
              <th>Ссылка на картинку</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Состав</th>
              <th>Калории</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.type}</td>
                <td>{product.linktopicture}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.compound}</td>
                <td>{product.calories}</td>
                <td>
                  <button onClick={() => handleDeleteProduct(product.id)}>Удалить</button>
                  <button onClick={() => handleUpdateProduct(product)}>Обновить</button>
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
                <label htmlFor="name">Название:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="type">Тип:</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="linktopicture">Ссылка на картинку:</label>
                <input
                  type="text"
                  id="linktopicture"
                  name="linktopicture"
                  value={formData.linktopicture}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Описание:</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="price">Цена:</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="compound">Состав:</label>
                <input
                  type="text"
                  id="compound"
                  name="compound"
                  value={formData.compound}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="calories">Калории:</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories}
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

export default Product;
