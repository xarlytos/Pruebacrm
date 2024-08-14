import React, { useState, useEffect } from 'react';
import './TablaplanesclienteDuplicado.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const TablaClientesDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    nombre: true,
    email: true,
    telefono: true,
    plan: true
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/clientes/');
        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }
        const clientes = await response.json();

        // Mapear los datos para que coincidan con los campos usados en la tabla
        const mappedClientes = clientes.map(cliente => ({
          id: cliente._id,
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          plan: cliente.plan || 'Sin plan'
        }));

        setData(mappedClientes);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

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
