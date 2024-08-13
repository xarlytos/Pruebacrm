import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalCreacionEjercicio from './ModalCreacionEjercicio';
import ModalPrevisualizacionEjercicio from './ModalPrevisualizacionEjercicio';
import './ExerciseLista.css';

const ExerciseList = ({ theme }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleCreateExercise = () => {
    setCurrentExercise(null);
    setIsModalOpen(true);
  };

  const handleEditExercise = (exercise) => {
    setCurrentExercise(exercise);
    setIsModalOpen(true);
  };

  const handlePreviewExercise = (exercise) => {
    setCurrentExercise(exercise);
    setIsPreviewModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubcategoryChange = (e) => {
    setSubcategory(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const addExerciseToList = (newExercise) => {
    setExercises((prevExercises) => [...prevExercises, newExercise]);
    toast.success('Ejercicio creado exitosamente');
  };

  const updateExerciseInList = (updatedExercise) => {
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise._id === updatedExercise._id ? updatedExercise : exercise
      )
    );
    toast.success('Ejercicio actualizado exitosamente');
  };

  const filteredExercises = exercises.filter((exercise) => {
    return (
      (selectedFilter === 'custom' ? exercise.creador === 'Juan Pérez' : true) &&
      (category ? exercise.categoria === category : true) &&
      (subcategory ? exercise.subcategoria === subcategory : true) &&
      (exercise.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className={`ejercicios ${theme}`}>
      <ToastContainer />
      <div className="cabeza">
        <h1 className="titulo">Ejercicios</h1>
        <div className="actions">
          <button onClick={handleCreateExercise} className={`ejercicioButton ${theme}`}>Crear Ejercicio</button>
        </div>
      </div>
      <div className="filters">
        <div className="left">
          <div className="toggle-buttons">
            <div
              id="todosEj"
              className={`toggle-button ${selectedFilter === 'all' ? 'selected' : ''} ${theme}`}
              onClick={() => handleFilterChange('all')}
            >
              Todos
            </div>
            <div
              id="propiosEj"
              className={`toggle-button ${selectedFilter === 'custom' ? 'selected' : ''} ${theme}`}
              onClick={() => handleFilterChange('custom')}
            >
              Propios
            </div>
          </div>
          <select value={category} onChange={handleCategoryChange} className={theme}>
            <option value="">Categorías</option>
            <option value="Fuerza">Fuerza</option>
            <option value="Cardio">Cardio</option>
            {/* Agrega más categorías aquí */}
          </select>
          <select value={subcategory} onChange={handleSubcategoryChange} className={theme}>
            <option value="">Subcategorías</option>
            <option value="Piernas">Piernas</option>
            <option value="Pecho">Pecho</option>
            {/* Agrega más subcategorías aquí */}
          </select>
        </div>
        <div className="right">
          <input
            type="text"
            placeholder="Buscar ejercicios"
            value={searchTerm}
            onChange={handleSearchChange}
            className={theme}
          />
        </div>
      </div>
      <table className={`exercises-table ${theme}`}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Creador</th>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredExercises.map((exercise, index) => (
            <tr key={index}>
              <td>{exercise.nombre}</td>
              <td>{exercise.creador}</td>
              <td>{exercise.categoria}</td>
              <td>{exercise.subcategoria}</td>
              <td>
                <button onClick={() => handlePreviewExercise(exercise)} className={`action-button ${theme}`}>Previsualizar</button>
                <button onClick={() => handleEditExercise(exercise)} className={`action-button ${theme}`}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalPrevisualizacionEjercicio
        isOpen={isPreviewModalOpen}
        onClose={closePreviewModal}
        exercise={currentExercise}
        theme={theme} // Pasar el tema
      />
      <ModalCreacionEjercicio
        isOpen={isModalOpen}
        onClose={closeModal}
        addExercise={addExerciseToList}
        updateExercise={updateExerciseInList}
        currentExercise={currentExercise}
        theme={theme} // Pasar el tema
      />
    </div>
  );
};

export default ExerciseList;
