import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PopupDeCreacionDePlanificacion.css';

const PopupDeCreacionDePlanificacion = ({ show, onClose, predefinedMetas, theme }) => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState({
    nombre: '',
    descripcion: '',
    creador: '',
    duracion: '',
    fechaInicio: '',
    meta: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan({
      ...plan,
      [name]: value,
    });
  };

  const generateWeeks = (duracion, fechaInicio) => {
    const numWeeks = parseInt(duracion, 10);
    const startDate = new Date(fechaInicio);
    const weeks = [];
    for (let i = 0; i < numWeeks; i++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(startDate.getDate() + i * 7);
      weeks.push({
        id: `week${i + 1}`,
        nombre: `Semana ${i + 1}`,
        dias: Array.from({ length: 7 }, (_, index) => ({
          id: `day${index + 1}`,
          nombre: `Día ${index + 1}`,
          sesiones: [],
        })),
        scheme: 'Foundation',
        intensity: '1/5',
      });
    }
    return weeks;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/routines', {
        nombre: plan.nombre,
        descripcion: plan.descripcion,
        creador: plan.creador,
        duracion: plan.duracion,
        fechaInicio: plan.fechaInicio,
        meta: plan.meta,
      });

      const newRoutine = response.data;
      const generatedWeeks = generateWeeks(plan.duracion, plan.fechaInicio);

      await axios.put(`/api/routines/${newRoutine._id}`, {
        ...newRoutine,
        rutinasSemanales: generatedWeeks,
      });

      setPlan({
        nombre: '',
        descripcion: '',
        creador: '',
        duracion: '',
        fechaInicio: '',
        meta: '',
      });

      onClose();
      navigate(`/edit-routine/${newRoutine._id}`, {
        state: {
          duracion: plan.duracion,
          fechaInicio: plan.fechaInicio,
        }
      });
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className={`popupdecreaciondeplanificacion-popup ${theme}`}>
      <div className={`popupdecreaciondeplanificacion-popup-inner ${theme}`}>
        <button className={`popupdecreaciondeplanificacion-close-button ${theme}`} onClick={onClose}>X</button>
        <h2 className="popupdecreaciondeplanificacion-title">Crear Planificación</h2>
        <form onSubmit={handleSubmit}>
          <div className="popupdecreaciondeplanificacion-field">
            <label className="popupdecreaciondeplanificacion-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={plan.nombre}
              onChange={handleChange}
              required
              className={`popupdecreaciondeplanificacion-input ${theme}`}
            />
          </div>
          <div className="popupdecreaciondeplanificacion-field">
            <label className="popupdecreaciondeplanificacion-label">Descripción</label>
            <textarea
              name="descripcion"
              value={plan.descripcion}
              onChange={handleChange}
              className={`popupdecreaciondeplanificacion-input ${theme}`}
            />
          </div>
          <div className="popupdecreaciondeplanificacion-field">
            <label className="popupdecreaciondeplanificacion-label">Creador</label>
            <input
              type="text"
              name="creador"
              value={plan.creador}
              onChange={handleChange}
              className={`popupdecreaciondeplanificacion-input ${theme}`}
            />
          </div>
          <div className="popupdecreaciondeplanificacion-field">
            <label className="popupdecreaciondeplanificacion-label">Duración (semanas o meses)</label>
            <input
              type="text"
              name="duracion"
              value={plan.duracion}
              onChange={handleChange}
              className={`popupdecreaciondeplanificacion-input ${theme}`}
            />
          </div>
          <div className="popupdecreaciondeplanificacion-field">
            <label className="popupdecreaciondeplanificacion-label">Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={plan.fechaInicio}
              onChange={handleChange}
              className={`popupdecreaciondeplanificacion-input ${theme}`}
            />
          </div>
          <div className="popupdecreaciondeplanificacion-field">
            <label className="popupdecreaciondeplanificacion-label">Meta</label>
            <select
              name="meta"
              value={predefinedMetas.includes(plan.meta) ? plan.meta : 'other'}
              onChange={(e) => {
                if (e.target.value === 'other') {
                  setPlan({ ...plan, meta: '' });
                } else {
                  setPlan({ ...plan, meta: e.target.value });
                }
              }}
              className={`popupdecreaciondeplanificacion-input ${theme}`}
            >
              {predefinedMetas.map((meta, index) => (
                <option key={index} value={meta}>{meta}</option>
              ))}
              <option value="other">Otra</option>
            </select>
            {!predefinedMetas.includes(plan.meta) && (
              <input
                type="text"
                name="meta"
                placeholder="Escribe tu meta"
                value={plan.meta}
                onChange={handleChange}
                className={`popupdecreaciondeplanificacion-input mt-2 ${theme}`}
              />
            )}
          </div>
          <button
            type="submit"
            className={`popupdecreaciondeplanificacion-button ${theme}`}
          >
            Crear Planificación
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupDeCreacionDePlanificacion;
