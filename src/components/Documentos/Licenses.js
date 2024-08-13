// src/components/Licenses.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import LicenseForm from './LicenseForm';
import styles from './Licenses.module.css';

Modal.setAppElement('#root'); // Define the root element for accessibility

function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  const openLicenseModal = (license = null) => {
    setSelectedLicense(license);
    setIsLicenseModalOpen(true);
  };

  const closeLicenseModal = () => {
    setIsLicenseModalOpen(false);
    setSelectedLicense(null);
  };

  const addOrUpdateLicense = (newLicense) => {
    if (selectedLicense) {
      // Update existing license
      const updatedLicenses = licenses.map((license) =>
        license.id === selectedLicense.id ? newLicense : license
      );
      setLicenses(updatedLicenses);
    } else {
      // Add new license
      setLicenses([...licenses, { ...newLicense, id: licenses.length + 1 }]);
    }
    closeLicenseModal();
  };

  const deleteLicense = (id) => {
    setLicenses(licenses.filter((license) => license.id !== id));
  };

  const upcomingExpirations = licenses.filter((license) =>
    new Date(license.expirationDate) < new Date(new Date().setMonth(new Date().getMonth() + 1))
  ).length;

  return (
    <div>
      <h2>Dashboard de Licencias</h2>
      <div className={styles.licenseDashboard}>
        <p>Total de Licencias: {licenses.length}</p>
        <p>Próximas a Vencer: {upcomingExpirations}</p>
        <button onClick={() => openLicenseModal()} className={styles.addLicenseBtn}>Añadir Nueva Licencia</button>
      </div>
      <div className={styles.licenseTable}>
        {licenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nombre de la Certificación</th>
                <th>Tipo</th>
                <th>Organización Emisora</th>
                <th>Fecha de Emisión</th>
                <th>Fecha de Expiración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id}>
                  <td>{license.name}</td>
                  <td>{license.type}</td>
                  <td>{license.organization}</td>
                  <td>{license.issueDate}</td>
                  <td>{license.expirationDate}</td>
                  <td>{license.state}</td>
                  <td>
                    <button onClick={() => openLicenseModal(license)}>Ver</button>
                    <button onClick={() => deleteLicense(license.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se han registrado licencias.</p>
        )}
      </div>
      <Modal
        isOpen={isLicenseModalOpen}
        onRequestClose={closeLicenseModal}
        contentLabel="Detalle de la Licencia"
        className={styles.modal}
        overlayClassName={styles.modalOverlay}
      >
        <LicenseForm license={selectedLicense} closeModal={closeLicenseModal} saveLicense={addOrUpdateLicense} />
      </Modal>
    </div>
  );
}

export default Licenses;
