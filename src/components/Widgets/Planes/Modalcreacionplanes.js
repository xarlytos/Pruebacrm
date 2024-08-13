import React, { useState } from 'react';
import axios from 'axios';
import './Modalcreacionplanes.css';

const Modalcreacionplanes = ({ onClose }) => {
  const [form, setForm] = useState({
    name: '',
    client: '',
    startDate: '',
    frequency: 'weekly',
    contractDuration: '',
    rate: '',
    paymentDay: '',
    type: 'fixed', // Agregado para distinguir el tipo de plan
    sessionsPerWeek: 0, // Solo para FixedPlan
    hourlyRate: '', // Solo para VariablePlan
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (form.type === 'fixed') {
        response = await axios.post('http://localhost:5005/plans/fixed', {
          name: form.name,
          client: form.client || null,
          startDate: form.startDate,
          frequency: form.frequency,
          contractDuration: form.contractDuration,
          rate: form.rate,
          paymentDay: form.paymentDay,
          sessionsPerWeek: form.sessionsPerWeek,
        });
      } else {
        response = await axios.post('http://localhost:5005/plans/variable', {
          name: form.name,
          client: form.client,
          startDate: form.startDate,
          hourlyRate: form.hourlyRate,
          paymentDay: form.paymentDay,
        });
      }
      console.log('Plan creado:', response.data);
      onClose(); // Cerrar modal al finalizar
    } catch (error) {
      console.error('Error al crear el plan:', error);
    }
  };  

  return (
    <div className="Modalcreacionplanes-popup">
      <div className="Modalcreacionplanes-popup-content">
        <h3>Crear Nuevo Plan</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Cliente:
            <input type="text" name="client" value={form.client} onChange={handleChange} />
          </label>
          <label>
            Fecha de Inicio:
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          </label>
          <label>
            Tipo de Plan:
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="fixed">Plan Fijo</option>
              <option value="variable">Plan Variable</option>
            </select>
          </label>
          {form.type === 'fixed' && (
            <>
              <label>
                Frecuencia:
                <select name="frequency" value={form.frequency} onChange={handleChange} required>
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quincenal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </label>
              <label>
                Duración del Contrato:
                <input type="number" name="contractDuration" value={form.contractDuration} onChange={handleChange} required />
              </label>
              <label>
                Tarifa:
                <input type="number" name="rate" value={form.rate} onChange={handleChange} required />
              </label>
              <label>
                Día de Pago:
                <input type="number" name="paymentDay" value={form.paymentDay} onChange={handleChange} required />
              </label>
              <label>
                Sesiones por Semana:
                <input type="number" name="sessionsPerWeek" value={form.sessionsPerWeek} onChange={handleChange} required />
              </label>
            </>
          )}
          {form.type === 'variable' && (
            <>
              <label>
                Tarifa por Hora:
                <input type="number" name="hourlyRate" value={form.hourlyRate} onChange={handleChange} required />
              </label>
              <label>
                Día de Pago:
                <input type="number" name="paymentDay" value={form.paymentDay} onChange={handleChange} required />
              </label>
            </>
          )}
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
