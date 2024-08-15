// src/components/facturas/FacturasActionButtons.js
import React from 'react';
import './FacturasActionButtons.css';

const FacturasActionButtons = ({ onScanClick, onOpenClick }) => {
  return (
    <div className="Facturas-actions">
      <button className="Facturas-scan-btn" onClick={onScanClick}>Escanear Factura</button>
      <button className="Facturas-add-btn" onClick={onOpenClick}>Crear Factura</button>
    </div>
  );
}

export default FacturasActionButtons;
