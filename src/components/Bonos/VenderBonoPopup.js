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
      numero: Date.now(), // Puedes ajustar esto para generar un número único
      nombre: tipoBono,
      paciente: nombrePaciente,
      servicio: "Servicio ejemplo", // Ajusta esto según tus necesidades
      sesiones: 1, // Ajusta esto según tus necesidades
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
        <form>
          <label>¿Qué bono quiere vender?</label>
          <select value={tipoBono} onChange={(e) => setTipoBono(e.target.value)}>
            <option value="">Escoja el tipo de bono</option>
            <option value="tipo1">Tipo 1</option>
            <option value="tipo2">Tipo 2</option>
          </select>
          <input
            type="text"
            placeholder="Nombre del paciente"
            value={nombrePaciente}
            onChange={(e) => setNombrePaciente(e.target.value)}
            id="nombrePaciente"
          />
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
          <div className="precio">
            <label>Precio total</label>
            <input
              type="number"
              placeholder="Precio total"
              value={precioTotal}
              onChange={(e) => setPrecioTotal(e.target.value)}
            />
          </div>
          <div className="valido">
            <label>Válido hasta</label>
            <input
              type="date"
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
