import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateStockForm from './CreateStockForm';
import StockBalance from './StockBalance';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    SpecificationId: '',
    Receivedquantity: '',
    Shippedquantity: '',
    Dateoperation: ''
  });
  const [balanceDate, setBalanceDate] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get/stocks');
        setStocks(response.data);
      } catch (error) {
        setError('Ошибка при получении данных: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleDeleteStock = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/stocks/${id}`);
      setStocks(stocks.filter(stock => stock.Id !== id));
    } catch (error) {
      setError('Ошибка при удалении заказа: ' + error.message);
    }
  };

  const handleUpdateStock = (stock) => {
    setSelectedStock(stock);
    setFormData({
      Id: stock.Id,
      SpecificationId: stock.SpecificationId,
      Receivedquantity: stock.Receivedquantity,
      Shippedquantity: stock.Shippedquantity,
      Dateoperation: new Date(stock.Dateoperation).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedStock(null);
    setIsModalOpen(false);
  };

  const handleModalSubmit = async () => {
    try {
      const data = {
        Id: selectedStock.Id,
        SpecificationId: formData.SpecificationId,
        Receivedquantity: formData.Receivedquantity,
        Shippedquantity: formData.Shippedquantity,
        Dateoperation: formData.Dateoperation,
      };
      await axios.put(`http://localhost:5000/put/stocks`, data);
      const updatedStocks = stocks.map(stock => {
        if (stock.Id === selectedStock.Id) {
          return { ...stock, ...formData };
        }
        return stock;
      });
      setStocks(updatedStocks);
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
      <h1>Склад</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>SpecificationId</th> 
              <th>Dateoperation</th>
              <th>Receivedquantity</th>
              <th>Shippedquantity</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map(stock => (
              <tr key={stock.Id}>
                <td>{stock.Id}</td>
                <td>{stock.SpecificationId}</td>
                <td>{new Date(stock.Dateoperation).toISOString().split('T')[0]}</td>
                <td>{stock.Receivedquantity}</td>
                <td>{stock.Shippedquantity}</td>
                <td>
                  <button onClick={() => handleDeleteStock(stock.Id)}>Удалить</button>
                  <button onClick={() => handleUpdateStock(stock)}>Обновить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <CreateStockForm />
        <div>
          <label htmlFor="balanceDate">Введите дату для подсчета остатков:</label>
          <input
            type="date"
            id="balanceDate"
            name="balanceDate"
            value={balanceDate}
            onChange={e => setBalanceDate(e.target.value)}
          />
          {balanceDate && <StockBalance date={balanceDate} />}
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Обновление заказа</h2>
            <form onSubmit={handleModalSubmit}>
              <div>
                <label htmlFor="Id">ID :</label>
                <input
                  type="number"
                  id="Id"
                  name="Id"
                  value={selectedStock.Id}
                  onChange={handleChange}
                  required
                  disabled
                />
              </div>
              <div>
                <label htmlFor="SpecificationId">SpecificationId:</label>
                <input
                  type="number"
                  id="SpecificationId"
                  name="SpecificationId"
                  value={formData.SpecificationId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Dateoperation">Дата операции:</label>
                <input
                  type="date"
                  id="Dateoperation"
                  name="Dateoperation"
                  value={formData.Dateoperation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Receivedquantity">Получено количество:</label>
                <input
                  type="number"
                  id="Receivedquantity"
                  name="Receivedquantity"
                  value={formData.Receivedquantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="Shippedquantity">Отгружено количество:</label>
                <input
                  type="number"
                  id="Shippedquantity"
                  name="Shippedquantity"
                  value={formData.Shippedquantity}
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

export default Stocks;
