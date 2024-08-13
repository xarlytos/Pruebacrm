// src/components/Facturatoexpense.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const Facturatoexpense = ({ invoice, isOpen, onClose }) => {
  const [concept, setConcept] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(invoice ? invoice.total : 0);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (invoice) {
      setAmount(invoice.total);
      setDate(invoice.invoiceDate ? new Date(invoice.invoiceDate).toISOString().split('T')[0] : '');
    }
  }, [invoice]);

  const handleSave = async () => {
    const expenseData = {
      concept,
      category,
      amount: parseFloat(amount),
      status,
      date
    };

    try {
      const response = await axios.post('http://localhost:5000/api/expenses', expenseData);
      alert('Gasto guardado correctamente');
      onClose();
    } catch (error) {
      console.error('Error guardando el gasto:', error);
      alert('Error guardando el gasto');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Convertir Factura a Gasto"
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Convertir Factura a Gasto</h2>
      <form>
        <div>
          <label>Concepto:</label>
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>
        <div>
          <label>Categoría:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Monto:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Estado:</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleSave}>Guardar Gasto</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </Modal>
  );
};

export default Facturatoexpense;
