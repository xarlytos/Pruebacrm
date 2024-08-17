// src/components/Componentepanelcontrol/ComponentesReutilizables/Modal.js

import React from 'react';
import './Modal.css'; // Asegúrate de que este archivo CSS corresponde a la ruta correcta

const Modal = ({ closeModal, children }) => {
  return (
    <div className="modalreutilizacion-overlay" onClick={closeModal}>
      <div className="modalreutilizacion-content" onClick={(e) => e.stopPropagation()}>
        <button className="modalreutilizacion-close" onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
