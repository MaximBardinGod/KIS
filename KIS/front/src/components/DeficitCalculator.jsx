import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeficitCalculator = ({ dateForCalculation }) => {
  const [calculationResult, setCalculationResult] = useState({});
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);

  const subtractTotalQuantityById = () => {
    const quantitiesById1 = {};
    tableData1.forEach(item => {
      quantitiesById1[item.Id] = item.TotalQuantity1;
    });

    const quantitiesById2 = {};
    tableData2.forEach(item => {
      quantitiesById2[item.Id] = item.TotalQuantity1;
    });

    const result = {};
    Object.keys(quantitiesById1).forEach(id => {
      if (quantitiesById2[id] !== undefined) {
        result[id] = quantitiesById1[id] - quantitiesById2[id];
      }
    });

    setCalculationResult(result);
  };

  useEffect(() => {
    if (tableData1.length > 0 && tableData2.length > 0) {
      subtractTotalQuantityById();
    }
  }, [tableData1, tableData2]);

  useEffect(() => {
    if (dateForCalculation) {
      getCalculationforDate();
    }
  }, [dateForCalculation]);

  const getCalculationforDate = () => {
    axios.get(`http://localhost:5000/get/stockBreakdown?date=${dateForCalculation}`)
      .then((response1) => {
        setTableData1(response1.data);
        return axios.get(`http://localhost:5000/get/orderBreakdown?date=${dateForCalculation}`);
      })
      .then((response2) => {
        setTableData2(response2.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  

  return (
    <div>
      <h2>Результат расчёта дефицита</h2>
      <table>
        <thead>
          <tr>
            <th>ID спецификации</th>
            <th>Дефицит</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(calculationResult).map(id => (
            <tr key={id}>
              <td>{id}</td>
              <td>{calculationResult[id]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeficitCalculator;
