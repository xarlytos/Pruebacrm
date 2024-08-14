import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

const ActualizarMetodoPagoModal = ({ open, onClose, cliente, onMetodoPagoActualizado }) => {
    const [metodoPago, setMetodoPago] = useState(cliente?.paymentMethod || '');

    const handleMetodoPagoChange = (event) => {
        setMetodoPago(event.target.value);
    };

    const handleGuardarMetodoPago = async () => {
        try {
            const response = await axios.put(`/api/clientes/${cliente._id}`, {
                paymentMethod: metodoPago
            });
            console.log('Respuesta del servidor:', response.data); // Agrega esta línea para depurar
            onMetodoPagoActualizado(metodoPago); // Actualizar la lista de clientes
            toast.success('Método de pago actualizado correctamente.');
            onClose();
        } catch (error) {
            console.error('Error al actualizar el método de pago:', error.response || error.message); // Mostrar el error exacto
            toast.error('Error al actualizar el método de pago.');
        }
    };
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Actualizar Método de Pago para {cliente?.nombre} {cliente?.apellido}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Método de Pago</InputLabel>
                    <Select
                        value={metodoPago}
                        onChange={handleMetodoPagoChange}
                    >
                        <MenuItem value="stripe">Stripe</MenuItem>
                        <MenuItem value="banco">Banco</MenuItem>
                        <MenuItem value="efectivo">Efectivo</MenuItem>
                        <MenuItem value="mixto">Mixto</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancelar
                </Button>
                <Button onClick={handleGuardarMetodoPago} color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActualizarMetodoPagoModal;
