import React, { useState } from 'react';
import './ModalGenerarReporte.css';

function ModalGenerarReporteActual({ isOpen, onClose, theme }) {
  const [nombreReporte, setNombreReporte] = useState('');
  const [camposSeleccionados, setCamposSeleccionados] = useState({
    clientes: false,
    ingresos: false,
    gastos: false,
    planes: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nombreReporte, camposSeleccionados });
    alert('Reporte actual generado!');
    onClose();
  };

  const handleCheckboxChange = (e) => {
    setCamposSeleccionados({
      ...camposSeleccionados,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    isOpen && (
      <div className={`modal-reporte-overlay ${theme}`}>
        <div className={`modal-reporte-content ${theme}`}>
          <span className={`modal-reporte-close ${theme}`} onClick={onClose}>
            &times;
          </span>
          <h2>Generar Reporte Actual</h2>
          <form onSubmit={handleSubmit}>
            <div className="modal-reporte-form-group">
              <label>Nombre del Reporte</label>
              <input
                type="text"
                value={nombreReporte}
                onChange={(e) => setNombreReporte(e.target.value)}
                required
                className={theme}
              />
            </div>
            <div className="modal-reporte-form-group">
              <label>¿Qué campos quieres usar para el informe?</label>
              <div className="modal-reporte-checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="clientes"
                    checked={camposSeleccionados.clientes}
                    onChange={handleCheckboxChange}
                  />
                  Clientes
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="ingresos"
                    checked={camposSeleccionados.ingresos}
                    onChange={handleCheckboxChange}
                  />
                  Ingresos
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="gastos"
                    checked={camposSeleccionados.gastos}
                    onChange={handleCheckboxChange}
                  />
                  Gastos
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="planes"
                    checked={camposSeleccionados.planes}
                    onChange={handleCheckboxChange}
                  />
                  Planes
                </label>
              </div>
            </div>
            <button type="submit" className={`modal-reporte-btn-generar ${theme}`}>
              Generar Reporte
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default ModalGenerarReporteActual;
