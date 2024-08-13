import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CommandPopup.css';

const CommandPopup = ({ onClose, theme }) => {
    const [command, setCommand] = useState('');
    const [validationResult, setValidationResult] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmingCommand, setConfirmingCommand] = useState(false);
    const [testQueue, setTestQueue] = useState([]);

    useEffect(() => {
        if (command.trim().toLowerCase() === 'obtenertodoslosclientes') {
            handleCommandSubmit();
        }
    }, [command]);

    useEffect(() => {
        if (testQueue.length > 0) {
            const nextCommand = testQueue[0];
            setTestQueue(testQueue.slice(1));
            setCommand(nextCommand);
            handleConfirmCommand();
        }
    }, [testQueue]);

    const handleCommandChange = (e) => {
        setCommand(e.target.value);
    };

    const handleCommandSubmit = async () => {
        try {
            console.log('Comando enviado:', command);

            setIsAnimating(true);
            setLoading(true);

            const response = await axios.post('/api/commands/execute', { command });

            console.log('Respuesta del servidor:', response.data);

            setLoading(false);
            setIsAnimating(false);

            if (Array.isArray(response.data)) {
                const clientNames = response.data.map(cliente => cliente.nombre || cliente.contenido);
                toast.success(`Clientes obtenidos: ${clientNames.join(', ')}`, {
                    position: "bottom-left",
                });
            } else if (response.data.notas) {
                const notas = response.data.notas.map(nota => nota.contenido);
                toast.success(`Notas obtenidas: ${notas.join(', ')}`, {
                    position: "bottom-left",
                });
            } else {
                toast.info(response.data.message, {
                    position: "bottom-left",
                });
            }
        } catch (error) {
            console.error('Error ejecutando el comando:', error);
            setLoading(false);
            setIsAnimating(false);
            toast.error('Error ejecutando el comando', {
                position: "bottom-left",
            });
        }
    };

    const handleConfirmCommand = () => {
        setConfirmingCommand(true);
        setValidationResult(`¿Estás seguro de que deseas ejecutar el comando: "${command}"?`);
    };

    const handleAcceptCommand = () => {
        setConfirmingCommand(false);
        setValidationResult('');
        handleCommandSubmit();
    };

    const handleRejectCommand = () => {
        setConfirmingCommand(false);
        setValidationResult('');
    };

    const testCommands = () => {
        const createCommand = "crearcliente Juan,Perez,30,M,1.75,75,1234567890,juan.perez@example.com,123 Main St, efectivo";

        setTestQueue([createCommand]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && command.trim().endsWith('.')) {
            const sanitizedCommand = command.trim().slice(0, -1);
            setCommand(sanitizedCommand);
            handleConfirmCommand();
        }
    };
    
    return (
        <div className="CommandPopup-overlay">
            <div className={`CommandPopup-container ${theme}`}>
                <button className="CommandPopup-close-button" onClick={onClose}>X</button>
                <h2 className="CommandPopup-title">Centro de control</h2>
                <div className="CommandPopup-main">
                    <div className="CommandPopup-input-container">
                        <textarea
                            className="CommandPopup-input"
                            value={command}
                            onChange={handleCommandChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Introduce comandos"
                        />
                        <button className="CommandPopup-submit-button" onClick={handleConfirmCommand}>Enviar Comando</button>
                        <button className="CommandPopup-submit-button" onClick={testCommands}>Probar Comandos</button>
                    </div>
                    <div className="CommandPopup-sections">
                        <div className={`CommandPopup-section CommandPopup-section-validation ${isAnimating ? 'animating' : ''}`}>
                            {loading && <div className="loading-bar"></div>}
                            <p>{validationResult}</p>
                            {confirmingCommand && (
                                <div className="CommandPopup-buttons">
                                    <button className="CommandPopup-accept-button" onClick={handleAcceptCommand}>Aceptar</button>
                                    <button className="CommandPopup-reject-button" onClick={handleRejectCommand}>Rechazar</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CommandPopup;
