import React, { useState } from 'react';
import axios from 'axios';
import './DetailedDocumento.css';
import WidgetLicenciasDuplicado from './Duplicados/WidgetLicenciasDuplicado';
import WidgetContratosDuplicado from './Duplicados/WidgetContratosDuplicado';
import WidgetDocumentosOtros from './widget-Documentos-otros';
import NavegadorDeGraficos from '../Componentepanelcontrol/NavegadorDeGraficos';
import WidgetAlertas from './widget-Alertas'; // Importamos el nuevo componente

const DetailedDocumento = ({ onTabChange, theme, setTheme }) => {
  const [isAlarmPopupOpen, setIsAlarmPopupOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    alertDate: '',
    displayDate: '',
    tipo: 'licencia', // Tipo se establece automáticamente como "licencia"
  });

  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

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

  const handleAlertChange = (e) => {
    setNewAlert({
      ...newAlert,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateAlert = async () => {
    try {
      const response = await axios.post('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas/', {
        status: 'pendiente',
        title: newAlert.title,
        message: newAlert.message,
        alertDate: newAlert.alertDate,
        displayDate: newAlert.displayDate,
        tipo: 'licencia', // Aseguramos que siempre sea "licencia"
      });

      setAlerts([...alerts, response.data]);
      setNewAlert({ title: '', message: '', alertDate: '', displayDate: '', tipo: 'licencia' });
      setIsAlarmPopupOpen(false);
    } catch (error) {
      console.error("Error al crear la alerta:", error);
    }
  };

  const licencias = [
    { id: 1, titulo: 'Licencia 1', fecha: '2023-01-01' },
    { id: 3, titulo: 'Licencia 2', fecha: '2023-01-03' },
    { id: 5, titulo: 'Licencia 3', fecha: '2023-01-05' },
  ];

  const filteredAlerts = alerts.filter(alert => {
    const alertDate = new Date(alert.displayDate);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    return (!startDate || alertDate >= startDate) && (!endDate || alertDate <= endDate);
  });

  const sortedLicencias = [...licencias].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className={`detailed-documento-modal ${theme}`}>
      <div className={`detailed-documento-content ${theme}`}>
        <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} setTheme={setTheme} />

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
        <div className="documentos-otros-section">
          <WidgetDocumentosOtros isEditMode={true} theme={theme} />
        </div>
        <div className="alertas-section"> {/* Sección para alertas */}
          <WidgetAlertas /> {/* Incluir el componente WidgetAlertas */}
        </div>

        {isAlarmPopupOpen && (
          <div className={`alarm-popup ${theme}`}>
            <button className={`close-alarm-popup-btn ${theme}`} onClick={handleCloseAlarmPopup}>x</button>
            <h3>Programar Nueva Alerta</h3>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Título"
                value={newAlert.title}
                onChange={handleAlertChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <input
                type="text"
                name="message"
                id="message"
                placeholder="Mensaje"
                value={newAlert.message}
                onChange={handleAlertChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="alertDate">Fecha de la Alerta</label>
              <input
                type="date"
                name="alertDate"
                id="alertDate"
                value={newAlert.alertDate}
                onChange={handleAlertChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="displayDate">Fecha de Visualización</label>
              <input
                type="date"
                name="displayDate"
                id="displayDate"
                value={newAlert.displayDate}
                onChange={handleAlertChange}
              />
            </div>
            <button className={`set-alarm-btn ${theme}`} onClick={handleCreateAlert}>
              Crear Alerta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedDocumento;
