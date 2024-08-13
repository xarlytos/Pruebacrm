import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Listadedietas.module.css';
import axios from 'axios';
import Tablacomidas from './Tablacomidas'; // Importamos el componente Tablacomidas
import PopupDeComidas from './PopupDeComidas'; // Importamos el componente PopupDeComidas

const Listadedietas = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [dietas, setDietas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dieta, setDieta] = useState({
    nombre: '',
    cliente: '',
    fechaInicio: '',
    duracionSemanas: 1,
    objetivo: '',
    restricciones: '',
  });
  const [customObjetivo, setCustomObjetivo] = useState('');
  const [showDietas, setShowDietas] = useState(true); // Nuevo estado para alternar entre tablas
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Estado para controlar el popup
  const [comidaToEdit, setComidaToEdit] = useState(null);

  const objetivosPredefinidos = [
    'Pérdida de peso',
    'Ganancia muscular',
    'Mantenimiento de peso',
    'Mejora del rendimiento deportivo',
    'Mejora de la salud general',
    'Aumento de la energía',
    'Control de enfermedades',
    'Mejora de la digestión',
    'Reducción de la grasa corporal',
    'Detoxificación',
    'Aumento de la masa corporal',
    'Preparación para competencias',
    'Rehabilitación y recuperación',
    'Otro'
  ];
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

  useEffect(() => {
    const fetchDietas = async () => {
      try {
        const response = await axios.get('${API_BASE_URL}/api/dietas');
        setDietas(response.data);
      } catch (error) {
        console.error('Error fetching dietas:', error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get('${API_BASE_URL}/api/clientes');
        setClientes(response.data);
      } catch (error) {
        console.error('Error fetching clientes:', error);
      }
    };

    fetchDietas();
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDieta({
      ...dieta,
      [name]: value,
    });

    if (name === 'objetivo' && value !== 'Otro') {
      setCustomObjetivo('');
    }
  };

  const handleCustomObjetivoChange = (e) => {
    setCustomObjetivo(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const objetivoFinal = dieta.objetivo === 'Otro' ? customObjetivo : dieta.objetivo;
      const response = await axios.post('${API_BASE_URL}/api/dietas', { ...dieta, objetivo: objetivoFinal });
      setDietas([...dietas, response.data]);
      setDieta({
        nombre: '',
        cliente: '',
        fechaInicio: '',
        duracionSemanas: 1,
        objetivo: '',
        restricciones: '',
      });
      setCustomObjetivo('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating dieta:', error);
    }
  };

  const handleEditDieta = (dietaId) => {
    navigate(`/edit-dieta/${dietaId}`);
  };

  const handleDeleteDieta = async (dietaId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/dietas/${dietaId}`);
      setDietas(dietas.filter((dieta) => dieta._id !== dietaId));
    } catch (error) {
      console.error('Error deleting dieta:', error);
    }
  };

  const filteredDietas = dietas.filter((dieta) =>
    dieta.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPopup = (comida = null) => {
    setComidaToEdit(comida);
    setIsPopupOpen(true); // Abre el popup
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Cierra el popup
    setComidaToEdit(null);
  };

  const refreshComidas = async () => {
    // Lógica para refrescar la lista de comidas después de crear o editar una
  };

  return (
    <div className={`${styles.containerFull} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={`${styles.header} ${theme === 'dark' ? styles.dark : ''}`}>
        <h2>{showDietas ? 'Dietas' : 'Comidas'}</h2>
        <div className={styles.headerButtons}>
          <button
            className={`${styles.btnPrimary} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={() => {
              if (showDietas) {
                setShowForm(!showForm);
              } else {
                openPopup(); // Abrir el popup para crear una comida
              }
            }}
          >
            {showForm || isPopupOpen ? 'Cerrar Formulario' : `Crear ${showDietas ? 'Dieta' : 'Comida'}`}
          </button>
          <button
            className={`${styles.btnPrimary} ${theme === 'dark' ? styles.dark : ''}`}
            onClick={() => setShowDietas(!showDietas)} // Alternar entre tablas
          >
            {showDietas ? 'Mostrar Comidas' : 'Mostrar Dietas'}
          </button>
        </div>
      </div>
      {showDietas ? (
        <>
          {showForm && (
            <div className={styles.formContainer}>
              <h2>Crear Dieta</h2>
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={dieta.nombre}
                    onChange={handleChange}
                    className={theme === 'dark' ? styles.dark : ''}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Cliente</label>
                  <select
                    name="cliente"
                    value={dieta.cliente}
                    onChange={handleChange}
                    className={theme === 'dark' ? styles.dark : ''}
                    required
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente._id} value={cliente._id}>
                        {cliente.nombre} {cliente.apellido}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={dieta.fechaInicio}
                    onChange={handleChange}
                    className={theme === 'dark' ? styles.dark : ''}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Duración (semanas)</label>
                  <input
                    type="number"
                    name="duracionSemanas"
                    value={dieta.duracionSemanas}
                    onChange={handleChange}
                    className={theme === 'dark' ? styles.dark : ''}
                    min="1"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Objetivo</label>
                  <select
                    name="objetivo"
                    value={dieta.objetivo}
                    onChange={handleChange}
                    className={theme === 'dark' ? styles.dark : ''}
                    required
                  >
                    {objetivosPredefinidos.map((obj, index) => (
                      <option key={index} value={obj}>
                        {obj}
                      </option>
                    ))}
                  </select>
                </div>
                {dieta.objetivo === 'Otro' && (
                  <div className={styles.formGroup}>
                    <label>Objetivo Personalizado</label>
                    <input
                      type="text"
                      name="customObjetivo"
                      value={customObjetivo}
                      onChange={handleCustomObjetivoChange}
                      className={theme === 'dark' ? styles.dark : ''}
                      required
                    />
                  </div>
                )}
                <div className={styles.formGroup}>
                  <label>Restricciones Alimentarias</label>
                  <textarea
                    name="restricciones"
                    value={dieta.restricciones}
                    onChange={handleChange}
                    className={theme === 'dark' ? styles.dark : ''}
                  />
                </div>
                <button
                  type="submit"
                  className={`${styles.btnPrimary} ${theme === 'dark' ? styles.dark : ''}`}
                >
                  Crear Dieta
                </button>
              </form>
            </div>
          )}
          <input
            className={`${styles.searchInput} ${theme === 'dark' ? styles.dark : ''}`}
            type="text"
            placeholder="Buscar dietas"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.tableContainer}>
            <table className={`${styles.styledTable} ${theme === 'dark' ? styles.dark : ''}`}>
              <thead>
                <tr>
                  <th className={theme === 'dark' ? styles.dark : ''}>Nombre</th>
                  <th className={theme === 'dark' ? styles.dark : ''}>Cliente</th>
                  <th className={theme === 'dark' ? styles.dark : ''}>Fecha de Inicio</th>
                  <th className={theme === 'dark' ? styles.dark : ''}>Objetivo</th>
                  <th className={theme === 'dark' ? styles.dark : ''}>Restricciones</th>
                  <th className={theme === 'dark' ? styles.dark : ''}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDietas.map((dieta) => (
                  <tr key={dieta._id} className={theme === 'dark' ? styles.dark : ''}>
                    <td>{dieta.nombre}</td>
                    <td>{dieta.cliente}</td>
                    <td>{dieta.fechaInicio}</td>
                    <td>{dieta.objetivo}</td>
                    <td>{dieta.restricciones}</td>
                    <td className={styles.relative}>
                      <button
                        className={`${styles.btnAction} ${theme === 'dark' ? styles.dark : ''}`}
                        onClick={() => handleEditDieta(dieta._id)}
                      >
                        Editar
                      </button>
                      <button
                        className={`${styles.btnAction} ${theme === 'dark' ? styles.dark : ''}`}
                        onClick={() => handleDeleteDieta(dieta._id)}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <Tablacomidas theme={theme} />
          <PopupDeComidas
            theme={theme}
            isOpen={isPopupOpen}
            closeModal={closePopup}
            comidaToEdit={comidaToEdit}
            refreshComidas={refreshComidas}
          />
        </>
      )}
    </div>
  );
};

export default Listadedietas;
