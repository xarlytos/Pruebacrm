import React, { useState } from 'react';
import './WidgetCuentaBancaria.css'; // Asegúrate de importar los estilos

function WidgetCuentaBancaria({ beneficio }) {
  const [showBeneficio, setShowBeneficio] = useState(false);

  const handleViewCRM = () => {
    console.log("Toggle beneficio view");
    setShowBeneficio(prevState => !prevState); // Alternar la visualización
  };

  const handleViewStripe = () => {
    console.log("Ver cuenta en Stripe");
  };

  const handleViewBankAccount = () => {
    console.log("Ver cuenta bancaria");
  };

  // Determinar la clase basada en el valor del beneficio
  const beneficioClass = beneficio >= 0 ? 'beneficio-info positivo' : 'beneficio-info negativo';

  return (
    <div className="widget-cuentabancaria">
      <div className="widget-handle"></div>
      <h2>Cuenta Bancaria</h2>
      <p>Contenido de la cuenta bancaria.</p>
      <div className="buttons-container">
        <button onClick={handleViewCRM} className="btn-view-crm">Ver Ingreso en CRM</button>
        <button onClick={handleViewStripe} className="btn-view-stripe">Ver Cuenta en Stripe</button>
        <button onClick={handleViewBankAccount} className="btn-view-bank">Ver Cuenta Bancaria</button>
      </div>
      {showBeneficio && ( 
        <p className={beneficioClass}>Beneficio Actual: ${beneficio.toFixed(2)}</p>
      )}
    </div>
  );
}

export default WidgetCuentaBancaria;
