// Modalcreacionplanes.js
import React, { useState } from 'react';
import './ModalcreacionplanesDuplicado.css';

const Modalcreacionplanes = ({ onClose }) => {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    clientes: 0,
    precio: '',
    duracion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para manejar el envío del formulario
    console.log('Nuevo plan:', form);
    onClose();
  };

  return (
    <div className="Modalcreacionplanes-popup">
      <div className="Modalcreacionplanes-popup-content">
        <h3>Crear Nuevo Plan</h3>
        <form onSubmit={handleSubmit}>
          <label>
            ID:
            <input type="text" name="id" value={form.id} onChange={handleChange} required />
          </label>
          <label>
            Nombre:
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
          </label>
          <label>
            Clientes:
            <input type="number" name="clientes" value={form.clientes} onChange={handleChange} required />
          </label>
          <label>
            Precio:
            <input type="text" name="precio" value={form.precio} onChange={handleChange} required />
          </label>
          <label>
            Duración:
            <input type="text" name="duracion" value={form.duracion} onChange={handleChange} required />
          </label>
          <div className="Modalcreacionplanes-buttons">
            <button type="submit">Crear</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modalcreacionplanes;
