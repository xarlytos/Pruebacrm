import React, { useState } from 'react';
import styles from './Calendariodieta.module.css'; // Importa los estilos

const Calendariodieta = ({ weeks, onSelectWeek, theme }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);

  const handleWeekSelect = (index) => {
    setSelectedWeek(index);
    onSelectWeek(index);
  };

  return (
    <div className={`${styles.calendarContainer} ${styles[theme]}`}>
      <h2>Selecciona una Semana</h2>
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
