import React, { useState } from 'react';
import { Button, Select, MenuItem, Typography, DialogActions, Dialog, DialogContent, TextField, Grid } from '@mui/material';
import './ServiciosPopup.css';

const ServiciosPopup = ({ onClose }) => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [selectedPlanPago, setSelectedPlanPago] = useState('');
    const [selectedUtility, setSelectedUtility] = useState('');
    const [utilities, setUtilities] = useState([]);
    const [utilityOptions, setUtilityOptions] = useState({});
    const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState('');
    const [selectedSubscriptionService, setSelectedSubscriptionService] = useState('');
    const [showPaymentPlan, setShowPaymentPlan] = useState(false);
    const [showUtilities, setShowUtilities] = useState(false);
    const [showSubscriptionPlan, setShowSubscriptionPlan] = useState(false);
    const [showSubscriptionServices, setShowSubscriptionServices] = useState(false);
    const [isCrearServicioPopupOpen, setIsCrearServicioPopupOpen] = useState(false);
    const [isCrearPlanPagoPopupOpen, setIsCrearPlanPagoPopupOpen] = useState(false);
    const [isCrearClientePopupOpen, setIsCrearClientePopupOpen] = useState(false);
    const [isCrearDietaPopupOpen, setIsCrearDietaPopupOpen] = useState(false);

    const handleServiceChange = (e) => {
        const value = e.target.value;
        setSelectedService(value);
        resetState();

        if (value === 'asesoria_individual') {
            setShowPaymentPlan(false);
        } else if (value === 'subscripcion') {
            setShowSubscriptionPlan(true);
        }
    };

    const resetState = () => {
        setShowPaymentPlan(false);
        setShowUtilities(false);
        setShowSubscriptionPlan(false);
        setShowSubscriptionServices(false);
        setSelectedClient('');
        setSelectedPlanPago('');
        setSelectedUtility('');
        setUtilities([]);
        setUtilityOptions({});
        setSelectedSubscriptionPlan('');
        setSelectedSubscriptionService('');
    };

    const handleClientSelection = (e) => {
        setSelectedClient(e.target.value);
        setShowPaymentPlan(true); // Mostrar "Plan de Pago" después de seleccionar el cliente
    };

    const handlePaymentPlanSelection = (e) => {
        setSelectedPlanPago(e.target.value);
        setShowUtilities(true);
    };

    const handleSubscriptionPlanSelection = (e) => {
        setSelectedSubscriptionPlan(e.target.value);
        setShowSubscriptionServices(true);
    };

    const handleSubscriptionServiceSelection = (e) => {
        setSelectedSubscriptionService(e.target.value);
    };

    const handleUtilitySelection = (e) => {
        const utility = e.target.value;
        setSelectedUtility(utility);
        if (!utilities.includes(utility)) {
            setUtilities([...utilities, utility]);
        }
    };

    const handleUtilityOptionSelection = (utility, option) => {
        setUtilityOptions({ ...utilityOptions, [utility]: option });
    };

    const handleRemoveUtility = (utility) => {
        setUtilities(utilities.filter(u => u !== utility));
        const newUtilityOptions = { ...utilityOptions };
        delete newUtilityOptions[utility];
        setUtilityOptions(newUtilityOptions);
    };

    // Controladores para popups
    const handleOpenCrearServicioPopup = () => {
        setIsCrearServicioPopupOpen(true);
    };

    const handleCloseCrearServicioPopup = () => {
        setIsCrearServicioPopupOpen(false);
    };

    const handleCreateService = (newService) => {
        console.log(`Nuevo servicio creado: ${newService}`);
        setIsCrearServicioPopupOpen(false);
    };

    const handleOpenCrearPlanPagoPopup = () => {
        setIsCrearPlanPagoPopupOpen(true);
    };

    const handleCloseCrearPlanPagoPopup = () => {
        setIsCrearPlanPagoPopupOpen(false);
    };

    const handleCreatePlanPago = (newPlan) => {
        console.log(`Nuevo plan de pago creado: ${newPlan}`);
        setIsCrearPlanPagoPopupOpen(false);
    };

    const handleOpenCrearDietaPopup = () => {
        setIsCrearDietaPopupOpen(true);
    };

    const handleCloseCrearDietaPopup = () => {
        setIsCrearDietaPopupOpen(false);
    };

    const handleCreateDieta = (newDieta) => {
        console.log(`Nueva dieta creada: ${newDieta}`);
        setIsCrearDietaPopupOpen(false);
    };

    const handleCreateCliente = (newCliente) => {
        console.log(`Nuevo cliente creado: ${newCliente}`);
        setIsCrearClientePopupOpen(false);
    };

    return (
        <div className="servicios-popup">
            <Typography variant="h6" className="servicios-popup-title">
                Elegir Servicio
            </Typography>
            <Select
                value={selectedService}
                onChange={handleServiceChange}
                fullWidth
                displayEmpty
                className="servicios-popup-select"
            >
                <MenuItem value="" disabled>
                    Selecciona un servicio
                </MenuItem>
                <MenuItem value="subscripcion">Subscripción</MenuItem>
                <MenuItem value="asesoria_individual">Asesoría Individual</MenuItem>
                <MenuItem value="clases_grupales">Clases Grupales</MenuItem>
            </Select>

            {selectedService && (
                <Typography variant="body1" align="center" className="servicios-popup-selected">
                    Servicio seleccionado: {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)}
                </Typography>
            )}

            {/* Sección de Subscripción */}
            {showSubscriptionPlan && (
                <>
                    <Grid container alignItems="center" className="servicios-popup-grid">
                        <Grid item xs={8}>
                            <Typography variant="h6" className="servicios-popup-title">
                                Plan de Pago
                            </Typography>
                        </Grid>
                        <Grid item xs={4} className="servicios-popup-create-button-container">
                            <Button
                                variant="outlined"
                                onClick={handleOpenCrearPlanPagoPopup}
                                className="servicios-popup-create-button"
                            >
                                Crear un nuevo plan de pago
                            </Button>
                        </Grid>
                    </Grid>
                    <Select
                        value={selectedSubscriptionPlan}
                        onChange={handleSubscriptionPlanSelection}
                        fullWidth
                        displayEmpty
                        className="servicios-popup-select"
                    >
                        <MenuItem value="" disabled>
                            Selecciona un plan de pago
                        </MenuItem>
                        {/* Aquí se listarían los planes de pago disponibles */}
                        <MenuItem value="plan_1">Plan de Pago 1</MenuItem>
                        <MenuItem value="plan_2">Plan de Pago 2</MenuItem>
                    </Select>
                    {selectedSubscriptionPlan && (
                        <Typography variant="body1" align="center" className="servicios-popup-selected">
                            Plan de Pago seleccionado: {selectedSubscriptionPlan}
                        </Typography>
                    )}
                </>
            )}

            {showSubscriptionServices && (
                <>
                    <Grid container alignItems="center" className="servicios-popup-grid">
                        <Grid item xs={12}>
                            <Typography variant="h6" className="servicios-popup-title">
                                Servicios
                            </Typography>
                        </Grid>
                    </Grid>
                    <Select
                        value={selectedSubscriptionService}
                        onChange={handleSubscriptionServiceSelection}
                        fullWidth
                        displayEmpty
                        className="servicios-popup-select"
                    >
                        <MenuItem value="" disabled>
                            Selecciona un servicio
                        </MenuItem>
                        {/* Aquí se listarían los servicios disponibles */}
                        <MenuItem value="servicio_1">Servicio 1</MenuItem>
                        <MenuItem value="servicio_2">Servicio 2</MenuItem>
                    </Select>
                    {selectedSubscriptionService && (
                        <Typography variant="body1" align="center" className="servicios-popup-selected">
                            Servicio seleccionado: {selectedSubscriptionService}
                        </Typography>
                    )}
                </>
            )}

            {/* Sección de selección de Cliente para Asesoría Individual */}
            {selectedService === 'asesoria_individual' && (
                <>
                    <Grid container alignItems="center" className="servicios-popup-grid">
                        <Grid item xs={8}>
                            <Typography variant="h6" className="servicios-popup-title">
                                Elegir Cliente
                            </Typography>
                        </Grid>
                        <Grid item xs={4} className="servicios-popup-create-button-container">
                            <Button
                                variant="outlined"
                                onClick={() => setIsCrearClientePopupOpen(true)}
                                className="servicios-popup-create-button"
                            >
                                Crear un nuevo cliente
                            </Button>
                        </Grid>
                    </Grid>
                    <Select
                        value={selectedClient}
                        onChange={handleClientSelection}
                        fullWidth
                        displayEmpty
                        className="servicios-popup-select"
                    >
                        <MenuItem value="" disabled>
                            Selecciona un cliente
                        </MenuItem>
                        {/* Aquí se listarían los clientes disponibles */}
                        <MenuItem value="cliente_1">Cliente 1</MenuItem>
                        <MenuItem value="cliente_2">Cliente 2</MenuItem>
                    </Select>
                    {selectedClient && (
                        <Typography variant="body1" align="center" className="servicios-popup-selected">
                            Cliente seleccionado: {selectedClient}
                        </Typography>
                    )}
                </>
            )}

            {/* Sección de Plan de Pago para Asesoría Individual */}
            {showPaymentPlan && (
                <>
                    <Grid container alignItems="center" className="servicios-popup-grid">
                        <Grid item xs={8}>
                            <Typography variant="h6" className="servicios-popup-title">
                                Plan de Pago
                            </Typography>
                        </Grid>
                        <Grid item xs={4} className="servicios-popup-create-button-container">
                            <Button
                                variant="outlined"
                                onClick={handleOpenCrearPlanPagoPopup}
                                className="servicios-popup-create-button"
                            >
                                Crear un nuevo plan de pago
                            </Button>
                        </Grid>
                    </Grid>
                    <Select
                        value={selectedPlanPago}
                        onChange={handlePaymentPlanSelection}
                        fullWidth
                        displayEmpty
                        className="servicios-popup-select"
                    >
                        <MenuItem value="" disabled>
                            Selecciona un plan de pago
                        </MenuItem>
                        {/* Aquí se listarían los planes de pago disponibles */}
                        <MenuItem value="plan_1">Plan de Pago 1</MenuItem>
                        <MenuItem value="plan_2">Plan de Pago 2</MenuItem>
                    </Select>
                    {selectedPlanPago && (
                        <Typography variant="body1" align="center" className="servicios-popup-selected">
                            Plan de Pago seleccionado: {selectedPlanPago}
                        </Typography>
                    )}
                </>
            )}

            {/* Sección de Utilidades para Asesoría Individual */}
            {showUtilities && (
                <>
                    <Grid container alignItems="center" className="servicios-popup-grid">
                        <Grid item xs={12}>
                            <Typography variant="h6" className="servicios-popup-title">
                                Utilidades
                            </Typography>
                        </Grid>
                    </Grid>
                    <Select
                        value={selectedUtility}
                        onChange={handleUtilitySelection}
                        fullWidth
                        displayEmpty
                        className="servicios-popup-select"
                    >
                        <MenuItem value="" disabled>
                            Selecciona una utilidad
                        </MenuItem>
                        <MenuItem value="dieta">Dieta</MenuItem>
                        <MenuItem value="planificacion">Planificación</MenuItem>
                    </Select>
                </>
            )}

            {/* Mostrar Utilidades Seleccionadas */}
            {utilities.length > 0 && (
                <div className="servicios-popup-utilities-selected">
                    {utilities.map((utility) => (
                        <div key={utility}>
                            <Typography variant="body1" align="center" className="servicios-popup-selected">
                                Utilidad seleccionada: {utility.charAt(0).toUpperCase() + utility.slice(1)}
                            </Typography>
                            <Grid container alignItems="center" className="servicios-popup-grid">
                                <Grid item xs={8}>
                                    <Typography variant="h6" className="servicios-popup-title">
                                        {utility === 'dieta' ? 'Elegir Dieta' : 'Elegir Planificación'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} className="servicios-popup-create-button-container">
                                    <Button
                                        variant="outlined"
                                        onClick={handleOpenCrearDietaPopup}
                                        className="servicios-popup-create-button"
                                    >
                                        Crear una nueva {utility}
                                    </Button>
                                </Grid>
                            </Grid>
                            <Select
                                value={utilityOptions[utility] || ''}
                                onChange={(e) => handleUtilityOptionSelection(utility, e.target.value)}
                                fullWidth
                                displayEmpty
                                className="servicios-popup-select"
                            >
                                <MenuItem value="" disabled>
                                    Selecciona una {utility}
                                </MenuItem>
                                {/* Aquí se listarían las opciones disponibles para la utilidad seleccionada */}
                                <MenuItem value={`${utility}_1`}>{utility.charAt(0).toUpperCase() + utility.slice(1)} 1</MenuItem>
                                <MenuItem value={`${utility}_2`}>{utility.charAt(0).toUpperCase() + utility.slice(1)} 2</MenuItem>
                            </Select>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleRemoveUtility(utility)}
                                className="servicios-popup-remove-button"
                            >
                                Quitar {utility}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <DialogActions className="servicios-popup-actions">
                <Button onClick={onClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={() => console.log('Guardar')} color="primary">
                    Guardar
                </Button>
            </DialogActions>

            {/* Popup para crear un servicio */}
            <Dialog open={isCrearServicioPopupOpen} onClose={handleCloseCrearServicioPopup} fullWidth maxWidth="sm">
                <DialogContent>
                    <TextField
                        label="Nombre del Servicio"
                        fullWidth
                        margin="normal"
                        onChange={(e) => console.log(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCrearServicioPopup} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleCreateService('Nuevo Servicio')} color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Popup para crear un plan de pago */}
            <Dialog open={isCrearPlanPagoPopupOpen} onClose={handleCloseCrearPlanPagoPopup} fullWidth maxWidth="sm">
                <DialogContent>
                    <TextField
                        label="Nombre del Plan de Pago"
                        fullWidth
                        margin="normal"
                        onChange={(e) => console.log(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCrearPlanPagoPopup} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleCreatePlanPago('Nuevo Plan de Pago')} color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Popup para crear un cliente */}
            <Dialog open={isCrearClientePopupOpen} onClose={() => setIsCrearClientePopupOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <TextField
                        label="Nombre del Cliente"
                        fullWidth
                        margin="normal"
                        onChange={(e) => console.log(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCrearClientePopupOpen(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleCreateCliente('Nuevo Cliente')} color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Popup para crear una dieta */}
            <Dialog open={isCrearDietaPopupOpen} onClose={handleCloseCrearDietaPopup} fullWidth maxWidth="sm">
                <DialogContent>
                    <TextField
                        label="Nombre de la Dieta"
                        fullWidth
                        margin="normal"
                        onChange={(e) => console.log(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCrearDietaPopup} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => handleCreateDieta('Nueva Dieta')} color="primary">
                        Crear
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ServiciosPopup;
