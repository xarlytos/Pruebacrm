import React, { useState } from 'react';
import './TablaplanesclienteDuplicado.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const clientesData = [
  {
    id: 'C001',
    nombre: 'Cliente A',
    email: 'clienteA@example.com',
    telefono: '123456789',
    plan: 'Plan Básico'
  },
  {
    id: 'C002',
    nombre: 'Cliente B',
    email: 'clienteB@example.com',
    telefono: '987654321',
    plan: 'Plan Pro'
  },
  {
    id: 'C003',
    nombre: 'Cliente C',
    email: 'clienteC@example.com',
    telefono: '456123789',
    plan: 'Plan Empresarial'
  }
];

const TablaClientesDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState(clientesData);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    nombre: true,
    email: true,
    telefono: true,
    plan: true
  });

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className={`TablaplanesclienteDup-container ${theme}`}>
      <h2 className={theme}>Clientes</h2>
      <div className="Tablaplanescliente-controls">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={filterText}
          onChange={handleFilterChange}
          className={`input-${theme}`}
        />
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
            {visibleColumns.id && <th>ID</th>}
            {visibleColumns.nombre && <th>Nombre</th>}
            {visibleColumns.email && <th>Email</th>}
            {visibleColumns.telefono && <th>Teléfono</th>}
            {visibleColumns.plan && <th>Plan</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              {visibleColumns.id && <td>{item.id}</td>}
              {visibleColumns.nombre && <td>{item.nombre}</td>}
              {visibleColumns.email && <td>{item.email}</td>}
              {visibleColumns.telefono && <td>{item.telefono}</td>}
              {visibleColumns.plan && <td>{item.plan}</td>}
              <td>
                <div className="Tablaplanescliente-dropdown Tablaplanescliente-options-dropdown">
                  <button className={`dropdown-toggle ${theme} options-btn`}>...</button>
                  <div className={`dropdown-menu ${theme} options-menu`}>
                    <button className={`dropdown-item ${theme}`}>Asociar/Cambiar Plan</button>
                    <button className={`dropdown-item ${theme}`}>Ver Historial de Planes</button>
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

export default TablaClientesDuplicado;
