// Bonos.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VenderBonoPopup from './VenderBonoPopup';
import BonosTrade from './BonosTrade';
import './Bonos.css';

const Bonos = () => {
  const [bonos, setBonos] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [selectedBono, setSelectedBono] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/bonos')
      .then(response => {
        setBonos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos de los bonos:', error);
      });
  }, []);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const openTrade = (bono) => {
    setSelectedBono(bono);
    setIsTradeOpen(true);
  };
  const closeTrade = () => setIsTradeOpen(false);

  const handleVenderBono = async (nuevoBono) => {
    try {
      const response = await axios.post('http://localhost:5000/bonos', nuevoBono, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setBonos((prevBonos) => [...prevBonos, response.data]);
      closePopup();
    } catch (error) {
      console.error('Error al crear el bono:', error);
    }
  };

  const handleTradeBono = async (bono, clienteId) => {
    try {
      const response = await axios.put(`http://localhost:5000/bonos/${bono._id}`, { clienteId }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setBonos((prevBonos) => prevBonos.map(b => b._id === bono._id ? { ...b, clienteId } : b));
      closeTrade();
    } catch (error) {
      console.error('Error al relacionar el bono con el cliente:', error);
    }
  };

  return (
    <div className="bonos-container">
      <h2>Venta y gestión de bonos</h2>
      <button className="vender-bono-button" onClick={openPopup}>Vender un bono</button>
      <table className="bonos-table">
        <thead>
          <tr>
            <th>Nº de Bono</th>
            <th>Nombre del Bono</th>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Sesiones</th>
            <th>Estado del Pago</th>
            <th>Fecha de Validez</th>
            <th>Fecha de Creación</th>
            <th>Precio</th>
            <th>Pagada</th>
            <th>Pendiente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {bonos.map((bono) => (
            <tr key={bono._id}>
              <td>{bono.numero}</td>
              <td>{bono.nombre}</td>
              <td>{bono.cliente}</td>
              <td>{bono.servicio}</td>
              <td>{bono.sesiones}</td>
              <td>{bono.estadoPago}</td>
              <td>{new Date(bono.fechaVenta).toLocaleDateString()}</td>
              <td>{new Date(bono.fechaCreacion).toLocaleDateString()}</td>
              <td>{bono.precio}</td>
              <td>{bono.pagada ? 'Sí' : 'No'}</td>
              <td>{bono.pendiente ? 'Sí' : 'No'}</td>
              <td>
                <button onClick={() => openTrade(bono)}>Relacionar Cliente</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupOpen && (
        <VenderBonoPopup onClose={closePopup} onSubmit={handleVenderBono} />
      )}
      {isTradeOpen && (
        <BonosTrade bono={selectedBono} onClose={closeTrade} onTrade={handleTradeBono} />
      )}
    </div>
  );
};

export default Bonos;
