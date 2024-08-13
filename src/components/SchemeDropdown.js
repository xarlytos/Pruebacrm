// src/components/SchemeDropdown.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchemeDropdown = ({ onSchemeSelect }) => {
  const [esquemas, setEsquemas] = useState([]);

  useEffect(() => {
    const fetchEsquemas = async () => {
      const response = await axios.get('/api/esquemas');
      setEsquemas(response.data);
    };

    fetchEsquemas();
  }, []);

  return (
    <select onChange={(e) => onSchemeSelect(e.target.value)}>
      {esquemas.map((esquema) => (
        <option key={esquema._id} value={esquema.nombre}>
          {esquema.nombre}
        </option>
      ))}
    </select>
  );
};

export default SchemeDropdown;
