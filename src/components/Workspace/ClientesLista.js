import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import ClienteDetalle from './panel_cliente/ClienteDetalle';
import CrearCliente from './CrearCliente';
import SeleccionCategoriasModal from '../SeleccionCategoriasModal';
import CalendarView from './calendario/CalendarView';
import PopupClienteCSV from './PopupClienteCSV';
import CommandPopup from './CommandPopup';
import Componentedesplegable from './Componentedesplegable/Componentedesplegable';
import ChaterModalInterfaz from './Componentedesplegable/ChaterModalInterfaz';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ClientFilterDropdown from '../Workspace/ClientFilterDropdown';
import './ClientesLista.css';
import { MdDelete, MdViewModule, MdViewList, MdUpload, MdOpenInBrowser, MdWbSunny, MdBrightness3, MdFilterList, MdClose, MdExpandMore, MdNoteAdd, MdFitnessCenter, MdFlag, MdRestaurant, MdMessage, MdPayment, MdCardGiftcard, MdBarChart, MdFileDownload } from 'react-icons/md';
import { Menu, MenuItem } from '@mui/material';

const camposDisponibles = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'estado', label: 'Estado' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'tag', label: 'Tag' },
    { key: 'tipoDePlan', label: 'Tipo de Plan' },
    { key: 'ultimoCheckin', label: 'Último Check-in' },
    { key: 'clase', label: 'Clase' },
    { key: 'porcentajeCumplimiento', label: '% Cumplimiento' },
    { key: 'alertas', label: 'Alertas' }
];

