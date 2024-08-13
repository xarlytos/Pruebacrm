// ColumnDropdown.js
import React, { useState } from 'react';
import './ColumnDropdown.css';

const ColumnDropdown = ({ selectedColumns, handleColumnToggle }) => {
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  const toggleColumnDropdown = () => {
    setIsColumnDropdownOpen(!isColumnDropdownOpen);
  };

  return (
    <div className="dropdown-campos">
      <button className="campos-btn" onClick={toggleColumnDropdown}>Campos</button>
      {isColumnDropdownOpen && (
        <div className="dropdown-content column-dropdown">
          <h3>Seleccionar Campos</h3>
          {Object.keys(selectedColumns).map(column => (
            <div key={column} className="dropdown-item">
              <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
              <button onClick={() => handleColumnToggle(column)}>
                {selectedColumns[column] ? 'x' : '+'}
              </button>
            </div>
          ))}
          <button className="close-dropdown-btn" onClick={toggleColumnDropdown}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default ColumnDropdown;
