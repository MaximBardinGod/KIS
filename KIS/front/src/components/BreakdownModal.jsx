import React from 'react';

const BreakdownModal = ({ breakdownData, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Разложение спецификации</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Parent ID</th>
              <th>Description</th>
              <th>Measure</th>
              <th>Total Required For Production</th>
            </tr>
          </thead>
          <tbody>
            {breakdownData.map(item => (
              <tr key={item.Id}>
                <td>{item.Id}</td>
                <td>{item.ParentId}</td>
                <td>{item.Description}</td>
                <td>{item.Measure}</td>
                <td>{item.TotalRequiredForProduction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BreakdownModal;
