// src/components/DetailedDocumento.js

import React, { useState } from 'react';
import './DetailedDocumento.css';
import WidgetLicenciasDuplicado from './Duplicados/WidgetLicenciasDuplicado';
import WidgetContratosDuplicado from './Duplicados/WidgetContratosDuplicado';
import NavegadorDeGraficos from '../Componentepanelcontrol/NavegadorDeGraficos';

const DetailedDocumento = ({ onTabChange, theme, setTheme }) => {
  const [isAlarmPopupOpen, setIsAlarmPopupOpen] = useState(false);

  const handleOpenAlarmPopup = () => {
    setIsAlarmPopupOpen(true);
  };

  const handleCloseAlarmPopup = () => {
    setIsAlarmPopupOpen(false);
  };

  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const licencias = [
    { id: 1, titulo: 'Licencia 1', fecha: '2023-01-01' },
    { id: 3, titulo: 'Licencia 2', fecha: '2023-01-03' },
    { id: 5, titulo: 'Licencia 3', fecha: '2023-01-05' },
  ];

  const sortedLicencias = [...licencias].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className={`detailed-documento-modal ${theme}`}>
      <div className={`detailed-documento-content ${theme}`}>
        <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} setTheme={setTheme} />

        {/* Contenedor para alinear los botones con posiciones invertidas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
          <button className={`program-alarm-btn ${theme}`} onClick={handleOpenAlarmPopup}>
            Programar Alarma
          </button>
          <button
            onClick={() => handleTabChange('Panel de Control')}
            style={{
              backgroundColor: '#FF0000',
              color: '#FFFFFF',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ir a la página de Economía
          </button>
        </div>

        <div className="licencias-section">
          <WidgetLicenciasDuplicado isEditMode={true} theme={theme} />
        </div>
        <div className="contratos-section">
          <WidgetContratosDuplicado isEditMode={true} theme={theme} />
        </div>
        {isAlarmPopupOpen && (
          <div className={`alarm-popup ${theme}`}>
            <button className={`close-alarm-popup-btn ${theme}`} onClick={handleCloseAlarmPopup}>x</button>
            <h3>Licencias Activas</h3>
            <ul>
              {sortedLicencias.map(doc => (
                <li key={doc.id}>
                  {doc.titulo} - {doc.fecha}
                  <button className={`set-alarm-btn ${theme}`}>Alarma</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedDocumento;
