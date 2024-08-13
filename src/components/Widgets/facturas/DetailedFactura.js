import React from 'react';
import './DetailedFactura.css';
import WidgetFacturasDuplicado from './Duplicados/WidgetFacturasDuplicado.js';
import NavegadorDeGraficos from '../Componentepanelcontrol/NavegadorDeGraficos';

const DetailedFactura = ({ onTabChange, theme, setTheme }) => {
  return (
    <div className={`detailed-factura-modal ${theme}`}>
      <div className={`detailed-factura-content ${theme}`}>
        <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} setTheme={setTheme} />
        <WidgetFacturasDuplicado theme={theme} />
      </div>
    </div>
  );
};

export default DetailedFactura;
