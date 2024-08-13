// src/components/SlideModal.js
import React from 'react';
import './SlideModal.css';

const SlideModal = ({ isOpen, onClose }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-header">
        <h2>Crear Ejercicio</h2>
        <button onClick={onClose}>X</button>
      </div>
      <div className="modal-body">
        <label>Nombre</label>
        <input type="text" placeholder="Ej: Sentadilla" />
        <label>Categoría</label>
        <select>
          <option value="">Elige una categoría...</option>
          <option value="Fuerza">Fuerza</option>
          <option value="Cardio">Cardio</option>
          {/* Agrega más categorías aquí */}
        </select>
        <label>Instrucciones</label>
        <textarea placeholder="Escribe las instrucciones aquí..." maxLength="1500"></textarea>
        <label>Pistas de entrenamiento</label>
        <textarea placeholder="Escribe las pistas de entrenamiento aquí..." maxLength="1500"></textarea>
      </div>
      <div className="modal-footer">
        <button className="cancel-btn" onClick={onClose}>Cancelar</button>
        <button className="save-btn">Guardar</button>
      </div>
    </div>
  );
};

export default SlideModal;
