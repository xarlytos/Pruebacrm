import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';  // Importa uuid para generar IDs únicos
import styles from './Modalcreacioncomida.module.css';

const Modalcreacioncomida = ({ isOpen, onClose, onSave, initialData }) => {
  const [momento, setMomento] = useState('desayuno');
  const [comida, setComida] = useState('');
  const [calorias, setCalorias] = useState('');
  const [macronutrientes, setMacronutrientes] = useState({
    proteinas: '',
    carbohidratos: '',
    grasas: '',
  });

  useEffect(() => {
    if (initialData) {
      setMomento(initialData.momento);
      setComida(initialData.comida || '');
      setCalorias(initialData.calorias || '');
      setMacronutrientes(initialData.macronutrientes || {
        proteinas: '',
        carbohidratos: '',
        grasas: '',
      });
    }
  }, [initialData]);

  const handleSave = () => {
    const newComida = {
      nombreComida: comida,
      calorias,
      macronutrientes,
      momento,
    };

    // Añadir un _id si no existe ya
    if (!initialData?._id) {
      newComida._id = uuidv4();  // Genera un ID único
    }

    if (comida.trim() !== '') {
      onSave(newComida);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{initialData ? 'Editar Comida' : 'Agregar Nueva Comida'}</h2>
        <div className={styles.formGroup}>
          <label>Momento de la comida</label>
          <select value={momento} onChange={(e) => setMomento(e.target.value)}>
            <option value="desayuno">Desayuno</option>
            <option value="almuerzo">Almuerzo</option>
            <option value="comida">Comida</option>
            <option value="merienda">Merienda</option>
            <option value="cena">Cena</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Comida</label>
          <input 
            type="text" 
            value={comida} 
            onChange={(e) => setComida(e.target.value)} 
          />
        </div>
        <div className={styles.formGroup}>
          <label>Calorías</label>
          <input 
            type="number" 
            value={calorias} 
            onChange={(e) => setCalorias(e.target.value)} 
          />
        </div>
        <div className={styles.formGroup}>
          <label>Proteínas</label>
          <input 
            type="number" 
            value={macronutrientes.proteinas} 
            onChange={(e) => setMacronutrientes({...macronutrientes, proteinas: e.target.value})} 
          />
        </div>
        <div className={styles.formGroup}>
          <label>Carbohidratos</label>
          <input 
            type="number" 
            value={macronutrientes.carbohidratos} 
            onChange={(e) => setMacronutrientes({...macronutrientes, carbohidratos: e.target.value})} 
          />
        </div>
        <div className={styles.formGroup}>
          <label>Grasas</label>
          <input 
            type="number" 
            value={macronutrientes.grasas} 
            onChange={(e) => setMacronutrientes({...macronutrientes, grasas: e.target.value})} 
          />
        </div>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modalcreacioncomida;
