// src/components/Clases/ClientesLista.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ClientesLista.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const ClientesLista = ({ onClientesSeleccionados, clientesSeleccionados, onClose }) => {
  const [clientes, setClientes] = useState([]);
  const [selectedClientes, setSelectedClientes] = useState(clientesSeleccionados || []);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/clientes`);
      // Filtrar clientes ya seleccionados
      const filteredClientes = response.data.filter(cliente => 
        !clientesSeleccionados.some(selected => selected._id === cliente._id)
      );
      setClientes(filteredClientes);
      toast.success('Clientes cargados correctamente');
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      toast.error('Error al cargar los clientes');
    }
  };

  const handleCheckboxChange = (cliente) => {
    if (selectedClientes.includes(cliente)) {
      setSelectedClientes(selectedClientes.filter(c => c._id !== cliente._id));
    } else {
      setSelectedClientes([...selectedClientes, cliente]);
    }
  };

  const handleConfirmarSeleccion = () => {
    onClientesSeleccionados(selectedClientes);
  };

  return (
    <div className={styles.clientesListaContainer}>
      <ToastContainer />
      <h1>Seleccionar Clientes</h1>
      <button className={styles.confirmarBtn} onClick={handleConfirmarSeleccion}>Confirmar Selección</button>
      <button className={styles.cerrarBtn} onClick={onClose}>Cerrar</button>
      <table className={styles.clientesTable}>
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedClientes.includes(cliente)}
                  onChange={() => handleCheckboxChange(cliente)}
                />
              </td>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>{cliente.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesLista;
