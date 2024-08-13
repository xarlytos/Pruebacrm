// src/components/Dietas/Comidacomponente.js

import React from 'react';
import { Icon } from 'react-icons-kit';
import { ic_delete_outline } from 'react-icons-kit/md/ic_delete_outline';
import styles from './Comidacomponente.module.css';

const Comidacomponente = ({ comida, onView, onEdit, onAddOptions, onDelete }) => {
  return (
    <div className={styles.comidaItem}>
      <h4>{comida.momento}</h4>
      <p>{comida.comida}</p>
      <div className={styles.macroInfo}>
        <span>{comida.kcal}kcal</span>
        <span>{comida.carb} g Carb</span>
        <span>{comida.protein} g Protein</span>
        <span>{comida.fat} g Fat</span>
      </div>
      <div className={styles.topButtons}>
        <button className={styles.viewButton} onClick={onView}>Ver</button>
        <button className={styles.deleteButton} onClick={onDelete}>
          <Icon icon={ic_delete_outline} size={20} />
        </button>
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.editButton} onClick={onEdit}>
          Editar
        </button>
        <button className={styles.addOptionsButton} onClick={onAddOptions}>
          Añadir Opciones
        </button>
      </div>
    </div>
  );
};

export default Comidacomponente;
