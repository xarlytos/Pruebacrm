import React, { useState } from 'react';
import './WidgetCuentaBancaria.css'; // Asegúrate de importar los estilos

function WidgetCuentaBancaria({ beneficio }) {
  const [showBeneficio, setShowBeneficio] = useState(true); // Mostrar CRM por defecto
  const [activeView, setActiveView] = useState('CRM'); // Estado para rastrear la vista activa

  const handleViewCRM = () => {
    console.log("Toggle beneficio view");
    setShowBeneficio(true);
    setActiveView('CRM'); // Establecer la vista CRM como activa
  };

  const handleViewStripe = () => {
    console.log("Ver cuenta en Stripe");
    setShowBeneficio(false);
    setActiveView('Stripe'); // Establecer la vista Stripe como activa
  };

  const handleViewBankAccount = () => {
    console.log("Ver cuenta bancaria");
    setShowBeneficio(false);
    setActiveView('Bank'); // Establecer la vista Cuenta Bancaria como activa
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
      </div>
      {showBeneficio && ( 
        <p className={beneficioClass}>Beneficio Actual: ${beneficio.toFixed(2)}</p>
      )}
    </div>
  );
}

export default WidgetCuentaBancaria;
