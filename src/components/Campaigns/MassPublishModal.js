import React, { useState } from 'react';
import './Modal.css';
import './MassPublishModal.css';
import ChatComponent from './ChatComponent';

function MassPublishModal({ onClose }) {
  const [showChat, setShowChat] = useState(true);  // Mostrar el chat de inmediato

  const handleChatClose = () => {
    setShowChat(false);
    onClose();  // También cerrar el modal completo
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Publicación Masiva</h2>
        {showChat && (
          <div className="chat-popup">
            <div className="chat-popup-content">
              <ChatComponent chatType="massPublish" />
              <button className="close-chat-button" onClick={handleChatClose}>Cerrar Chat</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MassPublishModal;
