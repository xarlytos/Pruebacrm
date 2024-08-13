import React, { useState } from 'react';
import './TablaplanesclienteDuplicado.css';
import TablaClientesDuplicado from './TablaClientesDuplicado';
import TablaPlanesDuplicado from './TablaPlanesDuplicado';

const TablaplanesclienteDuplicado = ({ isEditMode }) => {
  const [currentTable, setCurrentTable] = useState('planes');

  const handleChangeTable = (table) => {
    setCurrentTable(table);
  };

  return (
    <div className="TablaplanesclienteDup-container">
      <div className="Tablaplanescliente-controls">
        <div className="Tablaplanescliente-button-group">
          <button onClick={() => handleChangeTable('planes')}>Tabla de Planes</button>
          <button onClick={() => handleChangeTable('clientes')}>Tabla de Clientes</button>
        </div>
      </div>
      {currentTable === 'planes' && <TablaPlanesDuplicado isEditMode={isEditMode} />}
      {currentTable === 'clientes' && <TablaClientesDuplicado isEditMode={isEditMode} />}
    </div>
  );
};

export default TablaplanesclienteDuplicado;
