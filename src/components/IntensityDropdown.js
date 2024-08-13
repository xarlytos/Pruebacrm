// src/components/IntensityDropdown.js
import React from 'react';

const IntensityDropdown = ({ onIntensitySelect }) => {
  const intensities = [1, 2, 3, 4, 5];

  return (
    <select onChange={(e) => onIntensitySelect(e.target.value)}>
      {intensities.map((intensity) => (
        <option key={intensity} value={intensity}>
          {intensity}/5
        </option>
      ))}
    </select>
  );
};

export default IntensityDropdown;
