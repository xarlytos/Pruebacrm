// src/components/UploadContractForm.js
import React, { useState } from 'react';
import './UploadContractForm.css';

const UploadContractForm = ({ closeModal, addContract }) => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('contract');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const newContract = {
        name: file.name,
        size: file.size,
        type,
      };
      addContract(newContract);
      closeModal();
    } else {
      alert('Por favor, sube un archivo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-contract-form">
      <h1>Subir Contrato</h1>
      <input type="file" onChange={handleFileChange} />
      <select onChange={handleTypeChange}>
        <option value="contract">Contrato</option>
        <option value="template">Plantilla</option>
      </select>
      <button type="submit">Subir</button>
      <button type="button" onClick={closeModal}>Cancelar</button>
    </form>
  );
};

export default UploadContractForm;
