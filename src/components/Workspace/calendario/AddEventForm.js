// src/components/AddEventForm.js
import React, { useState, useEffect } from 'react';
import './AddEventForm.css';

const AddEventForm = ({ onClose, onSave, defaultValues, theme }) => {
  const [eventType, setEventType] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
    participants: '',
    estadoPago: '',
    recibo: '',
    frecuencia: '',
    notas: '',
    eventType: ''
  });

  useEffect(() => {
    if (defaultValues) {
      console.log('Default values set:', defaultValues);
      setNewEvent(prevState => ({
        ...prevState,
        ...defaultValues,
        start: defaultValues.start || prevState.start,
        end: defaultValues.end || prevState.end,
      }));
      setEventType(defaultValues.eventType || '');
    }
  }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...newEvent, eventType });
    setNewEvent({
      title: '',
      description: '',
      start: '',
      end: '',
      location: '',
      participants: '',
      estadoPago: '',
      recibo: '',
      frecuencia: '',
      notas: '',
      eventType: ''
    });
    onClose();
  };

  const renderEventSpecificFields = () => {
    const eventSpecificFieldsClass = 'fade-in-fields';
    switch (eventType) {
      case 'Clase':
        return (
          <div className={eventSpecificFieldsClass}>
            <label>
              Descripción:
              <textarea name="description" value={newEvent.description} onChange={handleChange} />
            </label>
            <label>
              Ubicación:
              <input type="text" name="location" value={newEvent.location} onChange={handleChange} />
            </label>
            <label>
              Participantes:
              <input type="text" name="participants" value={newEvent.participants} onChange={handleChange} />
            </label>
          </div>
        );
      case 'Cita':
        return (
          <div className={eventSpecificFieldsClass}>
            <label>
              Descripción:
              <textarea name="description" value={newEvent.description} onChange={handleChange} />
            </label>
            <label>
              Ubicación:
              <input type="text" name="location" value={newEvent.location} onChange={handleChange} />
            </label>
            <label>
              Participantes:
              <input type="text" name="participants" value={newEvent.participants} onChange={handleChange} />
            </label>
          </div>
        );
      case 'Pago':
        return (
          <div className={eventSpecificFieldsClass}>
            <label>
              Descripción:
              <textarea name="description" value={newEvent.description} onChange={handleChange} />
            </label>
            <label>
              Estado del Pago:
              <input type="text" name="estadoPago" value={newEvent.estadoPago} onChange={handleChange} />
            </label>
            <label>
              Recibo:
              <input type="text" name="recibo" value={newEvent.recibo} onChange={handleChange} />
            </label>
          </div>
        );
      case 'Rutina':
        return (
          <div className={eventSpecificFieldsClass}>
            <label>
              Descripción:
              <textarea name="description" value={newEvent.description} onChange={handleChange} />
            </label>
            <label>
              Frecuencia:
              <input type="text" name="frecuencia" value={newEvent.frecuencia} onChange={handleChange} />
            </label>
            <label>
              Notas:
              <textarea name="notas" value={newEvent.notas} onChange={handleChange} />
            </label>
          </div>
        );
      case 'Libre':
        return (
          <div className={eventSpecificFieldsClass}>
            <label>
              Descripción:
              <textarea name="description" value={newEvent.description} onChange={handleChange} />
            </label>
            <label>
              Ubicación:
              <input type="text" name="location" value={newEvent.location} onChange={handleChange} />
            </label>
            <label>
              Participantes:
              <input type="text" name="participants" value={newEvent.participants} onChange={handleChange} />
            </label>
            <label>
              Notas:
              <textarea name="notas" value={newEvent.notas} onChange={handleChange} />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`add-event-modal ${theme}`}>
      <div className={`add-event-modal-content ${theme}`}>
        <span className="add-event-modal-close" onClick={onClose}>&times;</span>
        <h2>{defaultValues && defaultValues.title ? 'Editar Evento' : 'Crear Evento'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input type="text" name="title" value={newEvent.title} onChange={handleChange} required />
          </label>
          <label>
            Fecha y Hora de Inicio:
            <input type="datetime-local" name="start" value={newEvent.start} onChange={handleChange} required />
          </label>
          <label>
            Fecha y Hora de Fin:
            <input type="datetime-local" name="end" value={newEvent.end} onChange={handleChange} required />
          </label>
          <label>
            Tipo de Evento:
            <select name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)} required>
              <option value="">Seleccione un tipo de evento</option>
              <option value="Clase">Clase</option>
              <option value="Cita">Cita</option>
              <option value="Pago">Pago</option>
              <option value="Rutina">Rutina</option>
              <option value="Libre">Libre</option>
            </select>
          </label>
          {renderEventSpecificFields()}
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