const ClientesLista = ({ theme, setTheme }) => {
    const [clientes, setClientes] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [clientesSeleccionados, setClientesSeleccionados] = useState([]);
    const [mostrarModalCrearCliente, setMostrarModalCrearCliente] = useState(false);
    const [mostrarModalCategorias, setMostrarModalCategorias] = useState(false);
    const [camposVisibles, setCamposVisibles] = useState(camposDisponibles.map(campo => campo.key));
    const [orden, setOrden] = useState({ campo: null, direccion: null });
    const [vistaCalendario, setVistaCalendario] = useState(false);
    const [vistaCalendarioTipo, setVistaCalendarioTipo] = useState('month');
    const [mostrarPopupCSV, setMostrarPopupCSV] = useState(false);
    const [mostrarCommandPopup, setMostrarCommandPopup] = useState(false);
    const [mostrarComponentedesplegable, setMostrarComponentedesplegable] = useState(false);
    const [selectedChats, setSelectedChats] = useState([]);
    const [filtrosAvanzados, setFiltrosAvanzados] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = () => {
        axios.get('/api/clientes')
            .then(response => {
                setClientes(response.data);
                toast.success('Clientes cargados correctamente');
            })
            .catch(error => {
                toast.error('Error al cargar los clientes');
            });
    };

    const handleClienteClick = (cliente) => {
        setSelectedCliente(prev => prev && prev._id === cliente._id ? null : cliente);
    };

    const handleCheckboxChange = (e, cliente) => {
        e.stopPropagation();
        setClientesSeleccionados(prev =>
            prev.includes(cliente._id) ? prev.filter(id => id !== cliente._id) : [...prev, cliente._id]
        );
    };

    const handleFiltroChange = (e) => {
        setFiltro(e.target.value);
    };

    const handleCrearCliente = () => {
        setMostrarModalCrearCliente(true);
    };

    const handleCerrarModalCrearCliente = () => {
        setMostrarModalCrearCliente(false);
    };

    const handleClienteCreado = () => {
        cargarClientes();
        toast.success('Cliente creado correctamente');
    };

    const handleEliminarClientes = () => {
        axios.delete('/api/clientes', { data: { ids: clientesSeleccionados } })
            .then(() => {
                setClientes(prev => prev.filter(cliente => !clientesSeleccionados.includes(cliente._id)));
                setClientesSeleccionados([]);
                toast.success('Clientes eliminados correctamente');
            })
            .catch(error => {
                toast.error('Error al eliminar los clientes');
            });
    };

    const handleCampoVisibleChange = (campo) => {
        setCamposVisibles(prev =>
            prev.includes(campo) ? prev.filter(c => c !== campo) : [...prev, campo]
        );
    };

    const handleSort = (campo) => {
        setOrden(prev => ({
            campo,
            direccion: prev.campo === campo ? (prev.direccion === 'asc' ? 'desc' : 'asc') : 'asc'
        }));
    };

    const applyAdvancedFilters = (clientes, filtros) => {
        if (!Array.isArray(clientes)) return []; // Asegurarse de que 'clientes' sea un array
        return clientes.filter(cliente =>
            Object.keys(filtros).every(key => {
                if (!filtros[key]) return true;
                return cliente[key] && cliente[key].toString().toLowerCase().startsWith(filtros[key].toLowerCase());
            })
        );
    };
    
    const sortClientes = (clientes) => {
        if (!Array.isArray(clientes)) return []; // Asegurarse de que 'clientes' sea un array
        if (!orden.campo || !orden.direccion) return clientes;
    
        return [...clientes].sort((a, b) => {
            if (a[orden.campo] < b[orden.campo]) return orden.direccion === 'asc' ? -1 : 1;
            if (a[orden.campo] > b[orden.campo]) return orden.direccion === 'asc' ? 1 : -1;
            return 0;
        });
    };
        const clientesFiltrados = applyAdvancedFilters(sortClientes(clientes), filtrosAvanzados);

    const handleFileUpload = () => {
        setMostrarPopupCSV(true);
    };

    const handleCSVConfirm = async (csvData) => {
        try {
            await axios.post('/api/clientes/import', { clientes: csvData });
            cargarClientes();
            toast.success('Clientes importados correctamente');
        } catch (error) {
            toast.error('Error al importar los clientes');
        }
    };

    const handleOpenCommandPopup = () => {
        setMostrarCommandPopup(true);
    };

    const handleCloseCommandPopup = () => {
        setMostrarCommandPopup(false);
    };

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const handleToggleComponentedesplegable = () => {
        setMostrarComponentedesplegable(prev => !prev);
    };

    const openChatModal = (chat) => {
        setSelectedChats(prev => (prev.find(c => c.id === chat.id) ? prev : [...prev, chat]));
    };

    const closeChatModal = (chatId) => {
        setSelectedChats(prev => prev.filter(chat => chat.id !== chatId));
    };

    const handleFilterChange = (filters) => {
        setFiltrosAvanzados(filters);
        setAppliedFilters(filters);
    };

    const removeFilter = (key) => {
        setFiltrosAvanzados(prev => ({ ...prev, [key]: '' }));
        setAppliedFilters(prev => ({ ...prev, [key]: '' }));
    };

    const renderAppliedFilters = () => {
        return (
            <div className="applied-filters">
                {Object.keys(appliedFilters).map(key => (
                    appliedFilters[key] && (
                        <div key={key} className="filter-tag">
                            {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${appliedFilters[key]}`}
                            <MdClose size={12} onClick={() => removeFilter(key)} />
                        </div>
                    )
                ))}
            </div>
        );
    };

    const handleDetailsClick = () => {
        setMostrarComponentedesplegable(true);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAgregarNota = () => {
        // Lógica para agregar una nota
        toast.info('Agregar Nota seleccionado');
        setAnchorEl(null);
    };

    const handlePlanEntrenamiento = () => {
        // Lógica para ver el plan de entrenamiento actual
        toast.info('Plan de Entrenamiento Actual seleccionado');
        setAnchorEl(null);
    };

    const handleAsignarObjetivos = () => {
        // Lógica para asignar objetivos
        toast.info('Asignar Objetivos seleccionado');
        setAnchorEl(null);
    };

    const handlePlanDieta = () => {
        // Lógica para ver el plan de dieta actual
        toast.info('Plan de Dieta Actual seleccionado');
        setAnchorEl(null);
    };

    const handleVerMensajes = () => {
        // Lógica para ver los mensajes
        toast.info('Ver Mensajes seleccionado');
        setAnchorEl(null);
    };

    const handleActualizarMetodoPago = () => {
        // Lógica para actualizar el método de pago
        toast.info('Actualizar Método de Pago seleccionado');
        setAnchorEl(null);
    };

    const handleVerBonos = () => {
        // Lógica para ver los bonos asociados
        toast.info('Ver Bonos Asociados seleccionado');
        setAnchorEl(null);
    };

    const handleVerEstadisticas = () => {
        // Lógica para ver estadísticas generadas
        toast.info('Ver Estadísticas seleccionado');
        setAnchorEl(null);
    };

    const handleExportarClientes = () => {
        // Lógica para exportar clientes
        toast.info('Exportar Clientes seleccionado');
        setAnchorEl(null);
    };

    return (
        <div className={`clientes-lista ${theme}`}>
            <ToastContainer />
            <div className="clientes-lista-header">
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                    {theme === 'light' ? <MdBrightness3 size={20} /> : <MdWbSunny size={20} />}
                    Cambiar a {theme === 'light' ? 'Tema Oscuro' : 'Tema Claro'}
                </button>
            </div>
            <ResizableBox
                className="resizable-componentedesplegable-wrapper"
                width="100%"
                height={mostrarComponentedesplegable ? 300 : 0}
                minConstraints={[100, 150]}
                maxConstraints={[Infinity, 600]}
                axis="y"
                resizeHandles={['s']}
                handle={<div className="resize-handle" />}
            >
                {mostrarComponentedesplegable && (
                    <Componentedesplegable
                        onClose={() => setMostrarComponentedesplegable(false)}
                        openChatModal={openChatModal}
                        theme={theme}
                    />
                )}
            </ResizableBox>
            <div className="clientes-lista-contenido">
                <h1 className="tituloClientes">¡Bienveaaaanido de nuevo!</h1>
                <p className="subtituloClientes">¡Aqsuí tienes una lista de tus clientes!</p>
                <div className="actions">
                    <input
                        type="text"
                        placeholder="Filtrar clientes"
                        value={filtro}
                        onChange={handleFiltroChange}
                        className={`filtro ${theme}`}
                    />
                    <ClientFilterDropdown onFilterChange={handleFilterChange} theme={theme} />
                    <button className={`cliente-action-btn ${theme}`} onClick={handleCrearCliente}>
                        <MdOpenInBrowser size={20} />
                        Crear Cliente
                    </button>
                    <div>
                        <button className={`cliente-action-btn ${theme}`} onClick={handleMenuClick}>
                            <MdExpandMore size={20} />
                            Más Acciones
                        </button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleEliminarClientes} disabled={clientesSeleccionados.length === 0}>
                                <MdDelete size={20} />
                                Eliminar Clientes Seleccionados
                            </MenuItem>
                            <MenuItem onClick={() => setMostrarModalCategorias(true)}>
                                <MdViewModule size={20} />
                                Seleccionar Categorías
                            </MenuItem>
                            <MenuItem onClick={() => setVistaCalendario(!vistaCalendario)}>
                                {vistaCalendario ? <MdViewList size={20} /> : <MdViewModule size={20} />}
                                {vistaCalendario ? 'Ver Tabla' : 'Ver Calendario'}
                            </MenuItem>
                            <MenuItem onClick={handleOpenCommandPopup}>
                                <MdOpenInBrowser size={20} />
                                Abrir Comandos
                            </MenuItem>
                            <MenuItem>
                                <label className={`importar-clientes-label ${theme}`}>
                                    <MdUpload size={20} />
                                    Importar Clientes
                                    <input type="file" accept=".csv" onClick={handleFileUpload} className="importar-clientes-input" />
                                </label>
                            </MenuItem>
                            <MenuItem onClick={handleAgregarNota} disabled={clientesSeleccionados.length !== 1}>
                                <MdNoteAdd size={20} />
                                Agregar Nota
                            </MenuItem>
                            <MenuItem onClick={handlePlanEntrenamiento} disabled={clientesSeleccionados.length !== 1}>
                                <MdFitnessCenter size={20} />
                                Plan de Entrenamiento Actual
                            </MenuItem>
                            <MenuItem onClick={handleAsignarObjetivos} disabled={clientesSeleccionados.length !== 1}>
                                <MdFlag size={20} />
                                Asignar Objetivos
                            </MenuItem>
                            <MenuItem onClick={handlePlanDieta} disabled={clientesSeleccionados.length !== 1}>
                                <MdRestaurant size={20} />
                                Plan de Dieta Actual
                            </MenuItem>
                            <MenuItem onClick={handleVerMensajes} disabled={clientesSeleccionados.length !== 1}>
                                <MdMessage size={20} />
                                Ver Mensajes
                            </MenuItem>
                            <MenuItem onClick={handleActualizarMetodoPago} disabled={clientesSeleccionados.length !== 1}>
                                <MdPayment size={20} />
                                Actualizar Método de Pago
                            </MenuItem>
                            <MenuItem onClick={handleVerBonos} disabled={clientesSeleccionados.length !== 1}>
                                <MdCardGiftcard size={20} />
                                Ver Bonos Asociados
                            </MenuItem>
                            <MenuItem onClick={handleVerEstadisticas} disabled={clientesSeleccionados.length !== 1}>
                                <MdBarChart size={20} />
                                Ver Estadísticas Generadas
                            </MenuItem>
                            <MenuItem onClick={handleExportarClientes}>
                                <MdFileDownload size={20} />
                                Exportar Clientes
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                {renderAppliedFilters()}
                <button className="fixed-button" onClick={handleDetailsClick}>Ver Detalles</button>
                {vistaCalendario ? (
                    <CalendarView clientes={clientesFiltrados} vista={vistaCalendarioTipo} theme={theme} />
                ) : (
                    <table className="clientes-table">
                        <thead className={theme === 'dark' ? 'dark' : ''}>
                            <tr>
                                <th></th>
                                {camposDisponibles.map(campo => camposVisibles.includes(campo.key) && (
                                    <th key={campo.key} onClick={() => handleSort(campo.key)}>
                                        {campo.label} {orden.campo === campo.key && (orden.direccion === 'asc' ? '▲' : 'desc' ? '▼' : '')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map((cliente) => (
                                <React.Fragment key={cliente._id}>
                                    <tr 
                                        onClick={() => handleClienteClick(cliente)}
                                        className={selectedCliente && selectedCliente._id === cliente._id ? 'selected-client' : ''}
                                    >
                                        <td>
                                            <input 
                                                type="checkbox" 
                                                checked={clientesSeleccionados.includes(cliente._id)}
                                                onChange={(e) => handleCheckboxChange(e, cliente)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </td>
                                        {camposVisibles.includes('nombre') && <td>{cliente.nombre}</td>}
                                        {camposVisibles.includes('apellido') && <td>{cliente.apellido}</td>}
                                        {camposVisibles.includes('estado') && <td>{cliente.estado}</td>}
                                        {camposVisibles.includes('telefono') && <td>{cliente.telefono}</td>}
                                        {camposVisibles.includes('email') && <td>{cliente.email}</td>}
                                        {camposVisibles.includes('tag') && <td>{cliente.tag}</td>}
                                        {camposVisibles.includes('tipoDePlan') && <td>{cliente.tipoDePlan}</td>}
                                        {camposVisibles.includes('ultimoCheckin') && <td>{cliente.ultimoCheckin}</td>}
                                        {camposVisibles.includes('clase') && <td>{cliente.clase ? cliente.clase.nombre : 'Sin clase asociada'}</td>}
                                        {camposVisibles.includes('porcentajeCumplimiento') && <td>{cliente.porcentajeCumplimiento}</td>}
                                        {camposVisibles.includes('alertas') && <td>{cliente.alertas}</td>}
                                    </tr>
                                    {selectedCliente && selectedCliente._id === cliente._id && (
                                        <tr className="cliente-detalle-row">
                                            <td colSpan={camposVisibles.length + 1}>
                                                <div className={`client-detail-wrapper ${theme}`}>
                                                    <ClienteDetalle cliente={selectedCliente} theme={theme} />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
                {mostrarModalCrearCliente && (
                    <CrearCliente
                        onClose={handleCerrarModalCrearCliente}
                        onClienteCreado={handleClienteCreado}
                        theme={theme}
                    />
                )}
                {mostrarModalCategorias && (
                    <SeleccionCategoriasModal
                        camposDisponibles={camposDisponibles}
                        camposVisibles={camposVisibles}
                        handleCampoVisibleChange={handleCampoVisibleChange}
                        onClose={() => setMostrarModalCategorias(false)}
                        theme={theme}
                    />
                )}
                {mostrarPopupCSV && (
                    <PopupClienteCSV
                        onClose={() => setMostrarPopupCSV(false)}
                        onConfirm={handleCSVConfirm}
                        theme={theme}
                    />
                )}
                {mostrarCommandPopup && (
                    <CommandPopup onClose={handleCloseCommandPopup} theme={theme} />
                )}
                {selectedChats.map(chat => (
                    <ChaterModalInterfaz
                        key={chat.id}
                        chat={chat}
                        onClose={() => closeChatModal(chat.id)}
                        theme={theme}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClientesLista;
