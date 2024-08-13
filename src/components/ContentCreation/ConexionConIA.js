import React, { useState } from 'react';
import './ConexionConIA.css';

const ConexionConIA = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { id: messages.length, text: inputValue }]);
      setInputValue('');
    }
  };

  return (
    <div className="conexionconia-chat-container">
      <div className="conexionconia-chat-header">
        <h2>Chat con IA</h2>
      </div>
      <div className="conexionconia-chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="conexionconia-chat-message">
            {message.text}
          </div>
        ))}
      </div>
      <div className="conexionconia-chat-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="conexionconia-chat-input"
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSendMessage} className="conexionconia-chat-send-button">
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ConexionConIA;
