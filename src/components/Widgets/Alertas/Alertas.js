import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alertas.css'; // Asegúrate de crear este archivo CSS para los estilos del widget

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Alertas = ({ theme, setTheme }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/alerts`);
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  if (alerts.length === 0) {
    return <div className="alertas-widget empty">No hay alertas disponibles</div>;
  }

  return (

    <div className={`alertas-widget ${theme}`}>
      <h2>Alertas</h2>
      <ul>
        {alerts.map((alerta) => (
          <li key={alerta.id} className={`alerta-item ${alerta.tipo}`}>
            <strong>{alerta.titulo}</strong>: {alerta.mensaje}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alertas;
