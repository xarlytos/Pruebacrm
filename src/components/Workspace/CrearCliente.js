import React, { useState } from 'react';
import axios from 'axios';
import './CrearCliente.css';

const CrearCliente = ({ onClose, onClienteCreado, theme }) => {
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        estado: '',
        telefono: '',
        email: '',
        tag: '',
        tipoDePlan: '',
        ultimoCheckin: '',
        clase: '',
        porcentajeCumplimiento: '',
        alertas: '',
        edad: '',
        genero: '',
        altura: '',
        peso: '',
        direccion: '',
        paymentMethod: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente({
            ...cliente,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/api/clientes', cliente)
            .then(response => {
                console.log('Cliente creado:', response.data);
                onClienteCreado();
                onClose();
            })
            .catch(error => {
                console.error('Hubo un error al crear el cliente:', error);
            });
    };

    return (
        <div className={`modalcrearcliente ${theme}`}>
            <div className={`modal-contentmodalcrearcliente ${theme}`}>
                <span className={`close ${theme}`} onClick={onClose}>&times;</span>
                <h2>Crear Cliente</h2>
                <form onSubmit={handleSubmit} className="form-grid">
                    {Object.keys(cliente).map(key => (
                        <div key={key}>
                            <label className={theme}>{key.charAt(0).toUpperCase() + key.slice(1)} <span className="required">*</span></label>
                            <input 
                                type={key === 'email' ? 'email' : 'text'} 
                                name={key} 
                                value={cliente[key]} 
                                onChange={handleChange} 
                                className={theme} 
                                required={['nombre', 'email'].includes(key)}
                            />
                        </div>
                    ))}
                    <button type="submit" className={theme}>Crear</button>
                </form>
            </div>
        </div>
    );
};

export default CrearCliente;
