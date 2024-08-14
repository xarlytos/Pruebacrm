import React, { useState, useEffect } from 'react';
import './WidgetPrevisiones.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import NavbarPrevisionesFiltros from './NavbarPrevisionesFiltros';
import WidgetRemoveButton from '../Componentepanelcontrol/ComponentesReutilizables/WidgetRemoveButton';
import axios from 'axios';

const metodoOptions = ['stripe', 'banco', 'efectivo', 'mixto'];

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const WidgetPrevisiones = ({ onTitleClick, isEditMode, handleRemoveItem, theme }) => {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    numero: true,
    fecha: true,
    monto: true,
    pagadoPor: true,
    metodo: true,
    estatus: true
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    metodo: [],
    minMonto: '',
    maxMonto: '',
    estatus: ''
  });
  const [isIngresoDropdownOpen, setIsIngresoDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isMetodoDropdownOpen, setIsMetodoDropdownOpen] = useState(false);
  const [newIngreso, setNewIngreso] = useState({
    cantidad: '',
    fecha: '',
    metodoPago: '',
    descripcion: '',
    cliente: ''  // Campo para almacenar el ID del cliente seleccionado
  });

  useEffect(() => {
    const today = new Date();
    const next30Days = new Date(today);
    next30Days.setDate(today.getDate() + 30);

    axios.get(`${API_BASE_URL}/api/incomes/`)
      .then(response => {
        const upcomingIncomes = response.data.filter(income => {
          const incomeDate = new Date(income.fecha);
          return incomeDate >= today && incomeDate <= next30Days;
        });
        setData(upcomingIncomes);
      })
      .catch(error => {
        console.error('Error fetching total ingresos:', error);
      });

    // Obtener la lista de clientes
    axios.get(`${API_BASE_URL}/api/clientes/`)
      .then(response => {
        setClients(response.data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });

  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    newData[index].estatus = newData[index].estatus === 'Completado' ? 'Pendiente' : 'Completado';
    setData(newData);
  };

  const toggleIngresoDropdown = () => {
    setIsIngresoDropdownOpen(!isIngresoDropdownOpen);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const toggleMetodoDropdown = () => {
    setIsMetodoDropdownOpen(!isMetodoDropdownOpen);
  };

  const handleIngresoChange = (e) => {
    const { name, value } = e.target;
    setNewIngreso({ ...newIngreso, [name]: value });
  };

  const handleAddIngreso = (e) => {
    e.preventDefault();
    
    axios.post(`${API_BASE_URL}/api/incomes/`, newIngreso)
      .then(response => {
        setData([...data, response.data]);
        setNewIngreso({
          cantidad: '',
          fecha: '',
          metodoPago: '',
          descripcion: '',
          cliente: ''  // Reiniciar el campo cliente
        });
        setIsIngresoDropdownOpen(false);
      })
      .catch(error => {
        console.error('Error creating new ingreso:', error);
      });
  };

  const clearFilter = (filterKey) => {
    if (filterKey.startsWith('metodo-')) {
      const index = parseInt(filterKey.split('-')[1], 10);
      setFilters({
        ...filters,
        metodo: filters.metodo.filter((_, i) => i !== index)
      });
    } else {
      setFilters({ ...filters, [filterKey]: filterKey === 'metodo' ? [] : '' });
    }
  };

  const applyFilters = (items) => {
    return items.filter((item) => {
      const startDateCondition = filters.startDate ? new Date(item.fecha) >= new Date(filters.startDate) : true;
      const endDateCondition = filters.endDate ? new Date(item.fecha) <= new Date(filters.endDate) : true;
      const metodoCondition = filters.metodo.length > 0 ? filters.metodo.includes(item.metodo) : true;
      const minMontoCondition = filters.minMonto ? item.cantidad >= parseFloat(filters.minMonto) : true;
      const maxMontoCondition = filters.maxMonto ? item.cantidad <= parseFloat(filters.maxMonto) : true;
      const estatusCondition = filters.estatus ? item.estatus === filters.estatus : true;
      return startDateCondition && endDateCondition && metodoCondition && minMontoCondition && maxMontoCondition && estatusCondition;
    });
  };

  const filteredData = applyFilters(
    data.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
  );

  const handleFilterFieldChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleMethodChange = (method) => {
    const newMetodo = filters.metodo.includes(method)
      ? filters.metodo.filter(m => m !== method)
      : [...filters.metodo, method];
    setFilters({ ...filters, metodo: newMetodo });
  };

  const handleFilterToggleChange = (field, value) => {
    setFilters({ ...filters, [field]: filters[field] === value ? '' : value });
  };

  return (
    <div className={`widget-previsiones ${theme}`}>
      <h2 onClick={onTitleClick}>Ingresos Esperados</h2>
      <WidgetRemoveButton isEditMode={isEditMode} handleRemoveItem={handleRemoveItem} itemId="widgetPrevisiones" />
      <div className="controls">
        <input 
          type="text" 
          placeholder="Buscar previsión..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={`widget-filter-input ${theme}`}
        />
        <div className="ingreso-button-container">
          <div className="dropdown">
            <button className={`ingreso-button ${theme}`} onClick={toggleIngresoDropdown}>Añadir Ingreso Especial</button>
            {isIngresoDropdownOpen && (
              <div className={`Prevdropdown-content ${theme}`}>
                <h3>Añadir Ingreso</h3>
                <form onSubmit={handleAddIngreso}>
                  <input 
                    type="number" 
                    name="cantidad" 
                    placeholder="Cantidad" 
                    value={newIngreso.cantidad} 
                    onChange={handleIngresoChange} 
                    required
                  />
                  <input 
                    type="date" 
                    name="fecha" 
                    placeholder="Fecha" 
                    value={newIngreso.fecha} 
                    onChange={handleIngresoChange} 
                    required
                  />
                  <select 
                    name="metodoPago" 
                    value={newIngreso.metodoPago} 
                    onChange={handleIngresoChange}
                    required
                  >
                    <option value="">Seleccione Método</option>
                    {metodoOptions.map((method, index) => (
                      <option key={index} value={method}>{method}</option>
                    ))}
                  </select>
                  <input 
                    type="text" 
                    name="descripcion" 
                    placeholder="Descripción" 
                    value={newIngreso.descripcion} 
                    onChange={handleIngresoChange} 
                  />
                  <select 
                    name="cliente" 
                    value={newIngreso.cliente} 
                    onChange={handleIngresoChange}
                    required
                  >
                    <option value="">Seleccione Cliente</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>{client.nombre}</option>  // Asume que los clientes tienen un campo `nombre`
                    ))}
                  </select>
                  <button type="submit" className={`ingreso-button ${theme}`}>Añadir</button>
                </form>
              </div>
            )}
          </div>
          <div className="dropdownFilters">
            <button className={`ingreso-button ${theme}`} onClick={toggleFilterDropdown}>Filtros</button>
            {isFilterDropdownOpen && (
              <div className={`Prevdropdown-content ${theme}`}>
                <div className="Prevprevisiones-filtros">
                  <div className="Prevfilter-field">
                    <label>Fecha Inicio:</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={filters.startDate} 
                      onChange={handleFilterFieldChange} 
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Fecha Fin:</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={filters.endDate} 
                      onChange={handleFilterFieldChange} 
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Monto Mín:</label>
                    <input 
                      type="number" 
                      name="minMonto" 
                      value={filters.minMonto} 
                      onChange={handleFilterFieldChange} 
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Monto Máx:</label>
                    <input 
                      type="number" 
                      name="maxMonto" 
                      value={filters.maxMonto} 
                      onChange={handleFilterFieldChange} 
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>
                  <div className="Prevfilter-field">
                    <label>Estatus:</label>
                    <button 
                      type="button" 
                      onClick={() => handleFilterToggleChange('estatus', 'Completado')}
                      className={`ingreso-button ${filters.estatus === 'Completado' ? 'active' : ''} ${theme}`}
                    >
                      Completado
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleFilterToggleChange('estatus', 'Pendiente')}
                      className={`ingreso-button ${filters.estatus === 'Pendiente' ? 'active' : ''} ${theme}`}
                    >
                      Pendiente
                    </button>
                  </div>
                  <div className="Prevfilter-field">
                    <label>Método:</label>
                    <div className="Prevdropdown">
                      <button className={`dropdown-toggle ${theme}`} onClick={toggleMetodoDropdown}>Seleccionar Método</button>
                      {isMetodoDropdownOpen && (
                        <div className={`Prevdropdown-menu ${theme}`}>
                          {metodoOptions.map((method) => (
                            <label key={method} className={`Prevdropdown-item ${theme}`}>
                              <input
                                type="checkbox"
                                checked={filters.metodo.includes(method)}
                                onChange={() => handleMethodChange(method)}
                              />
                              {method}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {isEditMode && (
          <ColumnDropdown selectedColumns={visibleColumns} handleColumnToggle={handleColumnToggle} />
        )}
      </div>
      <NavbarPrevisionesFiltros filters={filters} clearFilter={clearFilter} />
      <table className={`widget-table ${theme}`}>
        <thead>
          <tr>
            <th></th>
            {visibleColumns.numero && <th>Número</th>}
            {visibleColumns.fecha && <th>Fecha</th>}
            {visibleColumns.monto && <th>Monto</th>}
            {visibleColumns.pagadoPor && <th>Pagado por</th>}
            {visibleColumns.metodo && <th>Método</th>}
            {visibleColumns.estatus && <th>Estatus</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
  {filteredData.map((item, index) => (
    <tr key={index}>
      <td><input type="checkbox" /></td>
      {visibleColumns.numero && <td>{item.numero || 'N/A'}</td>}
      {visibleColumns.fecha && <td>{item.fecha}</td>}
      {visibleColumns.monto && <td>€{item.cantidad}</td>}
      {visibleColumns.pagadoPor && (
        <td>
          {item.cliente ? item.cliente.nombre : 'No asignado'}
        </td>
      )}
      {visibleColumns.metodo && <td>{item.metodoPago}</td>}
      {visibleColumns.estatus && <td>{item.estatus || 'N/A'}</td>}
      <td>
        <div className="dropdown options-dropdown">
          <button className={`dropdown-toggle options-btn ${theme}`}>...</button>
          <div className={`dropdown-menu options-menu ${theme}`}>
            <button className={`dropdown-item ${theme}`} onClick={() => handleChangeStatus(index)}>
              Cambiar Estatus
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

export default WidgetPrevisiones;
