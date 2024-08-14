import React, { useState } from 'react';
import EditModal from './EditModal';
import './CondicionFisica.css';  // Asegúrate de que el CSS esté importado

const CondicionFisica = ({ cliente, actualizarCliente, theme }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCliente, setEditedCliente] = useState({ ...cliente });

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
        <div className={`condicion-fisica-section ${theme}`}>
            <h3 className="condicion-fisica-title">Condición Física</h3>
            <p className="condicion-fisica-item">Género: {cliente.genero}</p>
            <p className="condicion-fisica-item">Edad: {cliente.edad}</p>
            <p className="condicion-fisica-item">Peso: {cliente.peso}</p>
            <p className="condicion-fisica-item">Altura: {cliente.altura}</p>
            <p className="condicion-fisica-item">Historial Médico: {cliente.historialMedico.join(', ')}</p>
            <p className="condicion-fisica-item">Nivel de Experiencia: {cliente.nivelExperiencia}</p>
            <p className="condicion-fisica-item">Cuestionario de Preferencias: {cliente.cuestionarioPreferencias}</p>
            <p className="condicion-fisica-item">PR en Ejercicios: {JSON.stringify(cliente.PRs)}</p>
            <button className={`condicion-fisica-edit-btn ${theme}`} onClick={handleEditClick}>Editar</button>

            {isEditing && (
                <EditModal 
                    isOpen={isEditing} 
                    onRequestClose={() => setIsEditing(false)} 
                    className={`condicion-fisica-modal ${theme}`}
                >
                    <h3 className="condicion-fisica-edit-title">Editar Condición Física</h3>
                    <form className="condicion-fisica-form">
                        <label className="condicion-fisica-label">
                            Género:
                            <input className="condicion-fisica-input" type="text" name="genero" value={editedCliente.genero} onChange={handleChange} />
                        </label>
                        <label className="condicion-fisica-label">
                            Edad:
                            <input className="condicion-fisica-input" type="number" name="edad" value={editedCliente.edad} onChange={handleChange} />
                        </label>
                        <label className="condicion-fisica-label">
                            Peso:
                            <input className="condicion-fisica-input" type="number" name="peso" value={editedCliente.peso} onChange={handleChange} />
                        </label>
                        <label className="condicion-fisica-label">
                            Altura:
                            <input className="condicion-fisica-input" type="number" name="altura" value={editedCliente.altura} onChange={handleChange} />
                        </label>
                        <label className="condicion-fisica-label">
                            Historial Médico:
                            <input className="condicion-fisica-input" type="text" name="historialMedico" value={editedCliente.historialMedico.join(', ')} onChange={handleChange} />
                        </label>
                        <label className="condicion-fisica-label">
                            Nivel de Experiencia:
                            <input className="condicion-fisica-input" type="text" name="nivelExperiencia" value={editedCliente.nivelExperiencia} onChange={handleChange} />
                        </label>
                        <label className="condicion-fisica-label">
                            Cuestionario de Preferencias:
                            <input className="condicion-fisica-input" type="text" name="cuestionarioPreferencias" value={editedCliente.cuestionarioPreferencias} onChange={handleChange} />
                        </label>
                        <label className="condicion-fisica-label">
                            PR en Ejercicios:
                            <input className="condicion-fisica-input" type="text" name="PRs" value={JSON.stringify(editedCliente.PRs)} onChange={handleChange} />
                        </label>
                    </form>
                    <div className="condicion-fisica-modal-buttons">
                        <button className={`condicion-fisica-save-btn ${theme}`} onClick={handleSaveClick}>Guardar</button>
                        <button className={`condicion-fisica-close-btn ${theme}`} onClick={() => setIsEditing(false)}>Cerrar</button>
                    </div>
                </EditModal>
            )}
        </div>
    );
};

export default CondicionFisica;
