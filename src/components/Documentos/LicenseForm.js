// src/components/LicenseForm.js
import React, { useState, useEffect } from 'react';
import styles from './LicenseForm.module.css';

const LicenseForm = ({ license, closeModal, saveLicense }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Certificación Profesional',
    customType: '',
    organization: '',
    issueDate: '',
    expirationDate: '',
    attachment: '',
    notes: '',
    renewalState: 'Renovación Automática',
    reminderDate: '',
  });

  useEffect(() => {
    if (license) {
      setFormData({ ...license, customType: '' });
    }
  }, [license]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, attachment: file.name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      type: formData.type === 'Otro' ? formData.customType : formData.type,
    };
    saveLicense(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.licenseForm}>
      <h1>Detalle de la Licencia</h1>
      <div className={styles.gridContainer}>
        <label htmlFor="name">Nombre:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="type">Tipo:</label>
        <select id="type" name="type" value={formData.type} onChange={handleChange} required>
          <option value="Certificación Profesional">Certificación Profesional</option>
          <option value="Seguro">Seguro</option>
          <option value="Permiso Local">Permiso Local</option>
          <option value="Curso">Curso</option>
          <option value="Otro">Otro</option>
        </select>

        {formData.type === 'Otro' && (
          <>
            <label htmlFor="customType">Especificar Tipo:</label>
            <input type="text" id="customType" name="customType" value={formData.customType} onChange={handleChange} required />
          </>
        )}

        <label htmlFor="organization">Organización Emisora:</label>
        <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} required />

        <label htmlFor="issueDate">Fecha de Emisión:</label>
        <input type="date" id="issueDate" name="issueDate" value={formData.issueDate} onChange={handleChange} required />

        <label htmlFor="expirationDate">Fecha de Expiración:</label>
        <input type="date" id="expirationDate" name="expirationDate" value={formData.expirationDate} onChange={handleChange} required />

        <label htmlFor="attachment">Archivo Adjunto:</label>
        <input type="file" id="attachment" name="attachment" onChange={handleFileChange} required />

        <label htmlFor="notes">Notas:</label>
        <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange}></textarea>

        <label htmlFor="renewalState">Estado de Renovación:</label>
        <select id="renewalState" name="renewalState" value={formData.renewalState} onChange={handleChange} required>
          <option value="Renovación Automática">Renovación Automática</option>
          <option value="Requiere Acción">Requiere Acción</option>
        </select>

        <label htmlFor="reminderDate">Fecha de Recordatorio:</label>
        <input type="date" id="reminderDate" name="reminderDate" value={formData.reminderDate} onChange={handleChange} />
      </div>

      <div className={styles.buttonContainer}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={closeModal}>Cancelar</button>
      </div>
    </form>
  );
};

export default LicenseForm;
