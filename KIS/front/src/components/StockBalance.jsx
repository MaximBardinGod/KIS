import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockBalance = ({ date }) => {
  const [stockBalances, setStockBalances] = useState([]);
  const [decomposition, setDecomposition] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDecompositionLoading, setIsDecompositionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStockBalances = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get/stockBalance?date=${date}`);
        setStockBalances(response.data);
      } catch (error) {
        setError('Ошибка при получении данных: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockBalances();
  }, [date]);

  const handleDecomposeClick = async () => {
    setIsDecompositionLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/get/stockBreakdown?date=${date}`);
      setDecomposition(response.data);
      setIsModalOpen(true);
    } catch (error) {
      setError('Ошибка при выполнении разложения: ' + error.message);
    } finally {
      setIsDecompositionLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDecomposition([]);
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Остатки на складе на {date}</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleDecomposeClick} disabled={isDecompositionLoading}>
        {isDecompositionLoading ? 'Разложение...' : 'Разложить'}
      </button>
      <table>
        <thead>
          <tr>
            <th>ID Спецификации</th>
            <th>Остаток на складе</th>
          </tr>
        </thead>
        <tbody>
          {stockBalances.map(stock => (
            <tr key={stock.Description}>
              <td>{stock.Description}</td>
              <td>{stock.TotalQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            <h2>Результаты разложения на {date}</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Описание</th>
                  <th>Общее количество</th>
                </tr>
              </thead>
              <tbody>
                {decomposition.map(item => (
                  <tr key={item.Id}>
                    <td>{item.Id}</td>
                    <td>{item.Description1}</td>
                    <td>{item.TotalQuantity1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockBalance;
