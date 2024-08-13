import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Tablacomidas.module.css';

const Tablacomidas = ({ theme }) => {
  const [comidas, setComidas] = useState([]);

  useEffect(() => {
    const fetchComidas = async () => {
      try {
        const response = await axios.get('/api/comidas');
        setComidas(response.data);
      } catch (error) {
        console.error('Error fetching comidas:', error);
      }
    };

    fetchComidas();
  }, []);

  return (
    <div className={`${styles.tableContainer} ${theme === 'dark' ? styles.dark : ''}`}>
      <h2>Comidas</h2>
      <table className={styles.styledTable}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Calorías</th>
            <th>Carbohidratos</th>
            <th>Proteínas</th>
            <th>Grasas</th>
          </tr>
        </thead>
        <tbody>
          {comidas.map((comida) => (
            <tr key={comida._id}>
              <td>{comida.nombre}</td>
              <td>{comida.descripcion}</td>
              <td>{comida.calorias}</td>
              <td>{comida.carb}</td>
              <td>{comida.protein}</td>
              <td>{comida.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tablacomidas;
