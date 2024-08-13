import React, { useState } from 'react';
import './Planes.css';

const Planes = ({ cliente }) => {
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false); // Nuevo estado para el popup de visualización

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowViewModal = () => { // Función para mostrar el popup de visualización
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => { // Función para cerrar el popup de visualización
        setShowViewModal(false);
    };

    return (
        <div className="section">
            <div className="header">
                <h3>Planes</h3>
                <button onClick={handleShowModal} className="notasButton">+</button>
                <button onClick={handleShowViewModal} className="verButton">Ver</button> {/* Nuevo botón "Ver" */}
            </div>
            <ul>
                {cliente.associatedPlans.map((plan, index) => (
                    <li key={index}>{plan}</li>
                ))}
            </ul>
            {showModal && (
                <div className="modal">
                    {/* Modal content */}
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Crear Plan</h2>
                        {/* Formulario para crear un nuevo plan */}
                    </div>
                </div>
            )}
            {showViewModal && ( // Nuevo popup de visualización
                <div className="popup-overlay" onClick={handleCloseViewModal}>
                    <div className="popup-content">
                        <h2>Planes del Cliente</h2>
                        <ul>
                            {cliente.associatedPlans.map((plan, index) => (
                                <li key={index}>
                                    <h3>{plan.nombrePlan}</h3>
                                    <p>Fecha Inicio: {new Date(plan.fechaInicio).toLocaleDateString()}</p>
                                    {plan.fechaFin && <p>Fecha Fin: {new Date(plan.fechaFin).toLocaleDateString()}</p>}
                                    <p>Detalles:</p>
                                    <p>{plan.detalles}</p>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleCloseViewModal}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planes;
