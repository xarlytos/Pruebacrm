import React, { useState } from 'react';
import './widget-facturas.css';
import ModalDeEscaneoDeFacturas from './ModalDeEscaneoDeFacturas';
import CreacionDeFacturas from './CreacionDeFacturas';
import NavbarFiltrosFacturas from './NavbarFiltrosFacturas';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import ScanInvoiceForm from './Duplicados/ScanInvoiceForm';
import Modal from './Modal'; // Importa el nuevo componente Modal

const initialData = [];

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
    invoiceDate: '',
    paymentMethod: '',
    total: '',
    type: '',
    personType: '',
    name: '',
    surname: '',
    serviceCode: '',
  });
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false); // Estado para controlar la visibilidad de ScanInvoiceForm
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
    setIsScanModalOpen(true); // Abre el modal de escaneo
  };

  const handleCloseScanModal = () => {
    setIsScanModalOpen(false); // Cierra el modal de escaneo
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
      
      const invoiceDateCondition = filters.invoiceDate ? new Date(item.invoiceDate).toISOString().split('T')[0] === filters.invoiceDate : true;
      const paymentMethodCondition = filters.paymentMethod ? item.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase()) : true;
      const totalCondition = filters.total ? item.total === parseFloat(filters.total) : true;
      const typeCondition = filters.type ? item.type === filters.type : true;
      const personTypeCondition = filters.personType ? item.personType.toLowerCase().includes(filters.personType.toLowerCase()) : true;
      const nameCondition = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
      const surnameCondition = filters.surname ? item.surname.toLowerCase().includes(filters.surname.toLowerCase()) : true;
      const serviceCodeCondition = filters.serviceCode ? item.services.some(service => service.serviceCode.toLowerCase().includes(filters.serviceCode.toLowerCase())) : true;

      return startDateCondition && endDateCondition && estatusCondition && minMontoCondition && maxMontoCondition && tipoCondition && planCondition
        && invoiceDateCondition && paymentMethodCondition && totalCondition && typeCondition && personTypeCondition && nameCondition && surnameCondition && serviceCodeCondition;
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
                  {/* Filtro por Fecha de Factura */}
                  <div className="filter-field">
                    <label>Fecha de Factura:</label>
                    <input
                      type="date"
                      name="invoiceDate"
                      value={filters.invoiceDate}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>

                  {/* Filtro por Método de Pago */}
                  <div className="filter-field">
                    <label>Método de Pago:</label>
                    <input
                      type="text"
                      name="paymentMethod"
                      value={filters.paymentMethod}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>

                  {/* Filtro por Total */}
                  <div className="filter-field">
                    <label>Total:</label>
                    <input
                      type="number"
                      name="total"
                      value={filters.total}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>

                  {/* Filtro por Tipo de Factura */}
                  <div className="filter-field">
                    <label>Tipo de Factura:</label>
                    <select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    >
                      <option value="">Todos</option>
                      <option value="received">Recibida</option>
                      <option value="made">Emitida</option>
                    </select>
                  </div>

                  {/* Filtro por Tipo de Persona */}
                  <div className="filter-field">
                    <label>Tipo de Persona:</label>
                    <input
                      type="text"
                      name="personType"
                      value={filters.personType}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>

                  {/* Filtro por Nombre */}
                  <div className="filter-field">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="name"
                      value={filters.name}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>

                  {/* Filtro por Apellido */}
                  <div className="filter-field">
                    <label>Apellido:</label>
                    <input
                      type="text"
                      name="surname"
                      value={filters.surname}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
                  </div>

                  {/* Filtro por Código de Servicio */}
                  <div className="filter-field">
                    <label>Código de Servicio:</label>
                    <input
                      type="text"
                      name="serviceCode"
                      value={filters.serviceCode}
                      onChange={handleFilterFieldChange}
                      className={`widget-filter-input ${theme}`}
                    />
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
          <button className={`WidgetFacturas-scan-btn ${theme}`} onClick={handleOpenScanModal}>Escanear Factura</button> {/* Aquí */}
          <button className={`WidgetFacturas-add-btn ${theme}`} onClick={handleOpenCreationModal}>Añadir Factura</button>
        </div>
      </div>
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
            {selectedColumns.monto && <th>Importe</th>}
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
      {isScanModalOpen && ( // Renderizar ScanInvoiceForm solo si isScanModalOpen es true
        <Modal closeModal={handleCloseScanModal}> {/* Utiliza el componente Modal para hacer que ScanInvoiceForm sea un modal */}
          <ScanInvoiceForm closeModal={handleCloseScanModal} />
        </Modal>
      )}
      <ModalDeEscaneoDeFacturas isOpen={isDetailedModalOpen} closeModal={handleCloseDetailedModal} theme={theme} /> {/* Mantenido */}
    </div>
  );
}

export default WidgetFacturas;
