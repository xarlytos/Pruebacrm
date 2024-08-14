import React, { useState, useEffect } from 'react';
import './DetailedPlanes.css';
import BonosDuplicado from './BonosDuplicado';
import TablaClientesDuplicado from './TablaClientesDuplicado';
import TablaPlanesDuplicado from './TablaPlanesDuplicado';
import MetricCardDuplicado from './MetricCardDuplicado';
import NavegadorDeGraficos from './NavegadorDeGraficos';

const DetailedPlanes = ({ onTabChange, theme, setTheme }) => {
  const [clientes, setClientes] = useState([]);
  const [planesFijos, setPlanesFijos] = useState([]);
  const [planesVariables, setPlanesVariables] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/clientes/');
        const result = await response.json();
        setClientes(result);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    const fetchPlanesFijos = async () => {
      try {
        const response = await fetch('http://localhost:5005/plans/fixed/');
        const result = await response.json();
        setPlanesFijos(result);
      } catch (error) {
        console.error('Error al obtener los planes fijos:', error);
      }
    };

    const fetchPlanesVariables = async () => {
      try {
        const response = await fetch('http://localhost:5005/plans/variable/');
        const result = await response.json();
        setPlanesVariables(result);
      } catch (error) {
        console.error('Error al obtener los planes variables:', error);
      }
    };

    fetchClientes();
    fetchPlanesFijos();
    fetchPlanesVariables();
  }, []);

  // Combinar planes fijos y variables
  const totalPlanes = [...planesFijos, ...planesVariables];

  // Total de suscripciones es igual al total de planes
  const totalSuscripciones = totalPlanes.length;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`detailed-planes-overlay ${theme}`}>
      <div className={`detailed-planes ${theme}`}>
        <button className="close-modal-btn" onClick={() => onTabChange('Panel de Control')}>Cerrar</button>
        <button onClick={toggleTheme} className="theme-toggle-btn">Cambiar Tema</button>
        <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} />
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
