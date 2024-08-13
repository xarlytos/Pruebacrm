import React, { useState, useEffect } from 'react';
import './Modal.css';

const Modal = ({ show, onClose, config }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (config && config.initialMessages) {
      setMessages(config.initialMessages);
    }
  }, [config]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');

      // Simulate bot response
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages, 
          { text: 'Thank you for your message! How can I assist you further?', sender: 'bot' }
        ]);
      }, 1000); // Delay response by 1 second
    }
  };

  if (!show) return null;  // Don't render the modal if `show` is false

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{config.title}</h2>
          <button onClick={onClose} className="close-button">Cerrar Chat</button>
        </div>
        <div className="modal-content">
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Escribe un mensaje" 
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
