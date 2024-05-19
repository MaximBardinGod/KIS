import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockBalance = ({ date }) => {
  const [stockBalances, setStockBalances] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Остатки на складе на {date}</h2>
      {error && <p className="error">{error}</p>}
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
    </div>
  );
};

export default StockBalance;
