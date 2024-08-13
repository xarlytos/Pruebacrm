import React, { useState } from 'react';
import './ChatComponent.css';

const ChatComponent = ({ chatType }) => {
  const botName = chatType === 'massPublish' ? 'Planificador con IA' : 'Redactor de correos';
  const initialMessages = chatType === 'massPublish' 
    ? [{ sender: 'bot', text: 'Hi! How can I help you with your mass publishing?' }] 
    : [{ sender: 'bot', text: 'Hi! How can I help you with email creation?' }];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: 'user', text: input }]);
      setInput('');
      // Simula una respuesta del bot después de un breve retraso
      setTimeout(() => {
        const botResponse = chatType === 'massPublish' 
          ? 'I can assist with scheduling, content creation, and more for your mass publishing.' 
          : 'I can help with drafting, sending, and managing your emails.';
        
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: botResponse },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src="https://via.placeholder.com/50" alt="Bot avatar" className="bot-avatar" />
        <span className="bot-name">{botName}</span>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message here"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
