// src/components/CondicionFisica.js
import React, { useState } from 'react';
import EditModal from './EditModal';

const CondicionFisica = ({ cliente, actualizarCliente }) => {
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

    return (
        <div className="section">
            <h3>Condición Física</h3>
            <p>Género: {cliente.genero}</p>
            <p>Edad: {cliente.edad}</p>
            <p>Peso: {cliente.peso}</p>
            <p>Altura: {cliente.altura}</p>
            <p>Historial Médico: {cliente.historialMedico.join(', ')}</p>
            <p>Nivel de Experiencia: {cliente.nivelExperiencia}</p>
            <p>Cuestionario de Preferencias: {cliente.cuestionarioPreferencias}</p>
            <p>PR en Ejercicios: {JSON.stringify(cliente.PRs)}</p>
            <button onClick={handleEditClick}>Editar</button>

            <EditModal isOpen={isEditing} onRequestClose={() => setIsEditing(false)}>
                <h3>Editar Condición Física</h3>
                <label>
                    Género:
                    <input type="text" name="genero" value={editedCliente.genero} onChange={handleChange} />
                </label>
                <label>
                    Edad:
                    <input type="number" name="edad" value={editedCliente.edad} onChange={handleChange} />
                </label>
                <label>
                    Peso:
                    <input type="number" name="peso" value={editedCliente.peso} onChange={handleChange} />
                </label>
                <label>
                    Altura:
                    <input type="number" name="altura" value={editedCliente.altura} onChange={handleChange} />
                </label>
                <label>
                    Historial Médico:
                    <input type="text" name="historialMedico" value={editedCliente.historialMedico.join(', ')} onChange={handleChange} />
                </label>
                <label>
                    Nivel de Experiencia:
                    <input type="text" name="nivelExperiencia" value={editedCliente.nivelExperiencia} onChange={handleChange} />
                </label>
                <label>
                    Cuestionario de Preferencias:
                    <input type="text" name="cuestionarioPreferencias" value={editedCliente.cuestionarioPreferencias} onChange={handleChange} />
                </label>
                <label>
                    PR en Ejercicios:
                    <input type="text" name="PRs" value={JSON.stringify(editedCliente.PRs)} onChange={handleChange} />
                </label>
                <button onClick={handleSaveClick}>Guardar</button>
            </EditModal>
        </div>
    );
};

export default CondicionFisica;
