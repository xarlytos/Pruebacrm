import React from 'react';
import './metriccard.css';

function MetricCard({ title, value, description, icon, valueClass, onClick, titleColor }) {
  return (
    <div className="panelcontrol-metric-card" onClick={onClick}>
      <div className="panelcontrol-metric-header">
        <span style={{ color: titleColor }}>{title}</span>
        <span className="panelcontrol-metric-icon">{icon}</span>
      </div>
      <p className={`panelcontrol-metric-value ${valueClass}`}>{value}</p>
      <small className="panelcontrol-metric-description">{description}</small>
    </div>
  );
}

export default MetricCard;
