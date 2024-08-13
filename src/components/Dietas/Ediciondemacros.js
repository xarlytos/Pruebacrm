// src/components/Dietas/Ediciondemacros.js
import React, { useState } from 'react';
import styles from './Ediciondemacros.module.css';

const Ediciondemacros = ({ isOpen, onClose, onSave, macros }) => {
  const [newMacros, setNewMacros] = useState(macros);
  const [kcal, setKcal] = useState(macros.kcal);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedMacros = { ...newMacros, [name]: parseInt(value, 10) };
    setNewMacros(updatedMacros);
  };

  const handleKcalChange = (e) => {
    const updatedKcal = parseInt(e.target.value, 10);
    setKcal(updatedKcal);
  };

  const handleSave = () => {
    onSave({ ...newMacros, kcal });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edita tus Macros</h2>
        <label>
          Carbs:
          <input
            type="number"
            name="carb"
            value={newMacros.carb}
            onChange={handleChange}
          />
        </label>
        <label>
          Protein:
          <input
            type="number"
            name="protein"
            value={newMacros.protein}
            onChange={handleChange}
          />
        </label>
        <label>
          Fat:
          <input
            type="number"
            name="fat"
            value={newMacros.fat}
            onChange={handleChange}
          />
        </label>
        <label>
          Kcal:
          <input
            type="number"
            value={kcal}
            onChange={handleKcalChange}
          />
        </label>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default Ediciondemacros;
