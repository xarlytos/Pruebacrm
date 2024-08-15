// src/components/DetailedFactura.js

import React from 'react';
import './DetailedFactura.css';
import WidgetFacturasDuplicado from './Duplicados/WidgetFacturasDuplicado.js';
import NavegadorDeGraficos from '../Componentepanelcontrol/NavegadorDeGraficos';

const DetailedFactura = ({ onTabChange, theme, setTheme }) => {

  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className={`detailed-factura-modal ${theme}`}>
      <div className={`detailed-factura-content ${theme}`}>
        <NavegadorDeGraficos onTabChange={handleTabChange} theme={theme} setTheme={setTheme} />
        <WidgetFacturasDuplicado
          onTabChange={handleTabChange}  // Pasar la función handleTabChange como prop
          theme={theme}
        />
      </div>
    </div>
  );
};

export default DetailedFactura;
