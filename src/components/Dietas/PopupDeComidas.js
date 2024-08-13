import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './popupdecomidas.module.css';

const PopupDeComidas = ({ theme, isOpen, closeModal, comidaToEdit, refreshComidas }) => {
  const [comida, setComida] = useState({
    nombre: '',
    descripcion: '',
    calorias: '',
    carb: '',
    protein: '',
    fat: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (comidaToEdit) {
      setComida(comidaToEdit);
    } else {
      setComida({
        nombre: '',
        descripcion: '',
        calorias: '',
        carb: '',
        protein: '',
        fat: ''
      });
    }
  }, [comidaToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Cambiando el campo ${name} a ${value}`); // Log del cambio en el campo
    setComida({
      ...comida,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando comida:', comida); // Log al enviar la comida
      if (comidaToEdit) {
        // Update existing comida
        await axios.put(`/api/comidas/${comidaToEdit._id}`, comida);
      } else {
        // Create new comida
        await axios.post('/api/comidas', comida);
      }
      refreshComidas(); // Refresh the list of comidas after updating or creating
      closeModal(); // Close the modal
    } catch (error) {
      console.error('Error saving comida:', error);
    }
  };

  const generateComidaWithAI = async () => {
    setLoading(true);
    try {
      console.log('Generando comida con IA para:', comida.nombre); // Log antes de la generación con IA
      const response = await axios.post('/api/comidas/generate-comida', {
        nombre: comida.nombre,
        descripcion: comida.descripcion || '', // Enviar la descripción si está disponible
      });

      console.log('Respuesta de IA recibida:', response.data); // Log de la respuesta de IA

      if (response.data) {
        setComida({
          ...comida,
          descripcion: response.data.descripcion || comida.descripcion,
          calorias: response.data.calorias || '',
          carb: response.data.carb || '',
          protein: response.data.protein || '',
          fat: response.data.fat || ''
        });
        console.log('Campos actualizados con IA:', comida); // Log después de actualizar los campos
      }
    } catch (error) {
      console.error('Error generating comida with AI:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={`${styles.modalContent} ${theme === 'dark' ? styles.dark : ''}`}>
        <h2>{comidaToEdit ? 'Editar Comida' : 'Crear Comida'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.flexContainer}>
            <div className={styles.formGroup}>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={comida.nombre}
                onChange={handleChange}
                className={theme === 'dark' ? styles.dark : ''}
                required
              />
            </div>
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.generateButton} ${theme === 'dark' ? styles.dark : ''}`}
              onClick={generateComidaWithAI}
              disabled={loading || !comida.nombre}
            >
              {loading ? 'Generando...' : 'Generar Comida con IA'}
            </button>
          </div>
          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={comida.descripcion}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Calorías</label>
            <input
              type="number"
              name="calorias"
              value={comida.calorias}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Carbohidratos</label>
            <input
              type="number"
              name="carb"
              value={comida.carb}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Proteínas</label>
            <input
              type="number"
              name="protein"
              value={comida.protein}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Grasas</label>
            <input
              type="number"
              name="fat"
              value={comida.fat}
              onChange={handleChange}
              className={theme === 'dark' ? styles.dark : ''}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.btnPrimary} ${theme === 'dark' ? styles.dark : ''}`}
            >
              {comidaToEdit ? 'Guardar Cambios' : 'Crear Comida'}
            </button>
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.cancelButton} ${theme === 'dark' ? styles.dark : ''}`}
              onClick={closeModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupDeComidas;
