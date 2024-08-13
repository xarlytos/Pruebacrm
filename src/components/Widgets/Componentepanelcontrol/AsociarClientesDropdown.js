// AsociarClientesDropdown.js
import React, { useState, useEffect } from 'react';
import './AsociarClientesDropdown.css';

const AsociarClientesDropdown = ({ plan, clientes, clientesNoAsociados, onTrade }) => {
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [selectedClientesNoAsociados, setSelectedClientesNoAsociados] = useState([]);

  useEffect(() => {
    setSelectedClientes([]);
    setSelectedClientesNoAsociados([]);
  }, [plan]);

  const handleSelectCliente = (cliente, isAsociado) => {
    if (isAsociado) {
      if (selectedClientes.includes(cliente.id)) {
        setSelectedClientes(selectedClientes.filter(id => id !== cliente.id));
      } else {
        setSelectedClientes([...selectedClientes, cliente.id]);
      }
    } else {
      if (selectedClientesNoAsociados.includes(cliente.id)) {
        setSelectedClientesNoAsociados(selectedClientesNoAsociados.filter(id => id !== cliente.id));
      } else {
        setSelectedClientesNoAsociados([...selectedClientesNoAsociados, cliente.id]);
      }
    }
  };

  const handleTrade = () => {
    onTrade(selectedClientes, selectedClientesNoAsociados);
    setSelectedClientes([]);
    setSelectedClientesNoAsociados([]);
  };

  return (
    <div className="asociar-clientes-dropdown">
      <div className="asociar-clientes-left">
        <h3>Nombre del plan: {plan.nombre}</h3>
        <ul>
          {clientes.map(cliente => (
            <li
              key={cliente.id}
              className={selectedClientes.includes(cliente.id) ? 'selected' : ''}
              onClick={() => handleSelectCliente(cliente, true)}
            >
              {cliente.nombre}
            </li>
          ))}
        </ul>
      </div>
      <div className="asociar-clientes-trade">
        <button onClick={handleTrade}>Trade</button>
      </div>
      <div className="asociar-clientes-right">
        <h3>Clientes</h3>
        <ul>
          {clientesNoAsociados.map(cliente => (
            <li
              key={cliente.id}
              className={selectedClientesNoAsociados.includes(cliente.id) ? 'selected' : ''}
              onClick={() => handleSelectCliente(cliente, false)}
            >
              {cliente.nombre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AsociarClientesDropdown;
