import React, { useState } from 'react';
import './widgetbonosDuplicado.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const initialData = [
  {
    numero: 'B001',
    fecha: '2024-07-18',
    estado: 'Activo',
    beneficiario: 'Empleado A',
    monto: '$500',
    tipo: 'Desempeño'
  },
  {
    numero: 'B002',
    fecha: '2024-07-19',
    estado: 'Pendiente',
    beneficiario: 'Empleado B',
    monto: '$1200',
    tipo: 'Antigüedad'
  },
];

const BonosDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState(initialData);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    numero: true,
    fecha: true,
    estado: true,
    beneficiario: true,
    monto: true,
    tipo: true
  });

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    newData[index].estado = newData[index].estado === 'Activo' ? 'Pendiente' : 'Activo';
    setData(newData);
  };

  const handleCreateBono = () => {
    const newBono = {
      numero: `B${(data.length + 1).toString().padStart(3, '0')}`,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'Activo',
      beneficiario: `Empleado ${String.fromCharCode(65 + data.length)}`,
      monto: '$0',
      tipo: 'Desempeño'
    };
    setData([...data, newBono]);
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className={`widget-bonosDup ${theme}`}>
      <h2 className={theme}>Bonos</h2>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Buscar bono..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={`input-${theme}`}
        />
        <button className={`filter-btn ${theme}`} onClick={handleCreateBono}>Crear Bono</button>
        {isEditMode && (
          <ColumnDropdown 
            selectedColumns={visibleColumns} 
            handleColumnToggle={handleColumnToggle} 
          />
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            {visibleColumns.numero && <th>Número de Bono</th>}
            {visibleColumns.fecha && <th>Fecha</th>}
            {visibleColumns.estado && <th>Estado</th>}
            {visibleColumns.beneficiario && <th>Beneficiario</th>}
            {visibleColumns.monto && <th>Monto</th>}
            {visibleColumns.tipo && <th>Tipo de Bono</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              {visibleColumns.numero && <td>{item.numero}</td>}
              {visibleColumns.fecha && <td>{item.fecha}</td>}
              {visibleColumns.estado && <td>{item.estado}</td>}
              {visibleColumns.beneficiario && <td>{item.beneficiario}</td>}
              {visibleColumns.monto && <td>{item.monto}</td>}
              {visibleColumns.tipo && <td>{item.tipo}</td>}
              <td>
                <div className="dropdown options-dropdown">
                  <button className={`dropdown-toggle ${theme}`}>...</button>
                  <div className={`dropdown-menu ${theme}`}>
                    <button className={`dropdown-item ${theme}`} onClick={() => handleChangeStatus(index)}>
                      Cambiar Estado
                    </button>
                    <button className={`dropdown-item ${theme}`}>Opción 2</button>
                    <button className={`dropdown-item ${theme}`}>Opción 3</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BonosDuplicado;
