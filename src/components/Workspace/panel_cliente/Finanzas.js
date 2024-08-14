import React, { useState } from 'react';
import EditModal from './EditModal';

const Finanzas = ({ cliente, actualizarCliente, theme = 'default-theme' }) => { 
    const [isEditing, setIsEditing] = useState(false);
    const [editedCliente, setEditedCliente] = useState(cliente);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        const updatedCliente = {
            ...editedCliente,
            historialCompras: typeof editedCliente.historialCompras === 'string' 
                ? editedCliente.historialCompras.split(',').map(item => item.trim()) 
                : editedCliente.historialCompras,
            canalCaptacionCliente: typeof editedCliente.canalCaptacionCliente === 'string' 
                ? editedCliente.canalCaptacionCliente.split(',').map(item => item.trim()) 
                : editedCliente.canalCaptacionCliente
        };

        actualizarCliente(updatedCliente);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCliente({ ...editedCliente, [name]: value });
    };

    return (
        <div className="section">
            <h3>Finanzas</h3>
            <p>Método de Pago: {cliente.paymentMethod}</p>
            <p>ID Fiscal: {cliente.idFiscal}</p>
            <p>Historial de Compras: {cliente.historialCompras.join(', ')}</p>
            <p>Canal de Captación de Cliente: {cliente.canalCaptacionCliente.join(', ')}</p>
            <button onClick={handleEditClick}>Editar</button>

            <EditModal isOpen={isEditing} onRequestClose={() => setIsEditing(false)}>
                <h3>Editar Finanzas</h3>
                <label>
                    Método de Pago:
                    <input type="text" name="paymentMethod" value={editedCliente.paymentMethod} onChange={handleChange} />
                </label>
                <label>
                    ID Fiscal:
                    <input type="text" name="idFiscal" value={editedCliente.idFiscal} onChange={handleChange} />
                </label>
                <label>
                    Historial de Compras:
                    <input type="text" name="historialCompras" value={Array.isArray(editedCliente.historialCompras) ? editedCliente.historialCompras.join(', ') : editedCliente.historialCompras} onChange={handleChange} />
                </label>
                <label>
                    Canal de Captación de Cliente:
                    <input type="text" name="canalCaptacionCliente" value={Array.isArray(editedCliente.canalCaptacionCliente) ? editedCliente.canalCaptacionCliente.join(', ') : editedCliente.canalCaptacionCliente} onChange={handleChange} />
                </label>
                <button className={`condicion-fisica-edit-btn ${theme}`} onClick={handleSaveClick}>Guardar</button>
            </EditModal>
        </div>
    );
};

export default Finanzas;
