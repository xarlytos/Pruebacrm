// src/components/ComponentePanelControl/PopupDeMetricCard.js
import React from 'react';
import './popupdemetriccard.css';

function PopupDeMetricCard({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close-btn" onClick={onClose}>X</button>
        <h2>Detallllleeeeeles de MetricCard</h2>
        <p>Aquí puedes agregar más información sobre la tarjeta de métrica seleccionada.</p>
      </div>
    </div>
  );
}

export default PopupDeMetricCard;
