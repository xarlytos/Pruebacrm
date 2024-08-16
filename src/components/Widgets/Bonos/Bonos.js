import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widgetbonos.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Bonos = ({ isEditMode, onTitleClick, theme }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    fechaComienzo: true,
    fechaExpiracion: true,
    estado: true,
    beneficiario: true,
    monto: true,
    tipo: true
  });
  const [formData, setFormData] = useState({
    nombre: '',
    cliente: '',
    tipo: '',
    descripcion: '',
    fechaExpiracion: '',
    fechaComienzo: '',
    servicio: '',
    sesiones: '',
    fechaVenta: '',
    precio: '',
  });
  const [isBonoDropdownOpen, setIsBonoDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBonos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bonos`);
        console.log('Bonos fetched from server:', response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching bonos:', error);
      }
    };

    fetchBonos();
  }, []);

  const toggleBonoDropdown = () => {
    setIsBonoDropdownOpen(!isBonoDropdownOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log('Form data updated:', { ...formData, [name]: value });
  };

  const handleCreateBono = async (e) => {
    e.preventDefault();
    console.log('handleCreateBono triggered');

    const newBono = {
      ...formData,
      nombre: `B${(data.length + 1).toString().padStart(3, '0')}`,
      fechaCreacion: new Date().toISOString()
    };

    console.log('Creando bono con los siguientes datos:', newBono);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bonos`, newBono);
      console.log('Bono creado en el servidor:', response.data);
      setData([...data, response.data]);
      setFormData({
        nombre: '',
        cliente: '',
        tipo: '',
        descripcion: '',
        fechaExpiracion: '',
        fechaComienzo: '',
        servicio: '',
        sesiones: '',
        fechaVenta: '',
        precio: '',
      });
      setIsBonoDropdownOpen(false);
    } catch (error) {
      console.error('Error al crear el bono:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    const estadosPosibles = ['Activo', 'No Activo', 'Pendiente'];
    let estadoActualIndex = estadosPosibles.indexOf(newData[index].estado);
    newData[index].estado = estadosPosibles[(estadoActualIndex + 1) % estadosPosibles.length];
    setData(newData);
  };

  const handleFilterBonos = () => {
    const filteredData = data.filter(item => item.estado === 'Activo');
    setData(filteredData);
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className={`Widget-bono-widget-bonos ${theme}`}>
      <h2 onClick={onTitleClick}>Bonos</h2>
      <div className="Widget-bono-controls">
        <input
          type="text"
          placeholder="Buscar por cualquier campo..."
          value={filterText}
          onChange={handleFilterChange}
          className={`panelcontrol-filter-input ${theme}`}
        />
        <button className={`Widget-bono-filter-btn ${theme}`} onClick={handleFilterBonos}>Filtrar Activos</button>
        
        <div className="Widget-bono-bono-button-container">
          <div className="Widget-bono-dropdown">
            <button className={`Widget-bono-bono-button ${theme}`} onClick={toggleBonoDropdown}>Crear Bono</button>
            {isBonoDropdownOpen && (
              <div className={`Widget-bono-dropdown-content ${theme}`}>
                <h3>Añadir Bono</h3>
                <form onSubmit={handleCreateBono}>
                  <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre" 
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                    required
                  />
                  <input 
                    type="text" 
                    name="cliente" 
                    placeholder="Cliente ID" 
                    value={formData.cliente} 
                    onChange={handleInputChange} 
                  />
                  <select 
                    name="tipo" 
                    value={formData.tipo} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Descuento">Descuento</option>
                    <option value="Promoción">Promoción</option>
                    <option value="Cashback">Cashback</option>
                    <option value="Regalo">Regalo</option>
                  </select>
                  <textarea 
                    name="descripcion" 
                    placeholder="Descripción" 
                    value={formData.descripcion} 
                    onChange={handleInputChange}
                  />
                  <input 
                    type="date" 
                    name="fechaComienzo" 
                    placeholder="Fecha de Comienzo" 
                    value={formData.fechaComienzo} 
                    onChange={handleInputChange} 
                    required
                  />
                  <input 
                    type="date" 
                    name="fechaExpiracion" 
                    placeholder="Fecha de Expiración" 
                    value={formData.fechaExpiracion} 
                    onChange={handleInputChange} 
                    required
                  />
                  <input 
                    type="text" 
                    name="servicio" 
                    placeholder="Servicio" 
                    value={formData.servicio} 
                    onChange={handleInputChange} 
                    required
                  />
                  <input 
                    type="number" 
                    name="sesiones" 
                    placeholder="Sesiones" 
                    value={formData.sesiones} 
                    onChange={handleInputChange} 
                    required
                  />
                  <input 
                    type="date" 
                    name="fechaVenta" 
                    placeholder="Fecha de Venta" 
                    value={formData.fechaVenta} 
                    onChange={handleInputChange} 
                    required
                  />
                  <input 
                    type="number" 
                    name="precio" 
                    placeholder="Precio" 
                    value={formData.precio} 
                    onChange={handleInputChange} 
                    required
                  />
                  <button type="submit" className={`Widget-bono-bono-button ${theme}`}>Añadir</button>
                </form>
              </div>
            )}
          </div>
        </div>
        
        {isEditMode && (
          <ColumnDropdown 
            selectedColumns={visibleColumns} 
            handleColumnToggle={handleColumnToggle} 
            theme={theme}
          />
        )}
      </div>
      <table className={theme}>
        <thead className={theme}>
          <tr>
            <th></th>
            {visibleColumns.nombre && <th>Nombre de Bono</th>}
            {visibleColumns.fechaComienzo && <th>Fecha de Comienzo</th>}
            {visibleColumns.fechaExpiracion && <th>Fecha de Expiración</th>}
            {visibleColumns.estado && <th>Estado</th>}
            {visibleColumns.beneficiario && <th>Beneficiario</th>}
            {visibleColumns.monto && <th>Importe</th>}
            {visibleColumns.tipo && <th>Tipo de Bono</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={theme}>
              <td><input type="checkbox" /></td>
              {visibleColumns.nombre && <td>{item.nombre}</td>}
              {visibleColumns.fechaComienzo && <td>{item.fechaComienzo}</td>}
              {visibleColumns.fechaExpiracion && <td>{item.fechaExpiracion}</td>}
              {visibleColumns.estado && <td>{item.estado}</td>}
              {visibleColumns.beneficiario && <td>{item.beneficiario}</td>}
              {visibleColumns.monto && <td>{item.monto}</td>}
              {visibleColumns.tipo && <td>{item.tipo}</td>}
              <td>
                <div className="Widget-bono-dropdown Widget-bono-options-dropdown">
                  <button className={`Widget-bono-dropdown-toggle Widget-bono-options-btn ${theme}`}>...</button>
                  <div className={`Widget-bono-dropdown-menu Widget-bono-options-menu ${theme}`}>
                    <button className={`Widget-bono-dropdown-item ${theme}`} onClick={() => handleChangeStatus(index)}>
                      Cambiar Estado
                    </button>
                    <button className={`Widget-bono-dropdown-item ${theme}`}>Opción 2</button>
                    <button className={`Widget-bono-dropdown-item ${theme}`}>Opción 3</button>
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

export default Bonos;
