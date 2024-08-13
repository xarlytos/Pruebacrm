import React, { useState } from 'react';
import './EventoCreacionModal.css'; // Asegúrate de crear este archivo CSS para estilos personalizados

const EventoCreacionModal = ({ onClose, onSave }) => {
    const [eventType, setEventType] = useState('');
    const [newEvent, setNewEvent] = useState({
        title: '', description: '', start: '', end: '', location: '', participants: '', estadoPago: '', recibo: '', frecuencia: '', notas: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(newEvent);
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
                            Fecha y Hora:
                            <input type="datetime-local" name="start" value={newEvent.start} onChange={handleChange} />
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
                            Fecha y Hora de Fin:
                            <input type="datetime-local" name="end" value={newEvent.end} onChange={handleChange} />
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
        <div className="EventoCreacionModal-modal">
            <div className="EventoCreacionModal-modal-content">
                <span className="EventoCreacionModal-close" onClick={onClose}>&times;</span>
                <h2>Crear Evento</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tipo de Evento:
                        <select name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                            <option value="">Seleccione un tipo de evento</option>
                            <option value="Clase">Eventos de Clases</option>
                            <option value="Cita">Eventos de Citas con Clientes</option>
                            <option value="Pago">Eventos de Pagos</option>
                            <option value="Rutina">Eventos de Rutinas y Dietas</option>
                            <option value="Libre">Eventos Libres</option>
                        </select>
                    </label>
                    <label>
                        Título:
                        <input type="text" name="title" value={newEvent.title} onChange={handleChange} required />
                    </label>
                    <label>
                        Fecha y Hora de Inicio:
                        <input type="datetime-local" name="start" value={newEvent.start} onChange={handleChange} required />
                    </label>
                    {renderEventSpecificFields()}
                    <button type="submit">Guardar</button>
                </form>
            </div>
        </div>
    );
};

export default EventoCreacionModal;
