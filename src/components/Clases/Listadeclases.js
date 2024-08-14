import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import styles from './Listadeclases.module.css';
import ClientesLista from './ClientesLista';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Listadeclases = ({ theme }) => {
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState(null);
  const [mostrarModalClientes, setMostrarModalClientes] = useState(false);
  const [mostrarFormularioCrearClase, setMostrarFormularioCrearClase] = useState(false);
  const [mostrarFormularioEditarClase, setMostrarFormularioEditarClase] = useState(false);
  const [mostrarFormularioCrearSesion, setMostrarFormularioCrearSesion] = useState(false);
  const [nuevaClase, setNuevaClase] = useState({ nombre: '', tipo: 'Única', descripcion: '' });
  const [claseEditando, setClaseEditando] = useState(null);
  const [nuevaSesion, setNuevaSesion] = useState({ fecha: '', duracion: '', precio: '' });
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchClases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clases`);
      setClases(response.data);
    } catch (error) {
      console.error('Error fetching clases:', error);
    }
  };

  const handleAsociarClientes = (clase) => {
    setSelectedClase(clase);
    setMostrarModalClientes(true);
  };

  const handleClientesSeleccionados = async (clientesSeleccionados) => {
    try {
      const updatedClase = { ...selectedClase, clientes: clientesSeleccionados };
      const response = await axios.put(`${API_BASE_URL}/api/clases/${selectedClase._id}`, updatedClase);
      await Promise.all(clientesSeleccionados.map(clienteId =>
        axios.put(`${API_BASE_URL}/api/clientes/${clienteId}/clase/${selectedClase._id}`)
      ));
      setClases(clases.map(clase =>
        clase._id === selectedClase._id ? response.data : clase
      ));
      setMostrarModalClientes(false);
    } catch (error) {
      console.error('Error updating clients:', error);
    }
  };

  const handleBorrarCliente = async (claseId, clienteId) => {
    try {
      const clase = clases.find(c => c._id === claseId);
      const updatedClientes = clase.clientes.filter(cliente => cliente._id !== clienteId);
      const updatedClase = { ...clase, clientes: updatedClientes };
      const response = await axios.put(`${API_BASE_URL}/api/clases/${claseId}`, updatedClase);
      setClases(clases.map(c =>
        c._id === claseId ? response.data : c
      ));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleBorrarClase = async (clase) => {
    if (window.confirm(`¿Estás seguro de que deseas borrar la clase "${clase.nombre}"?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/clases/${clase._id}`);
        setClases(clases.filter(c => c._id !== clase._id));
      } catch (error) {
        console.error('Error deleting clase:', error);
      }
    }
  };

  const handleAbrirFormularioCrearClase = () => {
    setMostrarFormularioCrearClase(true);
  };

  const handleCerrarFormularioCrearClase = () => {
    setMostrarFormularioCrearClase(false);
    setNuevaClase({ nombre: '', tipo: 'Única', descripcion: '' });
  };

  const handleCrearClase = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clases`, { ...nuevaClase, clientes: [], sesiones: [] });
      setClases([...clases, response.data]);
      handleCerrarFormularioCrearClase();
    } catch (error) {
      console.error('Error creating clase:', error);
    }
  };

  const handleAbrirFormularioEditarClase = (clase) => {
    setClaseEditando({ ...clase });
    setMostrarFormularioEditarClase(true);
  };

  const handleCerrarFormularioEditarClase = () => {
    setMostrarFormularioEditarClase(false);
    setClaseEditando(null);
  };

  const handleEditarClase = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/clases/${claseEditando._id}`, claseEditando);
      setClases(clases.map(clase =>
        clase._id === claseEditando._id ? response.data : clase
      ));
      handleCerrarFormularioEditarClase();
    } catch (error) {
      console.error('Error updating clase:', error);
    }
  };

  const handleAbrirFormularioCrearSesion = (clase) => {
    setClaseEditando({ ...clase });
    setMostrarFormularioCrearSesion(true);
  };

  const handleCerrarFormularioCrearSesion = () => {
    setMostrarFormularioCrearSesion(false);
    setNuevaSesion({ fecha: '', duracion: '', precio: '' });
  };

  const handleCrearSesion = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/clases/${claseEditando._id}/sesiones`, { ...nuevaSesion, fecha: new Date(nuevaSesion.fecha) });
      setClases(clases.map(clase =>
        clase._id === claseEditando._id ? response.data : clase
      ));
      handleCerrarFormularioCrearSesion();
    } catch (error) {
      console.error('Error creating sesion:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (mostrarFormularioCrearClase) {
      setNuevaClase({ ...nuevaClase, [name]: value });
    } else if (mostrarFormularioEditarClase) {
      setClaseEditando({ ...claseEditando, [name]: value });
    } else if (mostrarFormularioCrearSesion) {
      setNuevaSesion({ ...nuevaSesion, [name]: value });
    }
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  const clasesFiltradas = clases.filter(clase =>
    clase.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className={`${styles.listadeclasesContainer} ${theme}`}>
      <h1 className={`${styles.header} ${theme}`}>Lista de Clases</h1>
      <button
        className={`${styles.crearClaseBtn} ${theme}`}
        onClick={handleAbrirFormularioCrearClase}
      >
        Crear Clase
      </button>
      <input
        type="text"
        placeholder="Buscar clases"
        className={`${styles.buscarClaseInput} ${theme}`}
        value={busqueda}
        onChange={handleBusquedaChange}
      />
      {mostrarFormularioCrearClase && (
        <div className={styles.formularioCrearClase}>
          <h2 className={`${styles.header} ${theme}`}>Crear Nueva Clase</h2>
          <label>
            Nombre:
            <input type="text" name="nombre" value={nuevaClase.nombre} onChange={handleChange} />
          </label>
          <label>
            Tipo:
            <select name="tipo" value={nuevaClase.tipo} onChange={handleChange}>
              <option value="Única">Única</option>
              <option value="Repetible">Repetible</option>
            </select>
          </label>
          <label>
            Descripción:
            <textarea name="descripcion" value={nuevaClase.descripcion} onChange={handleChange} />
          </label>
          <button onClick={handleCrearClase}>Aceptar</button>
          <button onClick={handleCerrarFormularioCrearClase}>Cerrar</button>
        </div>
      )}
      {mostrarFormularioEditarClase && (
        <div className={styles.formularioCrearClase}>
          <h2 className={`${styles.header} ${theme}`}>Editar Clase</h2>
          <label>
            Nombre:
            <input type="text" name="nombre" value={claseEditando.nombre} onChange={handleChange} />
          </label>
          <label>
            Tipo:
            <select name="tipo" value={claseEditando.tipo} onChange={handleChange}>
              <option value="Única">Única</option>
              <option value="Repetible">Repetible</option>
            </select>
          </label>
          <label>
            Descripción:
            <textarea name="descripcion" value={claseEditando.descripcion} onChange={handleChange} />
          </label>
          <button
            className={`${styles.editarBtn} ${theme}`}
            onClick={handleEditarClase}
          >
            Guardar
          </button>
          <button onClick={handleCerrarFormularioEditarClase}>Cerrar</button>
        </div>
      )}
      {mostrarFormularioCrearSesion && (
        <div className={styles.formularioCrearClase}>
          <h2 className={`${styles.header} ${theme}`}>Crear Nueva Sesión</h2>
          <label>
            Fecha:
            <input type="datetime-local" name="fecha" value={nuevaSesion.fecha} onChange={handleChange} />
          </label>
          <label>
            Duración (minutos):
            <input type="number" name="duracion" value={nuevaSesion.duracion} onChange={handleChange} />
          </label>
          <label>
            Precio:
            <input type="number" name="precio" value={nuevaSesion.precio} onChange={handleChange} />
          </label>
          <button
            className={`${styles.crearSesionBtn} ${theme}`}
            onClick={handleCrearSesion}
          >
            Aceptar
          </button>
          <button onClick={handleCerrarFormularioCrearSesion}>Cerrar</button>
        </div>
      )}
      <table className={styles.clasesTable}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Clientes</th>
            <th>Sesiones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clasesFiltradas.map((clase) => (
            <tr key={clase._id}>
              <td>{clase.nombre}</td>
              <td>{clase.tipo}</td>
              <td>{clase.descripcion}</td>
              <td>
                <button
                  className={`${styles.asociarClientesBtn} ${theme}`}
                  onClick={() => handleAsociarClientes(clase)}
                >
                  Asociar Clientes
                </button>
                <ul className={styles.clientesList}>
                  {clase.clientes.map(cliente => (
                    <li key={cliente._id}>
                      {cliente.nombre} {cliente.apellido}
                      <Icon
                        icon={ic_delete_outline}
                        size={20}
                        className={styles.deleteIcon}
                        onClick={() => handleBorrarCliente(clase._id, cliente._id)}
                      />
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className={styles.sesionesList}>
                  {clase.sesiones.map(sesion => (
                    <li key={sesion._id}>
                      Fecha: {new Date(sesion.fecha).toLocaleString()}<br />
                      Duración: {sesion.duracion} minutos<br />
                      Precio: ${sesion.precio}<br />
                      Dinero de esta sesión: ${sesion.precio * clase.clientes.length}
                      <Icon
                        icon={ic_delete_outline}
                        size={20}
                        className={styles.deleteIcon}
                        onClick={async () => {
                          try {
                            await axios.delete(`/api/clases/${clase._id}/sesiones/${sesion._id}`);
                            setClases(clases.map(c =>
                              c._id === clase._id ? { ...c, sesiones: c.sesiones.filter(s => s._id !== sesion._id) } : c
                            ));
                          } catch (error) {
                            console.error('Error deleting sesion:', error);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className={`${styles.crearSesionBtn} ${theme}`}
                  onClick={() => handleAbrirFormularioCrearSesion(clase)}
                >
                  Añadir Sesión
                </button>
              </td>
              <td>
                <button
                  className={`${styles.editarBtn} ${theme}`}
                  onClick={() => handleAbrirFormularioEditarClase(clase)}
                >
                  Editar
                </button>
                <Icon
                  icon={ic_delete_outline}
                  size={20}
                  className={styles.deleteIcon}
                  onClick={() => handleBorrarClase(clase)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {mostrarModalClientes && (
        <ClientesLista
          onClientesSeleccionados={handleClientesSeleccionados}
          clientesSeleccionados={selectedClase ? selectedClase.clientes : []}
          onClose={() => setMostrarModalClientes(false)}
        />
      )}
    </div>
  );
};

export default Listadeclases;
