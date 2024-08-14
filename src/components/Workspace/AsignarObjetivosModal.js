import React, { useState } from 'react';
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP
import { toast } from 'react-toastify'; // Importa toast para mostrar notificaciones
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Chip } from '@mui/material';

const AsignarObjetivosModal = ({ open, onClose, cliente, theme, onObjetivosAsignados }) => {
    const [nuevosObjetivos, setNuevosObjetivos] = useState(cliente?.objetivos || []);
    const [objetivoActual, setObjetivoActual] = useState('');

    const handleAgregarObjetivo = () => {
        if (objetivoActual.trim() !== '') {
            setNuevosObjetivos([...nuevosObjetivos, objetivoActual.trim()]);
            setObjetivoActual('');
        }
    };

    const handleEliminarObjetivo = (objetivo) => {
        setNuevosObjetivos(nuevosObjetivos.filter(o => o !== objetivo));
    };

    const handleGuardarObjetivos = async () => {
        try {
            await axios.put(`/api/clientes/${cliente._id}`, {
                objetivos: nuevosObjetivos
            });
            onObjetivosAsignados(nuevosObjetivos); // Llamar a la función para actualizar los objetivos en la lista de clientes
            toast.success('Objetivos asignados correctamente.');
            onClose(); // Cerrar el modal después de guardar
        } catch (error) {
            toast.error('Error al asignar los objetivos.');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Asignar Objetivos a {cliente?.nombre} {cliente?.apellido}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nuevo Objetivo"
                    value={objetivoActual}
                    onChange={(e) => setObjetivoActual(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleAgregarObjetivo} color="primary">
                    Agregar Objetivo
                </Button>
                <div style={{ marginTop: '20px' }}>
                    {nuevosObjetivos.map((objetivo, index) => (
                        <Chip
                            key={index}
                            label={objetivo}
                            onDelete={() => handleEliminarObjetivo(objetivo)}
                            style={{ margin: '5px' }}
                        />
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleGuardarObjetivos} color="primary">
                    Guardar Objetivos
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AsignarObjetivosModal;
