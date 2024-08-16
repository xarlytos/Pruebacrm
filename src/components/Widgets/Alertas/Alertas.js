import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alertas.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Alertas = ({ theme, setTheme, onTabChange }) => {
  const [alerts, setAlerts] = useState([]);
  const [editingAlert, setEditingAlert] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMessage, setEditMessage] = useState('');

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

  const handleDeleteAlert = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/alertas/${id}`);
      setAlerts(alerts.filter(alerta => alerta._id !== id));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const handleEditAlert = (alerta) => {
    setEditingAlert(alerta);
    setEditTitle(alerta.title);
    setEditMessage(alerta.message);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedAlert = {
        title: editTitle,
        message: editMessage
      };
      await axios.put(`${API_BASE_URL}/api/alertas/${editingAlert._id}`, updatedAlert);
      setAlerts(alerts.map(alerta => (alerta._id === editingAlert._id ? { ...alerta, ...updatedAlert } : alerta)));
      setEditingAlert(null);
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingAlert(null);
  };

  const handleAlertClick = (title) => {
    if (title.includes('Licencia')) {
        onTabChange('Documentos');
    } else if (title.includes('Beneficio')) {
        onTabChange('Cashflow');
    } else if (title.includes('Pago')) {
        onTabChange('Planes');
    }
  };

  const getAlertClass = (alerta) => {
    if (alerta.title.includes('Pago Fallido')) {
      return 'pago-fallido';
    } else if (alerta.title.includes('Pago Correcto')) {
      return 'pago-correcto';
    } else if (alerta.tipo === 'licencia') {
      return 'licencia';
    } else if (alerta.tipo === 'beneficio') {
      return 'beneficio';
    } else {
      return '';
    }
  };

  if (alerts.length === 0) {
    return <div className={`Alertas-eco-widget-empty ${theme}`}>No hay alertas disponibles</div>;
  }

  return (
    <div className={`Alertas-eco-widget ${theme}`}>
      <h2 className={`Alertas-eco-title ${theme}`}>Alertas</h2>
      <ul className={`Alertas-eco-list ${theme}`}>
        {alerts.map((alerta) => (
          <li key={alerta._id} className={`Alertas-eco-item ${getAlertClass(alerta)} ${theme}`}>
            {editingAlert && editingAlert._id === alerta._id ? (
              <div className={`Alertas-eco-item-edit-form ${theme}`}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`Alertas-eco-item-edit-input ${theme}`}
                />
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className={`Alertas-eco-item-edit-textarea ${theme}`}
                />
                <button onClick={handleSaveEdit} className={`Alertas-eco-item-button ${theme}`}>Guardar</button>
                <button onClick={handleCancelEdit} className={`Alertas-eco-item-button ${theme}`}>Cancelar</button>
              </div>
            ) : (
              <>
                <strong className={`Alertas-eco-item-title ${theme}`}>{alerta.title}</strong>: 
                <span className={`Alertas-eco-item-message ${theme}`}>{alerta.message}</span>
                <button
                  className={`Alertas-eco-item-button ${theme}`}
                  onClick={() => handleAlertClick(alerta.title)}
                >
                  Ver más
                </button>
                <button
                  className={`Alertas-eco-item-button ${theme}`}
                  onClick={() => handleEditAlert(alerta)}
                >
                  Editar
                </button>
                <button
                  className={`Alertas-eco-item-button ${theme}`}
                  onClick={() => handleDeleteAlert(alerta._id)}
                >
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alertas;
