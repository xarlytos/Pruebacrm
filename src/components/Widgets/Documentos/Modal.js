// Modal.js
import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="uniquePrefix-modal-overlay">
      <div className="uniquePrefix-modal-content">
        <button className="uniquePrefix-modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
