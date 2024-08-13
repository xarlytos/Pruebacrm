// src/Componentepanelcontrol/MetricCardDuplicado.js
import React from 'react';
import './metriccardDuplicado.css'; // Importar los nuevos estilos

function MetricCardDuplicado({ title, value, description, icon, valueClass }) {
  return (
    <div className="panelcontrol-metric-card">
      <div className="panelcontrol-metric-header">
        <span>{title}</span>
        <span className="panelcontrol-metric-icon">{icon}</span>
      </div>
      <p className={`panelcontrol-metric-value ${valueClass}`}>{value}</p>
      <small className="panelcontrol-metric-description">{description}</small>
    </div>
  );
}

export default MetricCardDuplicado;
