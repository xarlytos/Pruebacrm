// src/components/WidgetCuentaBancaria.js
import React from 'react';

function WidgetCuentaBancaria() {
  const handleViewCRM = () => {
    // Lógica para manejar la visualización del ingreso en el CRM
    console.log("Ver ingreso en CRM");
    // Aquí podrías redirigir a otra página, abrir un modal, etc.
  };

  const handleViewStripe = () => {
    // Lógica para manejar la visualización de la cuenta en Stripe
    console.log("Ver cuenta en Stripe");
    // Aquí podrías redirigir a otra página, abrir un modal, etc.
  };

  const handleViewBankAccount = () => {
    // Lógica para manejar la visualización de la cuenta bancaria
    console.log("Ver cuenta bancaria");
    // Aquí podrías redirigir a otra página, abrir un modal, etc.
  };

  return (
    <div className="widget widget-cuentabancaria">
      <div className="widget-handle"></div>
      <h2>Cuenta Bancaria</h2>
      <p>Contenido de la cuenta bancaria.</p>
      <div className="buttons-container">
        <button onClick={handleViewCRM} className="btn-view-crm">Ver Ingreso en CRM</button>
        <button onClick={handleViewStripe} className="btn-view-stripe">Ver Cuenta en Stripe</button>
        <button onClick={handleViewBankAccount} className="btn-view-bank">Ver Cuenta Bancaria</button>
      </div>
    </div>
  );
}

export default WidgetCuentaBancaria;
