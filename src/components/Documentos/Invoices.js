// src/components/Invoices.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import InvoiceForm from './InvoiceForm';
import ScanInvoiceForm from './ScanInvoiceForm';
import Facturatoexpense from './Facturatoexpense';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './Invoices.css';

Modal.setAppElement('#root');

function Invoices() {
  const [mode, setMode] = useState('received');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isShowInvoiceModalOpen, setIsShowInvoiceModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isFacturatoexpenseModalOpen, setIsFacturatoexpenseModalOpen] = useState(false);
  const [isEditInvoiceModalOpen, setIsEditInvoiceModalOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/invoices');
        setInvoices(response.data);
      } catch (error) {
        console.error('Error al obtener las facturas:', error);
      }
    };

    fetchInvoices();
  }, []);

  const openInvoiceModal = () => {
    setIsInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
  };

  const openScanModal = () => {
    setIsScanModalOpen(true);
  };

  const closeScanModal = () => {
    setIsScanModalOpen(false);
  };

  const openShowInvoiceModal = async (invoice) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoices/download/${invoice._id}`, {
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

  const openFacturatoexpenseModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsFacturatoexpenseModalOpen(true);
  };

  const closeFacturatoexpenseModal = () => {
    setIsFacturatoexpenseModalOpen(false);
    setSelectedInvoice(null);
  };

  const openEditInvoiceModal = (invoice) => {
    const formattedInvoice = {
      ...invoice,
      invoiceDate: invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : ''
    };
    setSelectedInvoice(formattedInvoice);
    setIsEditInvoiceModalOpen(true);
  };

  const closeEditInvoiceModal = () => {
    setIsEditInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const downloadPDF = async (invoiceId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/invoices/download/${invoiceId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Factura-${invoiceId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices/download-csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoices.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error al descargar el CSV:', error);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${invoiceId}`);
      setInvoices(invoices.filter(invoice => invoice._id !== invoiceId));
      alert('Factura eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
      alert('Error al eliminar la factura');
    }
  };

  const filteredInvoices = invoices.filter(invoice => invoice.type === mode);

  return (
    <div>
      <h2>Facturas</h2>
      <div className="invoice-actions">
        <button className="create-invoice-btn" onClick={openInvoiceModal}>Crear Nueva Factura</button>
        <button className="scan-invoice-btn" onClick={openScanModal}>Escanear Factura</button>
        <button className="download-csv-btn" onClick={downloadCSV}>Descargar CSV</button>
      </div>
      <div className="invoice-mode-switch">
        <button onClick={() => setMode('received')} className={mode === 'received' ? 'active' : ''}>
          Facturas Recibidas
        </button>
        <button onClick={() => setMode('made')} className={mode === 'made' ? 'active' : ''}>
          Facturas Echadas
        </button>
      </div>
      <div className="invoice-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>{mode === 'received' ? 'Proveedor' : 'Cliente'}</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{formatDate(invoice.invoiceDate)}</td>
                  <td>{invoice.companyName}</td>
                  <td>${invoice.total.toFixed(2)}</td>
                  <td>
                    <button onClick={() => downloadPDF(invoice._id)}>Descargar PDF</button>
                    <button onClick={() => openShowInvoiceModal(invoice)}>Mostrar Factura</button>
                    <button onClick={() => deleteInvoice(invoice._id)}>Eliminar</button>
                    <button onClick={() => openEditInvoiceModal(invoice)}>Editar</button>
                    {mode === 'received' && (
                      <button onClick={() => openFacturatoexpenseModal(invoice)}>Convertir a Gasto</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay facturas disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isInvoiceModalOpen}
        onRequestClose={closeInvoiceModal}
        contentLabel="Crear Nueva Factura"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <InvoiceForm closeModal={closeInvoiceModal} />
      </Modal>
      <Modal
        isOpen={isScanModalOpen}
        onRequestClose={closeScanModal}
        contentLabel="Escanear Factura"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <ScanInvoiceForm closeModal={closeScanModal} />
      </Modal>
      <Modal
        isOpen={isShowInvoiceModalOpen}
        onRequestClose={closeShowInvoiceModal}
        contentLabel="Mostrar Factura"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {pdfUrl && (
          <div>
            <h2>Factura {selectedInvoice.invoiceNumber}</h2>
            <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
            <button onClick={closeShowInvoiceModal}>Cerrar</button>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={isEditInvoiceModalOpen}
        onRequestClose={closeEditInvoiceModal}
        contentLabel="Editar Factura"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedInvoice && (
          <InvoiceForm
            closeModal={closeEditInvoiceModal}
            invoice={selectedInvoice}
          />
        )}
      </Modal>
      <Modal
        isOpen={isFacturatoexpenseModalOpen}
        onRequestClose={closeFacturatoexpenseModal}
        contentLabel="Convertir Factura a Gasto"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Facturatoexpense
          invoice={selectedInvoice}
          isOpen={isFacturatoexpenseModalOpen}
          onClose={closeFacturatoexpenseModal}
        />
      </Modal>
    </div>
  );
}

export default Invoices;
