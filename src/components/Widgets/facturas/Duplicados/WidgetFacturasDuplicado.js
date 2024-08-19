import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FacturasActionButtons from './FacturasActionButtons';
import InvoiceForm from './InvoiceForm';
import ScanInvoiceForm from './ScanInvoiceForm';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './widget-FacturasDuplicado.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

function WidgetFacturasDuplicado({ isEditMode, theme, onTabChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    estado: true,
    cliente: true,
    monto: true,
    fecha: true,
    tipo: true,
    numeroFactura: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShowInvoiceModalOpen, setIsShowInvoiceModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false); // Estado para el checkbox global
  const [selectedItems, setSelectedItems] = useState([]); // Estado para los checkboxes individuales
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/invoices`);
        setInvoices(response.data);
        setSelectedItems(new Array(response.data.length).fill(false)); // Inicializar estado para los checkboxes
      } catch (error) {
        setError('Error al obtener las facturas.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredData = invoices.filter(
    item =>
      (item.companyName && item.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.total && item.total.toString().includes(searchTerm.toLowerCase())) ||
      (item.invoiceDate && new Date(item.invoiceDate).toLocaleDateString().includes(searchTerm)) ||
      (item.type && (item.type === 'made' ? 'Emitida' : 'Escaneada').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleColumnToggle = column => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const toggleActionDropdown = id => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id],
    });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleScanClick = () => {
    setIsScanModalOpen(true);
  };

  const handleOpenClick = () => {
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
  };

  const closeScanModal = () => {
    setIsScanModalOpen(false);
  };

  const openShowInvoiceModal = async (invoice) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/invoices/download/${invoice._id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(url);
      setSelectedInvoice(invoice);
      setIsShowInvoiceModalOpen(true);
    } catch (error) {
      console.error('Error al obtener el PDF de la factura:', error);
    }
  };

  const closeShowInvoiceModal = () => {
    setIsShowInvoiceModalOpen(false);
    setSelectedInvoice(null);
    setPdfUrl('');
  };

  const handleEconomiaTabClick = () => {
    onTabChange('Panel de Control');
  };

  // Manejo del checkbox global
  const handleSelectAll = () => {
    const newSelectedAll = !selectedAll;
    setSelectedAll(newSelectedAll);
    setSelectedItems(new Array(currentItems.length).fill(newSelectedAll));
  };

  // Manejo del checkbox individual
  const handleSelectItem = (index) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = !newSelectedItems[index];
    setSelectedItems(newSelectedItems);

    // Desmarcar el checkbox global si alguno individual está desmarcado
    if (newSelectedItems.includes(false)) {
      setSelectedAll(false);
    } else {
      setSelectedAll(true);
    }
  };

  if (loading) {
    return <div className={`WidgetFacturasDuplicado-widget ${theme}`}>Cargando...</div>;
  }

  if (error) {
    return <div className={`WidgetFacturasDuplicado-widget ${theme}`}>{error}</div>;
  }

  return (
    <div className={`WidgetFacturasDuplicado-widget ${theme}`}>
      <button
        onClick={handleEconomiaTabClick}
        style={{
          margin: '10px 0',
          padding: '8px 16px',
          backgroundColor: 'red',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          float: 'right',
        }}
      >
        Ir a la página de Economía
      </button>
      <FacturasActionButtons onScanClick={handleScanClick} onOpenClick={handleOpenClick} />
      <div className="WidgetFacturasDuplicado-filter-container">
        <h2>Facturaasdasds</h2>
        <input
          type="text"
          placeholder="Filtrar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`WidgetFacturasDuplicado-filter-input ${theme}`}
        />
      </div>

      <table className={`WidgetFacturasDuplicado-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedAll}
                onChange={handleSelectAll}
              />
            </th>
            {selectedColumns.cliente && <th>Cliente</th>}
            {selectedColumns.monto && <th>Importe</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            {selectedColumns.tipo && <th>Tipo</th>}
            {selectedColumns.numeroFactura && <th>Número de Factura</th>}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems[index]}
                  onChange={() => handleSelectItem(index)}
                />
              </td>
              {selectedColumns.cliente && <td>{item.companyName || item.name}</td>}
              {selectedColumns.monto && <td>{item.total.toFixed(2)}</td>}
              {selectedColumns.fecha && <td>{new Date(item.invoiceDate).toLocaleDateString()}</td>}
              {selectedColumns.tipo && <td>{item.type === 'made' ? 'Emitida' : 'Escaneada'}</td>}
              {selectedColumns.numeroFactura && <td>{item.invoiceNumber}</td>}
              <td>
                <div className="WidgetFacturasDuplicado-action-dropdown">
                  <button
                    className="WidgetFacturasDuplicado-action-button"
                    onClick={() => toggleActionDropdown(index)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[index] && (
                    <div className="WidgetFacturasDuplicado-action-content">
                      {item.type !== 'made' && (
                        <button className="WidgetFacturasDuplicado-action-item">Añadir como Gasto</button>
                      )}
                      <button className="WidgetFacturasDuplicado-action-item" onClick={() => openShowInvoiceModal(item)}>Mostrar Factura</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="WidgetFacturasDuplicado-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`WidgetFacturasDuplicado-pagination-button ${theme}`}
        >
          Anterior
        </button>
        <span className={`WidgetFacturasDuplicado-pagination-info ${theme}`}>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`WidgetFacturasDuplicado-pagination-button ${theme}`}
        >
          Siguiente
        </button>
      </div>

      {/* Pop-up para el formulario de escanear factura */}
      {isScanModalOpen && (
        <div className="WidgetFacturasDuplicado-popup-overlay">
          <div className="WidgetFacturasDuplicado-popup-content">
            <ScanInvoiceForm closeModal={closeScanModal} />
          </div>
        </div>
      )}

      {/* Pop-up para el formulario de abrir factura */}
      {isInvoiceModalOpen && (
        <div className="WidgetFacturasDuplicado-popup-overlay">
          <div className="WidgetFacturasDuplicado-popup-content">
            <InvoiceForm closeModal={closeInvoiceModal} />
          </div>
        </div>
      )}

      {/* Modal para mostrar la factura seleccionada */}
      {isShowInvoiceModalOpen && (
        <div className="WidgetFacturasDuplicado-modal-overlay">
          <div className={`WidgetFacturasDuplicado-modal ${theme}`}>
            <button className={`WidgetFacturasDuplicado-modal-close-button ${theme}`} onClick={closeShowInvoiceModal}>Cerrar</button>
            {pdfUrl && (
              <div>
                <h2>Factura {selectedInvoice.invoiceNumber}</h2>
                <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetFacturasDuplicado;
