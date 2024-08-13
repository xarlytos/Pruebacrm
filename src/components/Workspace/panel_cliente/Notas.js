import React, { useState } from 'react';
import axios from 'axios';
import './Notas.css';

const Notas = ({ cliente, actualizarCliente, abrirModal }) => {
    const [notaSeleccionada, setNotaSeleccionada] = useState(null);
    const [notaEditada, setNotaEditada] = useState('');
    const [tituloEditado, setTituloEditado] = useState('');

    const abrirModalEditarNota = (nota) => {
        console.log('Editando nota:', nota);
        setNotaSeleccionada(nota);
        setNotaEditada(nota.contenido);
        setTituloEditado(nota.titulo);
    };

    const cerrarModalEditarNota = () => {
        setNotaSeleccionada(null);
        setNotaEditada('');
        setTituloEditado('');
    };

    const handleEditarNotaChange = (e) => {
        setNotaEditada(e.target.value);
    };

    const handleEditarTituloChange = (e) => {
        setTituloEditado(e.target.value);
    };

    const handleGuardarNotaEditada = async () => {
        try {
            const notaActualizada = {
                titulo: tituloEditado || '',
                contenido: notaEditada
            };
            console.log('Guardando nota editada:', notaActualizada);
            console.log('ID de la nota seleccionada:', notaSeleccionada._id);
            const response = await axios.put(`/api/clientes/${cliente._id}/notas`, {
                notaId: notaSeleccionada._id,
                notaNueva: notaActualizada
            });
            actualizarCliente(response.data); // Actualiza el cliente en el estado padre
            cerrarModalEditarNota();
        } catch (error) {
            console.error('Error editando nota:', error);
        }
    };

    const handleEliminarNota = async () => {
        try {
            console.log('Eliminando nota con ID:', notaSeleccionada._id);
            const response = await axios.delete(`/api/clientes/${cliente._id}/notas`, {
                data: { notaId: notaSeleccionada._id }
            });
            actualizarCliente(response.data); // Actualiza el cliente en el estado padre
            cerrarModalEditarNota();
        } catch (error) {
            console.error('Error eliminando nota:', error);
        }
    };

    return (
        <div className="section">
            <div className="header">
                <h3>Notas</h3>
                <button onClick={abrirModal} className="notasButton">+</button>
            </div>
            <div className="notas-grid">
                {(cliente.notas || []).map((nota, index) => (
                    <div key={index} className="nota-card" onClick={() => abrirModalEditarNota(nota)}>
                        <strong>{nota.titulo || nota.contenido}</strong>
                    </div>
                ))}
            </div>

            {notaSeleccionada !== null && (
                <div className="modal">
                    <div className="modal-content nota-edit-modal">
                        <div className="modal-header">
                            <input 
                                type="text" 
                                placeholder="Título (opcional)" 
                                className="modal-title" 
                                value={tituloEditado}
                                onChange={handleEditarTituloChange}
                            />
                            <span className="close" onClick={cerrarModalEditarNota}>&times;</span>
                        </div>
                        <textarea 
                            value={notaEditada} 
                            onChange={handleEditarNotaChange} 
                            className="modal-textarea"
                        />
                        <div className="modal-footer">
                            <button onClick={handleGuardarNotaEditada} className="notasButton">Guardar</button>
                            <button onClick={handleEliminarNota} className="notasButton">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notas;
