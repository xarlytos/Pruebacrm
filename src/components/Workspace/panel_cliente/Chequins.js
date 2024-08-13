// Chequins.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './Chequins.css';

const Chequins = ({ registros }) => {
    const [semanaActual, setSemanaActual] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [detalleDia, setDetalleDia] = useState(null);

    const obtenerDiasDeLaSemana = (semanaOffset) => {
        const fechaActual = new Date();
        fechaActual.setDate(fechaActual.getDate() - (fechaActual.getDay() + 6) % 7); // Obtener el primer día de la semana (lunes)
        fechaActual.setDate(fechaActual.getDate() + (semanaOffset * 7));

        const diasSemana = [];
        for (let i = 0; i < 7; i++) {
            const dia = new Date(fechaActual);
            dia.setDate(fechaActual.getDate() + i);
            diasSemana.push(dia);
        }
        return diasSemana;
    };

    const obtenerRegistroPorFecha = (fecha) => {
        const registro = registros.find(reg => {
            const fechaRegistro = new Date(reg.fecha);
            return fechaRegistro.toDateString() === fecha.toDateString();
        });
        return registro ? registro : { fecha: fecha.toLocaleDateString(), estado: 'sin datos' };
    };

    const diasSemanaActual = obtenerDiasDeLaSemana(semanaActual);

    const abrirModalDetalles = (fecha) => {
        const detalle = obtenerRegistroPorFecha(fecha);
        setDetalleDia(detalle);
        setShowModal(true);
    };

    const obtenerEmoticonoPorEstado = (estado) => {
        switch (estado) {
            case 'verde':
                return '🟢';
            case 'naranja':
                return '🟠';
            case 'rojo':
                return '🔴';
            default:
                return '⚪️';
        }
    };

    return (
        <div className="chequins-container">
            <h2>Check-ins de la Semana {semanaActual === 0 ? 'Actual' : `${semanaActual > 0 ? '+' : ''}${semanaActual}`}</h2>
            <div className="chequins-navigation">
                <button onClick={() => setSemanaActual(semanaActual - 1)}>Semana Anterior</button>
                <button onClick={() => setSemanaActual(semanaActual + 1)}>Semana Siguiente</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {diasSemanaActual.map((dia, index) => (
                        <tr key={index} className={`estado-${obtenerRegistroPorFecha(dia).estado}`}>
                            <td>{dia.toLocaleDateString()}</td>
                            <td>{obtenerEmoticonoPorEstado(obtenerRegistroPorFecha(dia).estado)}</td>
                            <td>
                                <button onClick={() => abrirModalDetalles(dia)}>Detalles</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                {detalleDia && (
                    <div>
                        <h3>Detalles del {detalleDia.fecha}</h3>
                        <p>Estado: {detalleDia.estado}</p>
                        {/* Aquí puedes añadir más detalles específicos del entrenamiento */}
                    </div>
                )}
            </Modal>
        </div>
    );
};

Chequins.propTypes = {
    registros: PropTypes.arrayOf(PropTypes.shape({
        fecha: PropTypes.string.isRequired,
        estado: PropTypes.string.isRequired
    })).isRequired
};

export default Chequins;
