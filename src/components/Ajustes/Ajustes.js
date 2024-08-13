import React, { useState } from 'react';
import './Ajustes.css';

const Ajustes = () => {
  const [language, setLanguage] = useState('es');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', photo: null });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [nextPaymentDate, setNextPaymentDate] = useState(new Date('2024-08-23'));

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prevProfile) => ({ ...prevProfile, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationsChange = (e) => {
    const { name, checked } = e.target;
    setNotifications((prevNotifications) => ({ ...prevNotifications, [name]: checked }));
  };

  const calculateDaysUntilNextPayment = (date) => {
    const now = new Date();
    const timeDiff = date - now;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const daysUntilNextPayment = calculateDaysUntilNextPayment(nextPaymentDate);

  const handleSave = () => {
    console.log("Datos guardados", { language, profile, notifications, nextPaymentDate });
  };

  const triggerFileInput = () => {
    document.getElementById('photo-upload').click();
  };

  return (
    <div className="ajustes-container">
      <h1>Ajustes</h1>

      {/* Configuración de Idioma */}
      <div className="ajustes-section">
        <h2>Idioma</h2>
        <label htmlFor="language-select">Idioma:</label>
        <select id="language-select" value={language} onChange={handleLanguageChange}>
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </div>

      {/* Configuración de Perfil */}
      <div className="ajustes-section">
        <h2>Cuenta</h2>
        <div className="profile-photo-section">
          <div className="profile-photo-wrapper">
            {profile.photo ? (
              <img src={profile.photo} alt="Perfil" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder"></div> /* Fondo negro si no hay foto */
            )}
          </div>
          <input 
            type="file" 
            id="photo-upload" 
            accept="image/*" 
            onChange={handlePhotoChange} 
            className="photo-upload-input" 
          />
          <button 
            className="change-photo-button" 
            onClick={triggerFileInput}
          >
            Cambiar foto
          </button>
        </div>
        <div className="profile-details">
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} />
          
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} />
          
          <label htmlFor="phone">Teléfono:</label>
          <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleProfileChange} />
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <div className="ajustes-section">
        <h2>Notificaciones</h2>
        <label>
          <input type="checkbox" name="email" checked={notifications.email} onChange={handleNotificationsChange} />
          Notificaciones por Correo Electrónico
        </label>
        <label>
          <input type="checkbox" name="sms" checked={notifications.sms} onChange={handleNotificationsChange} />
          Notificaciones por SMS
        </label>
      </div>

      {/* Configuración de Dispositivos */}
      <div className="ajustes-section">
        <h2>Dispositivos</h2>
        <p>Aquí puedes gestionar tus dispositivos vinculados.</p>
      </div>

      {/* Configuración de Privacidad */}
      <div className="ajustes-section">
        <h2>Privacidad</h2>
        <p>Aquí puedes gestionar tu configuración de privacidad.</p>
      </div>

      {/* Configuración de Seguridad */}
      <div className="ajustes-section">
        <h2>Seguridad</h2>
        <p>Aquí puedes gestionar tu configuración de seguridad.</p>
      </div>

      {/* Configuración de Soporte */}
      <div className="ajustes-section">
        <h2>Soporte</h2>
        <p>Aquí puedes contactar con el soporte.</p>
      </div>

      {/* Novedades */}
      <div className="ajustes-section">
        <h2>Novedades</h2>
        <p>Aquí puedes ver las últimas novedades y actualizaciones.</p>
      </div>

      {/* Botón Guardar */}
      <div className="save-button-container">
        <button onClick={handleSave} className="save-button">Guardar</button>
      </div>
    </div>
  );
};

export default Ajustes;
