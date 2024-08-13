import React, { useState } from 'react';
import './WidgetGastoPopup.css';

const initialData = [
  {
    numero: 'G001',
    fecha: '2024-07-18',
    estado: 'Pagado',
    proveedor: 'Proveedor A',
    monto: '$500',
    tipo: 'Fijo'
  },
  {
    numero: 'G002',
    fecha: '2024-07-19',
    estado: 'Pendiente',
    proveedor: 'Proveedor B',
    monto: '$1200',
    tipo: 'Variable'
  },
  // Añade más filas según sea necesario
];

const WidgetGastoPopup = ({ theme, setTheme }) => {
  const [data, setData] = useState(initialData);
  const [filterText, setFilterText] = useState('');
  const [isGastoDropdownOpen, setIsGastoDropdownOpen] = useState(false);
  const [newGasto, setNewGasto] = useState({
    numero: '',
    fecha: '',
    estado: '',
    proveedor: '',
    monto: '',
    tipo: ''
  });

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    newData[index].estado = newData[index].estado === 'Pagado' ? 'Pendiente' : 'Pagado';
    setData(newData);
  };

  const toggleGastoDropdown = () => {
    setIsGastoDropdownOpen(!isGastoDropdownOpen);
  };

  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setNewGasto({ ...newGasto, [name]: value });
  };

  const handleAddGasto = (e) => {
    e.preventDefault();
    setData([...data, newGasto]);
    setNewGasto({
      numero: '',
      fecha: '',
      estado: '',
      proveedor: '',
      monto: '',
      tipo: ''
    });
    setIsGastoDropdownOpen(false);
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`popup-widget-gasto ${theme}`}>
      <h3 className="popup-gasto-title">Gastos</h3>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Buscar gasto..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={`${theme}`}
        />
        <div className="gasto-button-container">
          <div className="dropdown">
            <button onClick={toggleGastoDropdown} className={`${theme}`}>Añadir Gasto</button>
            {isGastoDropdownOpen && (
              <div className={`dropdown-content ${theme}`}>
                <h3>Añadir Gasto</h3>
                <form onSubmit={handleAddGasto}>
                  <input 
                    type="text" 
                    name="numero" 
                    placeholder="Número de Gasto" 
                    value={newGasto.numero} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="fecha" 
                    placeholder="Fecha" 
                    value={newGasto.fecha} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="estado" 
                    placeholder="Estado" 
                    value={newGasto.estado} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="proveedor" 
                    placeholder="Proveedor" 
                    value={newGasto.proveedor} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="monto" 
                    placeholder="Monto" 
                    value={newGasto.monto} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="tipo" 
                    placeholder="Tipo (Fijo/Variable)" 
                    value={newGasto.tipo} 
                    onChange={handleGastoChange} 
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
            <th>Número de Gasto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Proveedor</th>
            <th>Monto</th>
            <th>Gasto (Fijo/Variable)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{item.numero}</td>
              <td>{item.fecha}</td>
              <td>{item.estado}</td>
              <td>{item.proveedor}</td>
              <td>{item.monto}</td>
              <td>{item.tipo}</td>
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
      <button onClick={toggleTheme} className={`theme-toggle-btn ${theme}`}>Cambiar Tema</button>
    </div>
  );
};

export default WidgetGastoPopup;
