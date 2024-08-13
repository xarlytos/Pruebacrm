import React from 'react';
import './DetailedPlanes.css';
import BonosDuplicado from './BonosDuplicado';
import TablaClientesDuplicado from './TablaClientesDuplicado';
import TablaPlanesDuplicado from './TablaPlanesDuplicado';
import MetricCardDuplicado from './MetricCardDuplicado';
import NavegadorDeGraficos from './NavegadorDeGraficos';

const DetailedPlanes = ({ onTabChange, theme, setTheme }) => {
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
                value="+573"
                description="+201 desde la última hora"
                icon="📈"
                valueClass="popup-metric-value-green"
                theme={theme}
              />
            </div>
            <div className="metrics-column">
              <MetricCardDuplicado
                title="Planes Vendidos"
                value="+12,234"
                description="+19% respecto al mes pasado"
                icon="📄"
                valueClass="popup-metric-value-green"
                theme={theme}
              />
            </div>
            <div className="metrics-column">
              <MetricCardDuplicado
                title="Suscripciones"
                value="+2350"
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
