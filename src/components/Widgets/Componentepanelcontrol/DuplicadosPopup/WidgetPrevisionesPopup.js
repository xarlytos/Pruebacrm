import React, { useState, useEffect } from 'react';
import './WidgetPrevisionesPopup.css';
import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const WidgetPrevisionesPopup = ({ theme, setTheme, setIngresosEsperados }) => {
  const [data, setData] = useState([]); 
  const [filterText, setFilterText] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusPopupRow, setStatusPopupRow] = useState(null);
  const [isIngresoDropdownOpen, setIsIngresoDropdownOpen] = useState(false);
  const [newIngreso, setNewIngreso] = useState({
    numero: '',
    fecha: '',
    monto: '',
    pagadoPor: '',
    metodo: '',
    estatus: ''
  });

  // Hacer una solicitud para obtener los ingresos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/incomes/`);
        setData(response.data);
        setIngresosEsperados(response.data); // Actualiza el estado en el componente padre si es necesario
      } catch (error) {
        console.error('Error al cargar los ingresos:', error);
      }
    };


    fetchData();
  }, [setIngresosEsperados]);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleConfirm = (index) => {
    setSelectedRow(index);
  };

  const handleMethodSelect = (method) => {
    const newData = [...data];
    newData[selectedRow].estatus = 'Completado';
    newData[selectedRow].metodo = method;
    setData(newData);
    setIngresosEsperados(newData); // Actualiza ingresosEsperados en el estado padre
    setSelectedRow(null);
  };

  const handleStatusChange = (index, status) => {
    const newData = [...data];
    newData[index].estatus = status;
    if (status === 'Pendiente') {
      newData[index].metodo = '';
    }
    setData(newData);
    setIngresosEsperados(newData); // Actualiza ingresosEsperados en el estado padre
    setStatusPopupRow(null);
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      val && val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const toggleIngresoDropdown = () => {
    setIsIngresoDropdownOpen(!isIngresoDropdownOpen);
  };

  const handleIngresoChange = (e) => {
    const { name, value } = e.target;
    setNewIngreso({ ...newIngreso, [name]: value });
  };

  const handleAddIngreso = (e) => {
    e.preventDefault();
    const newData = [...data, newIngreso];
    setData(newData);
    setIngresosEsperados(newData); // Actualiza ingresosEsperados en el estado padre
    setNewIngreso({
      numero: '',
      fecha: '',
      monto: '',
      pagadoPor: '',
      metodo: '',
      estatus: ''
    });
    setIsIngresoDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`popup-widget-previsiones ${theme}`}>
      <h3 className="popup-previsiones-title">Ingresos</h3>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Buscar previsión..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={`${theme}`}
        />
        <div className="ingreso-button-container">
          <div className="dropdown">
            <button className={`dropdown-toggle ${theme}`} onClick={toggleIngresoDropdown}>Añadir Ingreso Especial</button>
            {isIngresoDropdownOpen && (
              <div className={`dropdown-content ${theme}`}>
                <h3>Añadir Ingreso</h3>
                <form onSubmit={handleAddIngreso}>
                  <input 
                    type="text" 
                    name="numero" 
                    placeholder="Número" 
                    value={newIngreso.numero} 
                    onChange={handleIngresoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="date" 
                    name="fecha" 
                    placeholder="Fecha" 
                    value={newIngreso.fecha} 
                    onChange={handleIngresoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="number" 
                    name="monto" 
                    placeholder="Monto" 
                    value={newIngreso.monto} 
                    onChange={handleIngresoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="pagadoPor" 
                    placeholder="Pagado por" 
                    value={newIngreso.pagadoPor} 
                    onChange={handleIngresoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="metodo" 
                    placeholder="Método" 
                    value={newIngreso.metodo} 
                    onChange={handleIngresoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="estatus" 
                    placeholder="Estatus" 
                    value={newIngreso.estatus} 
                    onChange={handleIngresoChange} 
                    className={`${theme}`}
                  />
                  <button type="submit">Añadir</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Número</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Pagado por</th>
            <th>Método</th>
            <th>Estatus</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{item._id}</td>
              <td>{new Date(item.fecha).toLocaleDateString()}</td>
              <td>{item.cantidad}</td>
              <td>{item.cliente?.nombre}</td>
              <td className={item.estatus === 'Pendiente' ? 'translucent' : ''}>
                {item.metodoPago}
              </td>
              <td>{item.estatus || 'Pendiente'}</td>
              <td>
                {item.estatus === 'Pendiente' ? (
                  <button className="confirm-btn" onClick={() => handleConfirm(index)}>Confirmar</button>
                ) : (
                  <button className="options-btn" onClick={() => setStatusPopupRow(index)}>...</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRow !== null && (
        <div className="method-popup">
          <div className="method-popup-content">
            <h4>Seleccionar Método</h4>
            <button className="method-btn" onClick={() => handleMethodSelect('Efectivo')}>Efectivo</button>
            <button className="method-btn" onClick={() => handleMethodSelect('Otro Método')}>Otro Método</button>
            <button className="close-btn" onClick={() => setSelectedRow(null)}>Cerrar</button>
          </div>
        </div>
      )}
      {statusPopupRow !== null && (
        <div className="status-popup">
          <div className="status-popup-content">
            <button className="close-btn" onClick={() => setStatusPopupRow(null)}>×</button>
            <button className="status-btn" onClick={() => handleStatusChange(statusPopupRow, 'Completado')}>Completado</button>
            <button className="status-btn" onClick={() => handleStatusChange(statusPopupRow, 'Pendiente')}>Pendiente</button>
          </div>
        </div>
      )}
      <button onClick={toggleTheme} className={`theme-toggle-btn ${theme}`}>Cambiar Tema</button>
    </div>
  );
};

export default WidgetPrevisionesPopup;
