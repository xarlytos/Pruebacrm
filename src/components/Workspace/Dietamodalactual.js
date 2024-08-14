import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DietaModalActual = ({ open, onClose, cliente }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Plan de Dieta Actual</DialogTitle>
            <DialogContent>
                <p>Mostrando el plan de dieta para: {cliente?.nombre} {cliente?.apellido}</p>
                {/* Aquí puedes agregar los detalles del plan de dieta del cliente */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DietaModalActual;
