// src/components/Dietas/Modaldevisiondecomida.js

import React from 'react';
import styles from './Modaldevisiondecomida.module.css';

const Modaldevisiondecomida = ({ isOpen, onClose, comida }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{comida.momento}</h2>
        <p>{comida.comida}</p>
        <div className={styles.macroInfo}>
          <span>{comida.kcal}kcal</span>
          <span>{comida.carb} g Carb</span>
          <span>{comida.protein} g Protein</span>
          <span>{comida.fat} g Fat</span>
        </div>
        <button onClick={onClose} className={styles.closeButton}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modaldevisiondecomida;
