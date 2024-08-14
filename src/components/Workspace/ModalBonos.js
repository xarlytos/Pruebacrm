import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';

const ModalBonos = ({ open, onClose, cliente, theme }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Bonos Asociados para {cliente?.nombre} {cliente?.apellido}</DialogTitle>
            <DialogContent>
                {cliente?.associatedBonos && cliente.associatedBonos.length > 0 ? (
                    <List>
                        {cliente.associatedBonos.map((bono, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`Bono ${index + 1}`}
                                    secondary={`ID del Bono: ${bono}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <p>No se han encontrado bonos asociados para este cliente.</p>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalBonos;
