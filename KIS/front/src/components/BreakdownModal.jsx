import React from 'react';
import Table from 'react-bootstrap/Table'

const BreakdownModal = ({ breakdownData, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Разложение продукта</h2>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Parent ID</th>
              <th>Name</th>
              <th>Measure</th>
              <th>QuantityPerParent</th>
              <th>Calories</th>
            </tr>
          </thead>
          <tbody>
            {breakdownData.map(item => (
              <tr key={item.Id}>
                <td>{item.Id}</td>
                <td>{item.ParentId}</td>
                <td>{item.Name}</td>
                <td>{item.Measure}</td>
                <td>{item.QuantityPerParent}</td>
                <td>{item.Calories}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default BreakdownModal;
