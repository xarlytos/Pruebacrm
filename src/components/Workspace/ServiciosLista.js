import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MenuItem, Select, Button, TextField, Dialog, DialogContent, DialogActions } from '@mui/material';
import './ServiciosLista.css';
import ServiciosPopup from './ServiciosPopup'; // Asegúrate de que ServiciosPopup esté correctamente importado

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const ServiciosLista = ({ theme }) => {
    const [plantillaServicios, setPlantillaServicios] = useState([]);
    const [creadosServicios, setCreadosServicios] = useState([]);
    const [plantillaFilter, setPlantillaFilter] = useState('');
    const [creadosFilter, setCreadosFilter] = useState('');
    const [selectedPlantillaFilter, setSelectedPlantillaFilter] = useState('');
    const [selectedCreadosFilter, setSelectedCreadosFilter] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);  // Estado para controlar el modal

    useEffect(() => {
        fetchPlantillaServicios();
        fetchCreadosServicios();
    }, []);

    const fetchPlantillaServicios = () => {
        axios.get(`${API_BASE_URL}/api/servicios/plantilla`)
            .then(response => {
                setPlantillaServicios(response.data);
            })
            .catch(error => {
                console.error('Error al cargar los servicios de plantilla:', error);
            });
    };

    const fetchCreadosServicios = () => {
        axios.get(`${API_BASE_URL}/api/servicios/creados`)
            .then(response => {
                setCreadosServicios(response.data);
            })
            .catch(error => {
                console.error('Error al cargar los servicios creados:', error);
            });
    };

    const handlePlantillaFilterChange = (e) => {
        setPlantillaFilter(e.target.value);
    };

    const handleCreadosFilterChange = (e) => {
        setCreadosFilter(e.target.value);
    };

    const handleSaveServicio = (newServicio) => {
        axios.post(`${API_BASE_URL}/api/servicios/crear-desde-plantilla`, newServicio)
            .then(response => {
                setCreadosServicios([...creadosServicios, response.data]);
                setIsPopupOpen(false);  // Cerrar el modal al guardar
            })
            .catch(error => {
                console.error('Error al generar el servicio:', error);
            });
    };

    const handleOpenPopup = () => {
        setIsPopupOpen(true);  // Abrir el modal
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);  // Cerrar el modal
    };

    const filteredPlantillaServicios = plantillaServicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(plantillaFilter.toLowerCase())
    );

    const filteredCreadosServicios = creadosServicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(creadosFilter.toLowerCase())
    );

    return (
        <div className={`servicioslista-servicios-lista ${theme}`}>
            <h2>Gestión de Servicios</h2>
            <div className="servicioslista-botones-acciones">
                <Button variant="contained" color="secondary" onClick={handleOpenPopup}>
                    Generar Servicio a través de Plantilla
                </Button>
            </div>

            <div className="servicioslista-tablas-contenedor">
                <div className="servicioslista-tabla-contenedor">
                    <h3>Servicios de Plantilla</h3>
                    <div className="servicioslista-filtro-busqueda">
                        <TextField
                            label="Buscar Servicios de Plantilla"
                            variant="outlined"
                            value={plantillaFilter}
                            onChange={handlePlantillaFilterChange}
                            className="servicioslista-input-filtro"
                        />
                        <Select
                            value={selectedPlantillaFilter}
                            onChange={(e) => setSelectedPlantillaFilter(e.target.value)}
                            displayEmpty
                            className="servicioslista-dropdown-filtro"
                        >
                            <MenuItem value="">
                                <em>Filtrar por...</em>
                            </MenuItem>
                            <MenuItem value="nombre">Nombre</MenuItem>
                            <MenuItem value="precio">Precio</MenuItem>
                        </Select>
                    </div>
                    <table className="servicioslista-tabla-servicios">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlantillaServicios.map(servicio => (
                                <tr key={servicio._id}>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.descripcion}</td>
                                    <td>{servicio.precio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="servicioslista-tabla-contenedor">
                    <h3>Servicios Creados</h3>
                    <div className="servicioslista-filtro-busqueda">
                        <TextField
                            label="Buscar Servicios Creados"
                            variant="outlined"
                            value={creadosFilter}
                            onChange={handleCreadosFilterChange}
                            className="servicioslista-input-filtro"
                        />
                        <Select
                            value={selectedCreadosFilter}
                            onChange={(e) => setSelectedCreadosFilter(e.target.value)}
                            displayEmpty
                            className="servicioslista-dropdown-filtro"
                        >
                            <MenuItem value="">
                                <em>Filtrar por...</em>
                            </MenuItem>
                            <MenuItem value="nombre">Nombre</MenuItem>
                            <MenuItem value="precio">Precio</MenuItem>
                        </Select>
                    </div>
                    <table className="servicioslista-tabla-servicios">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCreadosServicios.map(servicio => (
                                <tr key={servicio._id}>
                                    <td>{servicio.nombre}</td>
                                    <td>{servicio.descripcion}</td>
                                    <td>{servicio.precio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Dialogo para Generar Servicio a través de Plantilla */}
            <Dialog
    open={isPopupOpen}
    onClose={handleClosePopup}
    fullWidth
    maxWidth="lg" // Cambiaremos a "lg" para que sea aún más ancho
    PaperProps={{
        style: {
            minHeight: '80vh', // Altura mínima del 80% de la pantalla
            minWidth: '80vw',  // Ancho mínimo del 80% de la pantalla
        },
    }}
>
    <DialogContent>
        <ServiciosPopup
            plantillaServicios={plantillaServicios}
            onClose={handleClosePopup}
            onSave={handleSaveServicio}
        />
    </DialogContent>
</Dialog>

        </div>
    );
};

export default ServiciosLista;
