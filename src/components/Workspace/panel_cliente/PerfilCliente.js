// src/components/PerfilCliente.js
import React, { useState } from 'react';
import EditModal from './EditModal';

const PerfilCliente = ({ cliente, actualizarCliente }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCliente, setEditedCliente] = useState(cliente);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        actualizarCliente(editedCliente);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCliente({ ...editedCliente, [name]: value });
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return !isNaN(d.getTime()) ? d.toISOString().substr(0, 10) : '';
    };

    return (
        <div className="section">
            <h3>Perfil Cliente</h3>
            <p>Dirección: {cliente.direccion}</p>
            <p>Ocupación: {cliente.ocupacion}</p>
            <p>Nombre: {cliente.nombre}</p>
            <p>Apellido: {cliente.apellido}</p>
            <p>Fecha de Nacimiento: {new Date(cliente.fechaNacimiento).toLocaleDateString()}</p>
            <p>Tiempo con el Entrenador: {cliente.tiempoConEntrenador}</p>
            <p>Redes Sociales: {cliente.redesSociales.join(', ')}</p>
            <button onClick={handleEditClick}>Editar</button>

            <EditModal isOpen={isEditing} onRequestClose={() => setIsEditing(false)}>
                <h3>Editar Perfil Cliente</h3>
                <label>
                    Dirección:
                    <input type="text" name="direccion" value={editedCliente.direccion} onChange={handleChange} />
                </label>
                <label>
                    Ocupación:
                    <input type="text" name="ocupacion" value={editedCliente.ocupacion} onChange={handleChange} />
                </label>
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={editedCliente.nombre} onChange={handleChange} />
                </label>
                <label>
                    Apellido:
                    <input type="text" name="apellido" value={editedCliente.apellido} onChange={handleChange} />
                </label>
                <label>
                    Fecha de Nacimiento:
                    <input type="date" name="fechaNacimiento" value={formatDate(editedCliente.fechaNacimiento)} onChange={handleChange} />
                </label>
                <label>
                    Tiempo con el Entrenador:
                    <input type="number" name="tiempoConEntrenador" value={editedCliente.tiempoConEntrenador} onChange={handleChange} />
                </label>
                <label>
                    Redes Sociales:
                    <input type="text" name="redesSociales" value={editedCliente.redesSociales.join(', ')} onChange={handleChange} />
                </label>
                <button onClick={handleSaveClick}>Guardar</button>
            </EditModal>
        </div>
    );
};

export default PerfilCliente;
