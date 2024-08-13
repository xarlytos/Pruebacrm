import React, { useState } from 'react';
import './Modal.css';
import './UploadPostsModal.css';

function UploadPostsModal({ onClose }) {
  const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);

  const handleSocialMediaClick = (platform) => {
    setSelectedSocialMedia((prev) => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content upload-posts-modal">
        <h2>Crear nueva publicación</h2>
        <div className="social-media-icons">
          {['Facebook', 'Pinterest', 'TikTok', 'YouTube'].map(platform => (
            <button
              key={platform}
              className={`icon-button ${selectedSocialMedia.includes(platform) ? 'selected' : ''}`}
              onClick={() => handleSocialMediaClick(platform)}
            >
              <img src={`icons/${platform.toLowerCase()}.png`} alt={platform} />
            </button>
          ))}
        </div>
        <div className="editor-section">
          <textarea placeholder="Escribe tu publicación aquí..."></textarea>
        </div>
        <div className="file-upload">
          <label htmlFor="file-upload" className="custom-file-upload">
            Subir archivo
          </label>
          <input id="file-upload" type="file" />
        </div>
        <div className="settings-section">
          {selectedSocialMedia.map(platform => (
            <div key={platform} className="settings">
              <h3>Configuración de {platform}</h3>
              <div className="form-group">
                <label>Título</label>
                <input type="text" placeholder={`Título para ${platform}`} />
              </div>
              {platform === 'TikTok' && (
                <div className="form-group">
                  <label>¿Quién puede ver la publicación?</label>
                  <select>
                    <option value="publico">Público</option>
                    <option value="amigos">Amigos</option>
                  </select>
                </div>
              )}
              {platform === 'YouTube' && (
                <>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea placeholder="Descripción del video"></textarea>
                  </div>
                  <div className="form-group">
                    <label>Etiquetas</label>
                    <input type="text" placeholder="Etiquetas separadas por comas" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button className="publish-button">Programar</button>
        </div>
      </div>
    </div>
  );
}

export default UploadPostsModal;
