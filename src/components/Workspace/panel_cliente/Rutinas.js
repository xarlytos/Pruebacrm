import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PopupDeCreacionDePlanificacion from '../../Rutinas/PopupDeCreacionDePlanificacion'; // Actualiza la ruta según corresponda
import './Rutinas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Rutinas = ({ cliente, actualizarCliente }) => {
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [rutinas, setRutinas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRutinas = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/clientes/${cliente._id}/rutinas`);
                setRutinas(response.data);
            } catch (error) {
                console.error('Error fetching rutinas:', error);
            }
        };

        if (cliente && cliente._id) {
            fetchRutinas();
        }
    }, [cliente._id]);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowViewModal = () => {
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
    };

    const handleSaveRutina = (rutina) => {
        const nuevasRutinas = [...rutinas, rutina];
        setRutinas(nuevasRutinas);
        actualizarCliente({ ...cliente, planEntrenamiento: nuevasRutinas });
    };

    const handleEditRoutine = (routineId) => {
        navigate(`/edit-routine/${routineId}`);
    };

    return (
        <div className="rutinas-section">
            <div className="rutinas-header">
                <h3>Rutinas</h3>
                <button onClick={handleShowModal} className="rutinas-notas-button">+</button>
                <button onClick={handleShowViewModal} className="rutinas-ver-button">Ver</button>
            </div>
            <ul>
                {rutinas.map((rutina, index) => (
                    <li key={index}>
                        {rutina.nombre}
                        <button
                            className="rutinas-editar-button"
                            onClick={() => handleEditRoutine(rutina._id)}
                        >
                            Editar
                        </button>
                    </li>
                ))}
            </ul>
            {showModal && (
                <PopupDeCreacionDePlanificacion
                    show={showModal}
                    onClose={handleCloseModal}
                    predefinedMetas={['Meta 1', 'Meta 2', 'Meta 3']} // Actualiza según sea necesario
                />
            )}
            {showViewModal && (
                <div className="rutinas-popup-overlay" onClick={handleCloseViewModal}>
                    <div className="rutinas-popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Rutinas del Cliente</h2>
                        <ul>
                            {rutinas.map((rutina, index) => (
                                <li key={index}>
                                    <h3>{rutina.nombre}</h3>
                                    <p>Fecha Inicio: {new Date(rutina.fechaInicio).toLocaleDateString()}</p>
                                    {rutina.fechaFin && <p>Fecha Fin: {new Date(rutina.fechaFin).toLocaleDateString()}</p>}
                                    <p>Ejercicios:</p>
                                    <ul>
                                        {rutina.ejercicios.map((ejercicio, idx) => (
                                            <li key={idx}>
                                                {ejercicio.nombre} - {ejercicio.series} series de {ejercicio.repeticiones} repeticiones
                                            </li>
                                        ))}
                                    </ul>
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

export default Rutinas;
