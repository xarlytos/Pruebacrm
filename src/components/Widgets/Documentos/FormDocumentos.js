import React, { useState } from 'react';
import Modal from './Modal'; // Asumiendo que ya tienes el componente Modal implementado
import './FormDocumentos.css';

const FormDocumentos = ({ isOpen, onClose }) => {
  const [selectedTipo, setSelectedTipo] = useState('');

  const handleTipoChange = (e) => {
    setSelectedTipo(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3>Añadir Nuevo Documento</h3>
      <select value={selectedTipo} onChange={handleTipoChange} className="uniquePrefix-form-select">
        <option value="">Seleccione un tipo de documento</option>
        <option value="contrato">Contrato</option>
        <option value="licencia">Licencia</option>
        <option value="documento">Documento</option>
      </select>

      {selectedTipo === 'contrato' && (
        <div>
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            className="uniquePrefix-form-input"
          />
          <input
            type="date"
            name="fecha"
            placeholder="Fecha"
            className="uniquePrefix-form-input"
          />
          <input
            type="file"
            name="archivo"
            className="uniquePrefix-form-input"
          />
        </div>
      )}

      {selectedTipo === 'licencia' && (
        <div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="uniquePrefix-form-input"
          />
          <input
            type="text"
            name="organizacion"
            placeholder="Organización"
            className="uniquePrefix-form-input"
          />
          <input
            type="date"
            name="fechaEmision"
            placeholder="Fecha de Emisión"
            className="uniquePrefix-form-input"
          />
          <input
            type="date"
            name="fechaExpiracion"
            placeholder="Fecha de Expiración"
            className="uniquePrefix-form-input"
          />
          <input
            type="file"
            name="adjunto"
            className="uniquePrefix-form-input"
          />
          <input
            type="date"
            name="fechaRecordatorio"
            placeholder="Fecha de Recordatorio"
            className="uniquePrefix-form-input"
          />
          <textarea
            name="notas"
            placeholder="Notas"
            className="uniquePrefix-form-textarea"
          ></textarea>
        </div>
      )}

      {selectedTipo === 'documento' && (
        <div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="uniquePrefix-form-input"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            className="uniquePrefix-form-textarea"
          ></textarea>
          <input
            type="file"
            name="archivo"
            className="uniquePrefix-form-input"
          />
        </div>
      )}

      <button className="uniquePrefix-form-submit">Añadir {selectedTipo}</button>
      <button onClick={onClose} className="uniquePrefix-form-cancel">Cancelar</button>
    </Modal>
  );
};

export default FormDocumentos;
