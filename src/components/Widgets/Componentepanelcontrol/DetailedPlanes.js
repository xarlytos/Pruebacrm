// C:\Users\usuario\Downloads\crmworkspaceEspacial\crm-frontend\src\components\Widgets\Componentepanelcontrol\DetailedPlanes.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DetailedPlanes.css';
import BonosDuplicado from './BonosDuplicado';
import TablaClientesDuplicado from './TablaClientesDuplicado';
import TablaPlanesDuplicado from './TablaPlanesDuplicado';
import MetricCardDuplicado from './MetricCardDuplicado';
import NavegadorDeGraficos from './NavegadorDeGraficos';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const DetailedPlanes = ({ onTabChange, theme, setTheme }) => {
  const [clientes, setClientes] = useState([]);
  const [planesFijos, setPlanesFijos] = useState([]);
  const [planesVariables, setPlanesVariables] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/clientes/`);
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    const fetchPlanesFijos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plans/fixed/`);
        setPlanesFijos(response.data);
      } catch (error) {
        console.error('Error al obtener los planes fijos:', error);
      }
    };

    const fetchPlanesVariables = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/plans/variable/`);
        setPlanesVariables(response.data);
      } catch (error) {
        console.error('Error al obtener los planes variables:', error);
      }
    };

    fetchClientes();
    fetchPlanesFijos();
    fetchPlanesVariables();
  }, []);

  const totalPlanes = [...planesFijos, ...planesVariables];
  const totalSuscripciones = totalPlanes.length;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleEconomiaTabClick = () => {
    onTabChange('Panel de Control');
  };

  return (
    <div className={`detailed-planes-overlay ${theme}`}>
      <div className={`detailed-planes ${theme}`}>
        <button className="close-modal-btn" onClick={() => onTabChange('Panel de Control')}>Cerrar</button>
        <button onClick={toggleTheme} className="theme-toggle-btn">Cambiar Tema</button>
        <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} />
        
        {/* Nuevo botón que cambia la pestaña a 'Economia' */}
        <button 
          className="redirect-btn" 
          onClick={handleEconomiaTabClick}
          style={{ 
            backgroundColor: 'red', 
            color: 'white', 
            float: 'right', 
            margin: '10px 0'
          }} 
        >
          Ir a la página de Economía
        </button>

        <div className="detailed-planes-content">
          <div className={`detailed-metrics-grid ${theme}`}>
            <div className="metrics-column">
              <MetricCardDuplicado
                title="Clientes Actuales"
                value={`+${clientes.length}`}
                description="+201 desde la última hora"
                icon="📈"
                valueClass="popup-metric-value-green"
                theme={theme}
              />
            </div>
            <div className="metrics-column">
              <MetricCardDuplicado
                title="Planes Vendidos"
                value={`+${totalPlanes.length}`}
                description="+19% respecto al mes pasado"
                icon="📄"
                valueClass="popup-metric-value-green"
                theme={theme}
              />
            </div>
            <div className="metrics-column">
              <MetricCardDuplicado
                title="Suscripciones"
                value={`+${totalSuscripciones}`}
                description="+180.1% respecto al mes pasado"
                icon="👥"
                valueClass="popup-metric-value-green"
                theme={theme}
              />
            </div>
          </div>
          <BonosDuplicado theme={theme} />
          <TablaPlanesDuplicado theme={theme} />
          <TablaClientesDuplicado theme={theme} />
        </div>
      </div>
    </div>
  );
};

export default DetailedPlanes;
