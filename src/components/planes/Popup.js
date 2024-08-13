// src/components/Popup.js
import React from 'react';
import './Popup.css';

function Popup({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Popup;
