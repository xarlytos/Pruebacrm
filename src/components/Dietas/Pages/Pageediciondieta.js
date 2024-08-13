import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Semanacomponente from '../Semanacomponente';
import Calendariodieta from '../Calendariodieta';
import axios from 'axios';
import mongoose from 'mongoose';
import styles from './Pageediciondieta.module.css';

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
    console.log("Dieta ID from URL:", dietaId);

    const fetchDieta = async () => {
      try {
        if (dietaId) {
          console.log("Fetching dieta with ID:", dietaId);
          const response = await axios.get(`/api/dietas/${dietaId}`);
          console.log("Dieta fetched from backend:", response.data);
          setDieta(response.data);
          setWeeks(response.data.semanas);
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
        _id: isValidObjectId(week._id) ? week._id : new mongoose.Types.ObjectId(),
        id: week.id,
        nombre: week.nombre,
        dias: week.dias.map(dia => ({
          _id: isValidObjectId(dia._id) ? dia._id : new mongoose.Types.ObjectId(),
          id: dia.id,
          nombre: dia.nombre,
          comidas: dia.comidas.map(comida => ({
            _id: isValidObjectId(comida._id) ? comida._id : new mongoose.Types.ObjectId(),
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

      console.log("Saving sanitized weeks data: ", sanitizedWeeks);

      const response = await axios.put(`/api/dietas/${dietaId}`, {
        ...dieta,
        semanas: sanitizedWeeks
      });

      console.log('Dieta saved:', response.data);
      navigate('/crear-dieta');
    } catch (error) {
      console.error('Error saving dieta:', error.response ? error.response.data : error.message);
    }
  };

  const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id)).toString() === id.toString();
  };

  return (
    <div className={`${styles.page} ${theme === 'dark' ? 'dark' : ''}`}>
      <h1>Editar Dieta</h1>
      <div className={styles.weeksContainer}>
        <Calendariodieta weeks={weeks} onSelectWeek={setSelectedWeek} />
      </div>
      {weeks.length > 0 && (
        <Semanacomponente selectedWeek={selectedWeek} weeksData={weeks} setWeeksData={setWeeks} />
      )}
      <button onClick={handleSaveDieta} className={styles.buttonSave}>
        Guardar Dieta
      </button>
    </div>
  );
};

export default Pageediciondieta;
