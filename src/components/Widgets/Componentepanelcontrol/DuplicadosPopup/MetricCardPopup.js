import React from 'react';
import './metriccardPopup.css';

function MetricCardPopup({ value, description, icon, valueClass, difference, isExpense = false, theme, setTheme }) {
  const differenceValue = difference.value;
  const differenceClass = differenceValue > 0 ? (isExpense ? 'difference-negative' : 'difference-positive') : differenceValue < 0 ? (isExpense ? 'difference-positive' : 'difference-negative') : 'difference-neutral';
  const differenceIcon = differenceValue > 0 ? '⬆️' : differenceValue < 0 ? '⬇️' : '➖';

  return (
    <div className={`popup-metric-card ${theme}`}>
      <div className="popup-metric-header">
        <span className={`popup-metric-value ${valueClass}`}>{value}</span>
        <span className="popup-metric-icon">{icon}</span>
      </div>
      <div className="popup-metric-footer">
        <small className="popup-metric-description">{description}</small>
        <div className={`popup-metric-difference ${differenceClass}`}>
          <span className="difference-icon">{differenceIcon}</span> {Math.abs(differenceValue)}%
        </div>
      </div>
    </div>
  );
}

export default MetricCardPopup;
