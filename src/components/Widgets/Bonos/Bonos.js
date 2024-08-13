import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widgetbonos.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const Bonos = ({ isEditMode, onTitleClick, theme }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    numero: true,
    fecha: true,
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
    servicio: '',
    sesiones: '',
    fechaVenta: '',
    precio: '',
  });
  const [isBonoDropdownOpen, setIsBonoDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchBonos = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/bonos');
        console.log('Bonos fetched from server:', response.data);  // Log para la respuesta del GET
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
    console.log('Form data updated:', { ...formData, [name]: value });  // Log para los cambios en el formulario
  };

  const handleCreateBono = async (e) => {
    e.preventDefault();  // Prevenir el comportamiento por defecto del formulario
    console.log('handleCreateBono triggered');  // Este log debe aparecer cuando se envía el formulario

    const newBono = {
      ...formData,
      numero: `B${(data.length + 1).toString().padStart(3, '0')}`,
      fechaCreacion: new Date().toISOString()
    };

    console.log('Creando bono con los siguientes datos:', newBono);  // Log para los datos del bono

    try {
      const response = await axios.post('http://localhost:5005/api/bonos', newBono);
      console.log('Bono creado en el servidor:', response.data);  // Log para la respuesta del POST
      setData([...data, response.data]);
      setFormData({
        nombre: '',
        cliente: '',
        tipo: '',
        descripcion: '',
        fechaExpiracion: '',
        servicio: '',
        sesiones: '',
        fechaVenta: '',
        precio: '',
      });
      setIsBonoDropdownOpen(false); // Cerrar el dropdown después de crear el bono
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
    newData[index].estado = newData[index].estado === 'Activo' ? 'Pendiente' : 'Activo';
    setData(newData);
  };

  const handleFilterBonos = () => {
    const filteredData = data.filter(item => item.estado === 'Activo');
    setData(filteredData);
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      val.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className={`widget-bonos ${theme}`}>
      <h2 onClick={onTitleClick}>Bonos</h2>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Buscar bono..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={`search-input ${theme}`}
        />
        <button className={`filter-btn ${theme}`} onClick={handleFilterBonos}>Filtrar Activos</button>
        
        <div className="bono-button-container">
          <div className="dropdown">
            <button className={`bono-button ${theme}`} onClick={toggleBonoDropdown}>Crear Bono</button>
            {isBonoDropdownOpen && (
              <div className={`dropdown-content ${theme}`}>
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
                  <input 
                    type="text" 
                    name="tipo" 
                    placeholder="Tipo" 
                    value={formData.tipo} 
                    onChange={handleInputChange} 
                    required
                  />
                  <textarea 
                    name="descripcion" 
                    placeholder="Descripción" 
                    value={formData.descripcion} 
                    onChange={handleInputChange}
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
                  <button type="submit" className={`bono-button ${theme}`}>Añadir</button>
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
            <tr key={index} className={theme}>
              <td><input type="checkbox" /></td>
              {visibleColumns.numero && <td>{item.numero}</td>}
              {visibleColumns.fecha && <td>{item.fecha}</td>}
              {visibleColumns.estado && <td>{item.estado}</td>}
              {visibleColumns.beneficiario && <td>{item.beneficiario}</td>}
              {visibleColumns.monto && <td>{item.monto}</td>}
              {visibleColumns.tipo && <td>{item.tipo}</td>}
              <td>
                <div className="dropdown options-dropdown">
                  <button className={`dropdown-toggle options-btn ${theme}`}>...</button>
                  <div className={`dropdown-menu options-menu ${theme}`}>
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

export default Bonos;
