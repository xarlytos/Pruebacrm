import React from 'react';
import './ChatComponentContentC.css'; // Asegurémonos de que esta ruta sea correcta

const ChatComponentContentC = ({ title, onClick }) => {
  return (
    <div className="chat-component-content-c" onClick={onClick}>
      <div className="chat-icon">
        {/* Placeholder for the chat icon */}
        <img src="path/to/chat-icon.png" alt="Chat Icon" />
      </div>
      <div className="chat-title">
        {title}
      </div>
    </div>
  );
};

export default ChatComponentContentC;
