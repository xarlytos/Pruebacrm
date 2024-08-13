// src/components/Dietas/Calendariodieta.js

import React, { useState } from 'react';
import styles from './Calendariodieta.module.css'; // Importa los estilos

const Calendariodieta = ({ weeks, onSelectWeek }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);

  const handleWeekSelect = (index) => {
    setSelectedWeek(index);
    onSelectWeek(index);
  };

  return (
    <div className={styles.calendarContainer}>
      <h2 className="text-xl font-bold mb-2">Selecciona una Semana</h2>
      <div className={styles.weeksContainer}>
        {weeks.map((week, index) => (
          <button
            key={index}
            className={`${styles.weekButton} ${
              selectedWeek === index ? styles.selected : ''
            }`}
            onClick={() => handleWeekSelect(index)}
          >
            {week.nombre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendariodieta;
