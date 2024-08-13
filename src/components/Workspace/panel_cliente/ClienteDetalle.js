import React, { useState } from 'react';
import axios from 'axios';  // Importar axios aquí
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

const ClienteDetalle = ({ cliente }) => {
    const [clienteDetalle, setClienteDetalle] = useState(cliente);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaNota, setNuevaNota] = useState('');
    const [nuevoTitulo, setNuevoTitulo] = useState('');

    const actualizarCliente = (nuevoCliente) => {
        setClienteDetalle(nuevoCliente);
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
            console.log('Añadiendo nota:', nuevaNotaObj);
            const response = await axios.post(`/api/clientes/${clienteDetalle._id}/notas`, { nota: nuevaNotaObj });
            actualizarCliente(response.data); // Actualiza el cliente en el estado padre
            setNuevaNota('');
            setNuevoTitulo('');
            cerrarModal();
        } catch (error) {
            console.error('Error añadiendo nota:', error);
        }
    };

    const registrosEjemplo = [
    ];

    const registrosChequins = [
    ];

    return (
        <div className="client-detail-container">
            <div className="client-detail-grid">
                <CondicionFisica cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                <Notas 
                    cliente={clienteDetalle} 
                    actualizarCliente={actualizarCliente} 
                    abrirModal={abrirModal} 
                />
                <Finanzas cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                <PerfilCliente cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                <Rutinas cliente={clienteDetalle} actualizarCliente={actualizarCliente} />
                <Dietas cliente={clienteDetalle} />
                <Planes cliente={clienteDetalle} />
                <Calendario />
                <Historialderegistrodeprogreso registros={registrosEjemplo} />
                <Chequins registros={registrosChequins} />
            </div>
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
