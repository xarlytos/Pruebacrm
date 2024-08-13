import React, { useState, useEffect } from 'react';
import './CreacionDeRutina.css';
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/fa/plus';

const CreacionDeRutina = ({ onClose, onAddRoutine, onUpdateRoutine, routine, theme }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [tableData, setTableData] = useState([['', '', '', '', '']]);
  const [showButton, setShowButton] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        setExercises(data.map(exercise => exercise.nombre));
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();

    if (routine) {
      setTableData(routine.exercises.map(e => [e.name, e.repetitions, e.weight, e.rest, e.notes]));
      setName(routine.name);
      setDescription(routine.description);
      setTags(routine.tags.join(', '));
      setNotes(routine.notes);
    }
  }, [routine]);

  const handleInputChange = (rowIndex, columnIndex, value) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][columnIndex] = value;
    setTableData(updatedData);

    const isRepsPattern = columnIndex === 1 && /(\d+)x(\d+)/.test(value);
    const isWeightPattern = columnIndex === 2 && /(\d+)(\+|\-)(\d+)/.test(value);

    if ((isRepsPattern || isWeightPattern) && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === columnIndex) {
      setShowButton({ rowIndex, columnIndex });
    } else {
      setShowButton(null);
    }

    if (columnIndex === 0 && value.length > 1) {
      const filteredSuggestions = exercises.filter(exercise => typeof exercise === 'string' && exercise.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddRows = (rowIndex) => {
    const value = tableData[rowIndex][showButton.columnIndex];
    const isRepsPattern = /(\d+)x(\d+)/.test(value);
    const isWeightPattern = /(\d+)(\+|\-)(\d+)/.test(value);
    const exerciseName = tableData[rowIndex][0];

    if (isRepsPattern) {
      const match = value.match(/(\d+)x(\d+)/);
      const numRows = parseInt(match[1], 10);
      const reps = match[2];

      const baseRow = tableData[rowIndex];
      const newRows = Array(numRows).fill().map(() => ([...baseRow.slice(0, 1), reps, ...baseRow.slice(2)]));

      const updatedData = [
        ...tableData.slice(0, rowIndex),
        ...newRows,
        ...tableData.slice(rowIndex + 1)
      ];

      setTableData(updatedData);
    } else if (isWeightPattern) {
      const match = value.match(/(\d+)(\+|\-)(\d+)/);
      const baseWeight = parseInt(match[1], 10);
      const increment = parseInt(match[3], 10);
      const operator = match[2];

      const baseRow = tableData[rowIndex];
      const newRows = Array(tableData.length - rowIndex).fill().map((_, i) => {
        if (tableData[rowIndex + i] && tableData[rowIndex + i][0] === exerciseName) {
          return [
            ...baseRow.slice(0, 2),
            operator === '+' ? (baseWeight + increment * i).toString() : (baseWeight - increment * i).toString(),
            ...baseRow.slice(3)
          ];
        }
        return tableData[rowIndex + i];
      });

      const updatedData = [
        ...tableData.slice(0, rowIndex),
        ...newRows,
      ];

      setTableData(updatedData);
    }

    setShowButton(null);
  };

  const handleFocus = (rowIndex, columnIndex) => {
    setFocusedCell({ rowIndex, columnIndex });
  };

  const handleBlur = () => {
    setFocusedCell(null);
    setShowButton(null);
    setTimeout(() => setSuggestions([]), 100);
  };

  const handleSuggestionClick = (rowIndex, suggestion) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][0] = suggestion;
    setTableData(updatedData);
    setSuggestions([]);
  };

  const addRow = () => {
    setTableData([...tableData, ['', '', '', '', '']]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRoutine = {
      name,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      notes,
      exercises: tableData.map(row => ({
        name: row[0],
        repetitions: row[1],
        weight: row[2],
        rest: row[3],
        notes: row[4]
      }))
    };

    try {
      const response = routine && routine._id
        ? await fetch(`/api/rutinadays/routines/${routine._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoutine)
          })
        : await fetch('/api/rutinadays/routines', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoutine)
          });

      if (response.ok) {
        const result = await response.json();
        routine && routine._id ? onUpdateRoutine(result) : onAddRoutine(result);
      } else {
        console.error("Error saving routine");
      }
    } catch (error) {
      console.error("Error saving routine:", error);
    }
  };

  return (
    <div className={`creacion-de-rutina-modal ${theme}`}>
      <div className={`creacion-de-rutina-modal-content ${theme}`}>
        <span className="creacion-de-rutina-close" onClick={onClose}>&times;</span>
        <h2>{routine && routine._id ? "Editar Rutina" : "Crear Nueva Rutina"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de la Rutina:
            <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} className={theme} required />
          </label>
          <label>
            Descripción:
            <input type="text" name="description" value={description} onChange={e => setDescription(e.target.value)} className={theme} required />
          </label>
          <label>
            Tags/Categorías:
            <input type="text" name="tags" value={tags} onChange={e => setTags(e.target.value)} className={theme} required />
          </label>
          <label>
            Notas Adicionales:
            <textarea name="notes" rows="3" value={notes} onChange={e => setNotes(e.target.value)} className={theme}></textarea>
          </label>
          <h3>Ejercicios/Actividades</h3>
          <div className="tableWrapper">
            <table className={`table ${theme}`}>
              <thead>
                <tr>
                  <th className={theme}>Ejercicio</th>
                  <th className={theme}>Repeticiones</th>
                  <th className={theme}>Peso o %RP</th>
                  <th className={theme}>Descanso</th>
                  <th className={theme}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className={`tableCell ${theme}`}>
                        <input
                          value={cell}
                          onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                          onFocus={() => handleFocus(rowIndex, colIndex)}
                          onBlur={handleBlur}
                          className={theme}
                        />
                        {colIndex === 0 && suggestions.length > 0 && focusedCell && focusedCell.rowIndex === rowIndex && focusedCell.columnIndex === colIndex && (
                          <div className={`suggestions ${theme}`}>
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className={`suggestion ${theme}`}
                                onMouseDown={() => handleSuggestionClick(rowIndex, suggestion)}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                        {showButton && showButton.rowIndex === rowIndex && showButton.columnIndex === colIndex && (
                          <button className="addButton" onMouseDown={() => handleAddRows(rowIndex)}>
                            <Icon icon={plus} />
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} className={`addButtonCell ${theme}`}>
                    <div className="addButtonWrapperRow">
                      <button className={`addButtonRow ${theme}`} type="button" onClick={addRow}>+</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="form-actions">
            <button type="submit" className={`addRoutineButton ${theme}`}>{routine && routine._id ? "Actualizar" : "Guardar"}</button>
            <button type="button" className={theme} onClick={onClose}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreacionDeRutina;
