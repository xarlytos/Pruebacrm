import React, { useState } from 'react';
import './VenderBonoPopup.css';

const VenderBonoPopup = ({ onClose, onSubmit }) => {
  const [tipoBono, setTipoBono] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [asignarCita, setAsignarCita] = useState(false);
  const [precioTotal, setPrecioTotal] = useState('');
  const [validoHasta, setValidoHasta] = useState('');

  const handleSubmit = () => {
    const nuevoBono = {
      numero: Date.now(),
      nombre: tipoBono,
      paciente: nombrePaciente,
      servicio: "Servicio ejemplo",
      sesiones: 1,
      estadoPago: "Pendiente",
      fechaVenta: new Date().toISOString(),
      precio: precioTotal,
      pagada: false,
      pendiente: true
    };

    onSubmit(nuevoBono);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Vender bono a un paciente</h2>
        <form className="grid-form">
          <div className="form-group">
            <label htmlFor="tipoBono">¿Qué bono quiere vender?</label>
            <select 
              id="tipoBono" 
              value={tipoBono} 
              onChange={(e) => setTipoBono(e.target.value)}>
              <option value="">Escoja el tipo de bono</option>
              <option value="tipo1">Tipo 1</option>
              <option value="tipo2">Tipo 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nombrePaciente">Nombre del paciente</label>
            <input
              type="text"
              id="nombrePaciente"
              placeholder="Nombre del paciente"
              value={nombrePaciente}
              onChange={(e) => setNombrePaciente(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Reservar cita</label>
            <div>
              <input
                type="radio"
                id="noAsignar"
                name="asignarCita"
                checked={!asignarCita}
                onChange={() => setAsignarCita(false)}
              />
              <label htmlFor="noAsignar">No asignar una cita aún</label>
              <input
                type="radio"
                id="asignar"
                name="asignarCita"
                checked={asignarCita}
                onChange={() => setAsignarCita(true)}
              />
              <label htmlFor="asignar">Reservar la primera cita</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="precioTotal">Precio total</label>
            <input
              type="number"
              id="precioTotal"
              placeholder="Precio total"
              value={precioTotal}
              onChange={(e) => setPrecioTotal(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="validoHasta">Válido hasta</label>
            <input
              type="date"
              id="validoHasta"
              value={validoHasta}
              onChange={(e) => setValidoHasta(e.target.value)}
            />
          </div>
          <div className="buttons">
            <button type="button" onClick={onClose}>Volver</button>
            <button type="button" onClick={handleSubmit}>Vender el bono</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenderBonoPopup;
