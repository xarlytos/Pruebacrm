// src/components/Dietas.js
import React, { useState } from 'react';
import CrearDieta from '../CrearDieta';
import './Dietas.css';

const Dietas = ({ cliente }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveDieta = (dieta) => {
        // Aquí puedes actualizar el cliente en el estado padre o enviar la dieta al backend
    };

    return (
        <div className="section">
            <div className="header">
                <h3>Dietas</h3>
                <button onClick={handleShowModal} className="notasButton">+</button>
            </div>
            <ul>
                {cliente.planDieta.map((dieta, index) => (
                    <li key={index}>{dieta.nombreDieta}</li>
                ))}
            </ul>
            {showModal && (
                <CrearDieta clienteId={cliente._id} onClose={handleCloseModal} onSave={handleSaveDieta} />
            )}
        </div>
    );
};

export default Dietas;
