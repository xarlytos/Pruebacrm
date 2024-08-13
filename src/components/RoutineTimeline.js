// src/components/RoutineTimeline.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoutineTimeline.css'; // Importar los estilos CSS

const RoutineTimeline = () => {
  const [routineDays, setRoutineDays] = useState([]);

  useEffect(() => {
    const fetchRoutineDays = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/routineDays');
        setRoutineDays(response.data);
      } catch (error) {
        console.error('Error fetching routine days:', error);
      }
    };

    fetchRoutineDays();
  }, []);

  const renderBars = () => {
    return routineDays.map((day, index) => (
      <div key={index} className={`timeline-bar ${day.intensidad.toLowerCase()}`}>
        <div className="timeline-bar-date">
          {new Date(day.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).toUpperCase()}
        </div>
        <div className="timeline-bar-content">
          <div className="timeline-bar-name">{day.nombre}</div>
          <div className="timeline-bar-intensity">Intensidad: {day.intensidad}</div>
        </div>
      </div>
    ));
  };

  return (
    <div className="timeline-container">
      <h2>Calendario de Rutinas</h2>
      <div className="timeline">
        {renderBars()}
      </div>
    </div>
  );
};

export default RoutineTimeline;
