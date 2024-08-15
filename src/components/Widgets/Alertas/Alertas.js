import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alertas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Alertas = ({ theme, setTheme }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/alertas`);
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []);

  if (alerts.length === 0) {
    return <div className={`Alertas-eco-widget-empty ${theme}`}>No hay alertas disponibles</div>;
  }

  return (
    <div className={`Alertas-eco-widget ${theme}`}>
      <h2 className={`Alertas-eco-title ${theme}`}>Alertas</h2>
      <ul className={`Alertas-eco-list ${theme}`}>
        {alerts.map((alerta) => (
          <li key={alerta._id} className={`Alertas-eco-item ${alerta.tipo} ${theme}`}>
            <strong className={`Alertas-eco-item-title ${theme}`}>{alerta.title}</strong>: 
            <span className={`Alertas-eco-item-message ${theme}`}>{alerta.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alertas;
