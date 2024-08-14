import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CondicionFisica from './CondicionFisica';
import Notas from './Notas';
import Finanzas from './Finanzas';
import PerfilCliente from './PerfilCliente';
import Rutinas from './Rutinas';
import Dietas from './Dietas';
import Planes from './Planes';
import Calendario from './Calendario';
import Historialderegistrodeprogreso from './Historialderegistrodeprogreso';
import Chequins from './Chequins';
import './ClienteDetalle.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const ClienteDetalle = ({ cliente }) => {
    const [clienteDetalle, setClienteDetalle] = useState(cliente);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaNota, setNuevaNota] = useState('');
    const [nuevoTitulo, setNuevoTitulo] = useState('');

    useEffect(() => {
        const fetchClienteDetalle = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/clientes/${cliente._id}`);
                setClienteDetalle(response.data);
            } catch (error) {
                console.error('Error fetching cliente details:', error);
            }
        };

        if (cliente && cliente._id) {
            fetchClienteDetalle();
        }
    }, [cliente]);

    const actualizarCliente = async (nuevoCliente) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/clientes/${clienteDetalle._id}`, nuevoCliente);
            setClienteDetalle(response.data);
        } catch (error) {
            console.error('Error actualizando cliente:', error);
        }
    };

    const abrirModal = () => {
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    const handleNotaChange = (e) => {
        setNuevaNota(e.target.value);
    };

    const handleTituloChange = (e) => {
        setNuevoTitulo(e.target.value);
    };

    const handleAñadirNota = async () => {
        try {
            const nuevaNotaObj = {
                titulo: nuevoTitulo || '',
                contenido: nuevaNota
            };
            const response = await axios.post(`${API_BASE_URL}/api/clientes/${clienteDetalle._id}/notas`, { nota: nuevaNotaObj });
            actualizarCliente(response.data);  // Actualizar el cliente en el estado con la nueva nota
            setNuevaNota('');
            setNuevoTitulo('');
            cerrarModal();
        } catch (error) {
            console.error('Error añadiendo nota:', error);
        }
    };

    const registrosEjemplo = [];

    const registrosChequins = [];

    return (
        <div className="client-detail-container">
            {clienteDetalle ? (
                <div className="client-detail-grid">
                    <CondicionFisica cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                    <Notas cliente={clienteDetalle} actualizarCliente={actualizarCliente} abrirModal={abrirModal} />
                    <Finanzas cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                    <PerfilCliente cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                    <Rutinas cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                    <Dietas cliente={clienteDetalle} />
                    <Planes cliente={clienteDetalle} />
                    <Calendario />
                    <Historialderegistrodeprogreso registros={registrosEjemplo} />
                    <Chequins registros={registrosChequins} />
                </div>
            ) : (
                <p>Cargando detalles del cliente...</p>
            )}
            {mostrarModal && (
                <div className="notas-modal">
                    <div className="notas-modal-content">
                        <span className="notas-close" onClick={cerrarModal}>&times;</span>
                        <h4>Añadir Nota</h4>
                        <input 
                            type="text" 
                            placeholder="Título (opcional)" 
                            value={nuevoTitulo} 
                            onChange={handleTituloChange}
                        />
                        <textarea 
                            placeholder="Añadir nota" 
                            value={nuevaNota} 
                            onChange={handleNotaChange}
                        />
                        <button onClick={handleAñadirNota} className="notasButton">Añadir Nota</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClienteDetalle;
