import React, { useState } from 'react';
import './widget-facturas.css';
import ModalDeEscaneoDeFacturas from './ModalDeEscaneoDeFacturas';
import CreacionDeFacturas from './CreacionDeFacturas';
import NavbarFiltrosFacturas from './NavbarFiltrosFacturas';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const initialData = [
];

const WidgetFacturas = ({ isEditMode, handleRemoveItem, onTitleClick, theme, setTheme }) => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    estatus: true,
    cliente: true,
    monto: true,
    fecha: true,
    tipo: true,
    plan: true,
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    estatus: '',
    minMonto: '',
    maxMonto: '',
    tipo: '',
    plan: '',
  });
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [optionsOpenIndex, setOptionsOpenIndex] = useState(null);

  const handleFilterChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleColumnToggle = column => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const handleOpenDetailedModal = () => {
    setIsDetailedModalOpen(true);
  };

  const handleCloseDetailedModal = () => {
    setIsDetailedModalOpen(false);
  };

  const toggleColumnDropdown = () => {
    setIsColumnDropdownOpen(!isColumnDropdownOpen);
  };

  const toggleOptions = (index) => {
    setOptionsOpenIndex(optionsOpenIndex === index ? null : index);
  };

  const handleOpenScanModal = () => {
    setIsScanModalOpen(true);
  };

  const handleCloseScanModal = () => {
    setIsScanModalOpen(false);
  };

  const handleOpenCreationModal = () => {
    setIsCreationModalOpen(true);
  };

  const handleCloseCreationModal = () => {
    setIsCreationModalOpen(false);
  };

  const handleAddFactura = (factura) => {
    setData([...data, factura]);
    setIsCreationModalOpen(false);
  };

  const handleFilterFieldChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterToggleChange = (field, value) => {
    setFilters({ ...filters, [field]: filters[field] === value ? '' : value });
  };

  const clearFilter = (filterKey) => {
    setFilters({ ...filters, [filterKey]: '' });
  };

  const applyFilters = (items) => {
    return items.filter((item) => {
      const startDateCondition = filters.startDate ? new Date(item.fecha) >= new Date(filters.startDate) : true;
      const endDateCondition = filters.endDate ? new Date(item.fecha) <= new Date(filters.endDate) : true;
      const estatusCondition = filters.estatus ? item.estatus === filters.estatus : true;
      const minMontoCondition = filters.minMonto ? parseFloat(item.monto.replace(/[^0-9.-]+/g, "")) >= parseFloat(filters.minMonto) : true;
      const maxMontoCondition = filters.maxMonto ? parseFloat(item.monto.replace(/[^0-9.-]+/g, "")) <= parseFloat(filters.maxMonto) : true;
      const tipoCondition = filters.tipo ? item.tipo === filters.tipo : true;
      const planCondition = filters.plan ? item.plan === filters.plan : true;
      return startDateCondition && endDateCondition && estatusCondition && minMontoCondition && maxMontoCondition && tipoCondition && planCondition;
    });
  };

  const filteredData = applyFilters(
    data.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  );

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`WidgetFacturas-widget WidgetFacturas-widget-facturas ${theme}`}>
      <div className="WidgetFacturas-widget-handle"></div>
      <h2 onClick={onTitleClick} className={`widget-title ${theme}`}>Facturas</h2>
      <div className="WidgetFacturas-filter-button">
        <div className="WidgetFacturas-filter-container">
          <input
            type="text"
            placeholder="Filtrar..."
            value={searchTerm}
            onChange={handleFilterChange}
            className={`widget-filter-input ${theme}`}
          />
          <div className="dropdownFilters">
            <button onClick={toggleFilterDropdown} className={`widget-button ${theme}`}>Filtros</button>
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
                    <label>Estatus:</label>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('estatus', 'Pagado')}
                      className={`widget-button ${filters.estatus === 'Pagado' ? 'active' : ''} ${theme}`}
                    >
                      Pagado
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('estatus', 'Pendiente')}
                      className={`widget-button ${filters.estatus === 'Pendiente' ? 'active' : ''} ${theme}`}
                    >
                      Pendiente
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('estatus', 'Cancelado')}
                      className={`widget-button ${filters.estatus === 'Cancelado' ? 'active' : ''} ${theme}`}
                    >
                      Cancelado
                    </button>
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
                    <label>Tipo:</label>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('tipo', 'Creada')}
                      className={`widget-button ${filters.tipo === 'Creada' ? 'active' : ''} ${theme}`}
                    >
                      Creada
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('tipo', 'Escaneada')}
                      className={`widget-button ${filters.tipo === 'Escaneada' ? 'active' : ''} ${theme}`}
                    >
                      Escaneada
                    </button>
                  </div>
                  <div className="Prevfilter-field">
                    <label>Plan:</label>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('plan', 'Básico')}
                      className={`widget-button ${filters.plan === 'Básico' ? 'active' : ''} ${theme}`}
                    >
                      Básico
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('plan', 'Estándar')}
                      className={`widget-button ${filters.plan === 'Estándar' ? 'active' : ''} ${theme}`}
                    >
                      Estándar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFilterToggleChange('plan', 'Premium')}
                      className={`widget-button ${filters.plan === 'Premium' ? 'active' : ''} ${theme}`}
                    >
                      Premium
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="WidgetFacturas-actions">
          {isEditMode && (
            <div className="WidgetFacturas-dropdown-campos">
              <button className={`WidgetFacturas-campos-btn ${theme}`} onClick={toggleColumnDropdown}>Campos</button>
              {isColumnDropdownOpen && (
                <div className={`WidgetFacturas-dropdown-content WidgetFacturas-column-dropdown ${theme}`}>
                  <h3>Seleccionar Campos</h3>
                  {Object.keys(selectedColumns).map(column => (
                    <div key={column} className="WidgetFacturas-dropdown-item">
                      <span>{column.charAt(0).toUpperCase() + column.slice(1)}</span>
                      <button onClick={() => handleColumnToggle(column)}>
                        {selectedColumns[column] ? 'x' : '+'}
                      </button>
                    </div>
                  ))}
                  <button className={`WidgetFacturas-close-dropdown-btn ${theme}`} onClick={toggleColumnDropdown}>Cerrar</button>
                </div>
              )}
            </div>
          )}
          <button className={`WidgetFacturas-scan-btn ${theme}`} onClick={onTitleClick}>Escanear Factura</button>
          <button className={`WidgetFacturas-add-btn ${theme}`} onClick={handleOpenCreationModal}>Añadir Factura</button>
        </div>
      </div>
      <button onClick={toggleTheme} className={`widget-theme-toggle-btn ${theme}`}>Cambiar Tema</button>
      {isEditMode && (
        <ColumnDropdown
          selectedColumns={selectedColumns}
          handleColumnToggle={handleColumnToggle}
          theme={theme}
        />
      )}
      <NavbarFiltrosFacturas filters={filters} clearFilter={clearFilter} theme={theme} />
      <table className={`WidgetFacturas-facturas-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {selectedColumns.estatus && <th>Estatus</th>}
            {selectedColumns.cliente && <th>Cliente</th>}
            {selectedColumns.monto && <th>Monto</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            {selectedColumns.tipo && <th>Tipo</th>}
            {selectedColumns.plan && <th>Plan</th>}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className={theme}>
              <td>
                <input type="checkbox" />
              </td>
              {selectedColumns.estatus && <td>{item.estatus}</td>}
              {selectedColumns.cliente && <td>{item.cliente}</td>}
              {selectedColumns.monto && <td>{item.monto}</td>}
              {selectedColumns.fecha && <td>{item.fecha}</td>}
              {selectedColumns.tipo && <td>{item.tipo}</td>}
              {selectedColumns.plan && <td>{item.plan}</td>}
              <td>
                <div className="WidgetFacturas-dropdown-options">
                  <button onClick={() => toggleOptions(index)}>...</button>
                  {optionsOpenIndex === index && (
                    <div className={`WidgetFacturas-dropdown-content WidgetFacturas-options-dropdown ${theme}`}>
                      {item.tipo === 'Escaneada' && <button>Añadir como Gasto</button>}
                      <button>Opción 1</button>
                      <button>Opción 2</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CreacionDeFacturas isOpen={isCreationModalOpen} closeModal={handleCloseCreationModal} onAddFactura={handleAddFactura} theme={theme} />
    </div>
  );
}

export default WidgetFacturas;
