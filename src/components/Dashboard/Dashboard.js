import React, { useState } from 'react';
import './Dashboard.css';
import CredentialsModal from './CredentialsModal';

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGoogleLoginSuccess = (profile) => {
    setIsModalOpen(false);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Bienvenido al Dashboard</p>
      <button onClick={openModal}>Agregar Credenciales</button>
      <CredentialsModal isOpen={isModalOpen} onClose={closeModal} onGoogleLoginSuccess={handleGoogleLoginSuccess} />

      {/* Aquí está el iFrame directamente apuntando a la URL proporcionada */}
      <iframe
        src="https://app.metricool.com/autoin/3085147"
        width="100%"
        height="600px"
        frameBorder="0"
        allowFullScreen
        title="Metricool Dashboard"
      ></iframe>
    </div>
  );
}

export default Dashboard;
