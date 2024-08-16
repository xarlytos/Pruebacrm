import React, { useState, useEffect } from 'react';
import './WidgetCuentaBancaria.css'; // Asegúrate de importar los estilos

function WidgetCuentaBancaria({ beneficio }) {
  const [showBeneficio, setShowBeneficio] = useState(true); // Mostrar CRM por defecto
  const [activeView, setActiveView] = useState('CRM'); // Estado para rastrear la vista activa
  const [defaultView, setDefaultView] = useState(localStorage.getItem('defaultView') || 'CRM'); // Vista predefinida

  useEffect(() => {
    // Al cargar el componente, establecer la vista predefinida como la activa
    setActiveView(defaultView);
    if (defaultView === 'CRM') {
      setShowBeneficio(true);
    } else {
      setShowBeneficio(false);
    }
  }, [defaultView]);

  const handleViewCRM = () => {
    setShowBeneficio(true);
    setActiveView('CRM');
  };

  const handleViewStripe = () => {
    setShowBeneficio(false);
    setActiveView('Stripe');
  };

  const handleViewBankAccount = () => {
    setShowBeneficio(false);
    setActiveView('Bank');
  };

  const handleSaveDefaultView = () => {
    localStorage.setItem('defaultView', activeView);
    alert(`Vista predefinida guardada: ${activeView}`);
  };

  // Determinar la clase basada en el valor del beneficio
  const beneficioClass = beneficio >= 0 ? 'beneficio-info positivo' : 'beneficio-info negativo';

  return (
    <div className="widget-cuentabancaria">
      <div className="widget-handle"></div>
      <h2>Cuenta Bancaria</h2>
      <p>Contenido de la cuenta bancaria.</p>
      <div className="buttons-container">
        <button 
          onClick={handleViewCRM} 
          className={`btn-view-crm ${activeView === 'CRM' ? 'active' : ''}`}
        >
          Ver Ingreso en CRM
        </button>
        <button 
          onClick={handleViewStripe} 
          className={`btn-view-stripe ${activeView === 'Stripe' ? 'active' : ''}`}
        >
          Ver Cuenta en Stripe
        </button>
        <button 
          onClick={handleViewBankAccount} 
          className={`btn-view-bank ${activeView === 'Bank' ? 'active' : ''}`}
        >
          Ver Cuenta Bancaria
        </button>
        <button 
          onClick={handleSaveDefaultView} 
          className="btn-save-default"
        >
          Guardar Vista Predefinida
        </button>
      </div>
      {showBeneficio && (
        <p className={beneficioClass}>Beneficio Actual: ${beneficio.toFixed(2)}</p>
      )}
    </div>
  );
}

export default WidgetCuentaBancaria;
