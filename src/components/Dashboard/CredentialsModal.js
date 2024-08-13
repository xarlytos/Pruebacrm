import React, { useState } from 'react';
import './CredentialsModal.css';
import GoogleSignInButton from './GoogleSignInButton';

function CredentialsModal({ isOpen, onClose, onGoogleLoginSuccess, googleUser }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  if (!isOpen) return null;

  const sections = ['Correo', 'Facebook', 'Instagram', 'Google', 'YouTube'];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Ingresar Credenciales</h2>
        {sections.map((section) => (
          <div key={section} className="accordion-section">
            <button className="accordion-toggle" onClick={() => toggleSection(section)}>
              {section}
            </button>
            {openSection === section && (
              <div className="accordion-content">
                {section === 'Google' ? (
                  <GoogleSignInButton onSuccess={onGoogleLoginSuccess} googleUser={googleUser} />
                ) : (
                  <form onSubmit={handleSubmit}>
                    <label>
                      Usuario:
                      <input type="text" name="username" required />
                    </label>
                    <label>
                      Contraseña:
                      <input type="password" name="password" required />
                    </label>
                    <div className="modal-buttons">
                      <button type="submit">Guardar</button>
                      <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CredentialsModal;
