import React, { useState } from 'react';
import './UnionDeRutinas.css';

const UnionDeRutinas = ({ routines, currentRoutine, onClose, onCreateCombinedRoutine, theme }) => {
  const [routineToMerge, setRoutineToMerge] = useState(null);

  const handleSubmit = () => {
    if (currentRoutine && routineToMerge) {
      const combinedExercises = [
        ...currentRoutine.exercises.map(e => ({ ...e })),
        ...routineToMerge.exercises.map(e => ({ ...e }))
      ];

      const newRoutine = {
        name: '',
        description: '',
        tags: [],
        notes: '',
        exercises: combinedExercises
      };

      onCreateCombinedRoutine(newRoutine);
    }
  };

  return (
    <div className="union-de-rutinas-modal">
      <div className={`union-de-rutinas-modal-content ${theme}`}>
        <span className={`union-de-rutinas-close ${theme}`} onClick={onClose}>&times;</span>
        <h2>Unir Rutinas</h2>
        <div className="routine-select">
          <label>
            Seleccionar rutina para unir:
            <select 
              value={routineToMerge ? routineToMerge._id : ''} 
              onChange={(e) => {
                const selectedRoutine = routines.find(r => r._id === e.target.value);
                setRoutineToMerge(selectedRoutine);
              }}
              className={theme}
            >
              <option value="">Seleccionar Rutina</option>
              {routines.filter(r => r._id !== currentRoutine._id).map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-actions">
          <button onClick={handleSubmit} disabled={!routineToMerge} className={theme}>Unir y Crear Nueva Rutina</button>
          <button onClick={onClose} className={theme}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default UnionDeRutinas;
