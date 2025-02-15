import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Semanacomponente from '../Semanacomponente';
import Calendariodieta from '../Calendariodieta';
import axios from 'axios';
import styles from './Pageediciondieta.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Pageediciondieta = ({ theme }) => {
  const { id: dietaId } = useParams();
  const navigate = useNavigate();
  
  const [dieta, setDieta] = useState({
    nombre: '',
    cliente: '',
    fechaInicio: '',
    duracionSemanas: 1,
    objetivo: '',
    restricciones: '',
    semanas: [],
  });
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const fetchDieta = async () => {
      try {
        if (dietaId) {
          const response = await axios.get(`${API_BASE_URL}/api/dietas/${dietaId}`);
          setDieta(response.data);
          setWeeks(response.data.semanas || []); // Asegura que `semanas` sea un array
        } else {
          console.error("No Dieta ID provided.");
        }
      } catch (error) {
        console.error('Error fetching dieta:', error);
      }
    };

    fetchDieta();
  }, [dietaId]);

  const handleSaveDieta = async () => {
    try {
      const sanitizedWeeks = weeks.map(week => ({
        _id: isValidObjectId(week._id) ? week._id : generateObjectId(),
        id: week.id,
        nombre: week.nombre,
        dias: week.dias.map(dia => ({
          _id: isValidObjectId(dia._id) ? dia._id : generateObjectId(),
          id: dia.id,
          nombre: dia.nombre,
          comidas: dia.comidas.map(comida => ({
            _id: isValidObjectId(comida._id) ? comida._id : generateObjectId(),
            nombreComida: comida.nombreComida,
            calorias: parseInt(comida.calorias, 10),
            macronutrientes: {
              proteinas: parseInt(comida.macronutrientes.proteinas, 10),
              carbohidratos: parseInt(comida.macronutrientes.carbohidratos, 10),
              grasas: parseInt(comida.macronutrientes.grasas, 10),
            }
          }))
        }))
      }));

      const response = await axios.put(`${API_BASE_URL}/api/dietas/${dietaId}`, {
        ...dieta,
        semanas: sanitizedWeeks
      });

      navigate('/crear-dieta');
    } catch (error) {
      console.error('Error saving dieta:', error.response ? error.response.data : error.message);
    }
  };

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const generateObjectId = () => {
    return Math.floor(Date.now() / 1000).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  };

  const handleSelectWeek = (index) => {
    setSelectedWeek(index);
  };

  return (
    <div className={`${styles.pageEdicionDieta} ${styles[theme]}`}>
      <h2>Editar Dieta</h2>
      
      <div className={`${styles.formContainer} ${styles[theme]}`}>
        <div className={styles.formGroup}>
          <label>Nombre de la Dieta:</label>
          <input 
            type="text" 
            value={dieta.nombre} 
            onChange={(e) => setDieta({ ...dieta, nombre: e.target.value })} 
            className={`${styles.input} ${styles[theme]}`}
          />
        </div>
    
        <div className={styles.formGroup}>
          <label>Cliente:</label>
          <input 
            type="text" 
            value={dieta.cliente} 
            onChange={(e) => setDieta({ ...dieta, cliente: e.target.value })} 
            className={`${styles.input} ${styles[theme]}`}
          />
        </div>
    
        <div className={styles.formGroup}>
          <label>Fecha de Inicio:</label>
          <input 
            type="date" 
            value={dieta.fechaInicio} 
            onChange={(e) => setDieta({ ...dieta, fechaInicio: e.target.value })} 
            className={`${styles.input} ${styles[theme]}`}
          />
        </div>
    
        <div className={styles.formGroup}>
          <label>Duración (semanas):</label>
          <input 
            type="number" 
            value={dieta.duracionSemanas} 
            onChange={(e) => setDieta({ ...dieta, duracionSemanas: e.target.value })} 
            className={`${styles.input} ${styles[theme]}`}
          />
        </div>
    
        <div className={styles.formGroup}>
          <label>Objetivo:</label>
          <input 
            type="text" 
            value={dieta.objetivo} 
            onChange={(e) => setDieta({ ...dieta, objetivo: e.target.value })} 
            className={`${styles.input} ${styles[theme]}`}
          />
        </div>
    
        <div className={styles.formGroup}>
          <label>Restricciones:</label>
          <input 
            type="text" 
            value={dieta.restricciones} 
            onChange={(e) => setDieta({ ...dieta, restricciones: e.target.value })} 
            className={`${styles.input} ${styles[theme]}`}
          />
        </div>
      </div>
      
      <div className={`${styles.weekContainer} ${styles[theme]}`}>
        <h3>Selecciona una Semana</h3>
        <div>
          <Calendariodieta weeks={weeks} onSelectWeek={handleSelectWeek} theme={theme} />
        </div>
        <Semanacomponente weeksData={weeks} setWeeksData={setWeeks} selectedWeek={selectedWeek} theme={theme} />
      </div>
  
      <button className={`${styles.saveButton} ${styles[theme]}`} onClick={handleSaveDieta}>Guardar Dieta</button>
    </div>
  );
};

export default Pageediciondieta;
