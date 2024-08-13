// src/components/EventTooltip.js
import React from 'react';
import './EventTooltip.css';

const EventTooltip = ({ event, position, onDelete }) => {
  return (
    <div className="event-tooltip" style={position}>
      <h3>{event.title}</h3>
      <p><strong>Descripción:</strong> {event.description}</p>
      {event.location && <p><strong>Ubicación:</strong> {event.location}</p>}
      {event.participants && <p><strong>Participantes:</strong> {event.participants}</p>}
      {event.estadoPago && <p><strong>Estado del Pago:</strong> {event.estadoPago}</p>}
      {event.recibo && <p><strong>Recibo:</strong> {event.recibo}</p>}
      {event.frecuencia && <p><strong>Frecuencia:</strong> {event.frecuencia}</p>}
      {event.notas && <p><strong>Notas:</strong> {event.notas}</p>}
      <button className="delete-btn" onClick={() => onDelete(event)}>Borrar</button>
    </div>
  );
};

export default EventTooltip;
