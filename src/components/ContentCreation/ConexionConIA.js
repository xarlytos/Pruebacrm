import React, { useState } from 'react';
import axios from 'axios';
import './ConexionConIA.css';

const ConexionConIA = ({ title, theme }) => { // Recibir el tema como prop
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).substring(2)); // Genera un sessionId único
  const [showImportPopup, setShowImportPopup] = useState(false); // Estado para mostrar/ocultar el popup de importación
  const [availableChats, setAvailableChats] = useState([]); // Estado para guardar los chats disponibles

  console.log('ConexionConIA initialized with sessionId:', sessionId);

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      console.log('Sending message:', inputValue);
      const userMessage = { id: messages.length, role: 'user', text: inputValue };
      setMessages([...messages, userMessage]);
      setInputValue('');

      try {
        const response = await axios.post('/api/chat/sendMessage', {
          modelKey: 'model1', // Puedes cambiarlo según la IA específica
          message: inputValue,
          sessionId,
          chatTitle: title, // Pasar el título para seleccionar el prompt correcto
        });

        console.log('Response from backend:', response.data);

        const replyMessage = {
          id: messages.length + 1,
          role: 'assistant',
          text: response.data.reply,
        };
        setMessages((prevMessages) => [...prevMessages, replyMessage]);
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        // Manejo de errores opcional, como mostrar un mensaje de error en la UI
      }
    }
  };

  const handleImportChats = async () => {
    console.log('Importing previous chats');
    try {
      const response = await axios.get('/api/getSavedChats'); // Supongamos que tienes una API que devuelve los chats guardados
      console.log('Available chats:', response.data);
      setAvailableChats(response.data);
      setShowImportPopup(true);
    } catch (error) {
      console.error('Error al recuperar los chats guardados:', error);
    }
  };

  const handleSelectChat = (chatId) => {
    console.log('Importing chat with id:', chatId);
    const selectedChat = availableChats.find(chat => chat._id === chatId);
    if (selectedChat) {
      setMessages([...messages, ...selectedChat.messages]); // Añadir los mensajes importados al chat actual
    }
    setShowImportPopup(false);
  };

  return (
    <div className={`conexionconia-chat-container ${theme}`}> {/* Aplicar el tema aquí */}
      <div className="conexionconia-chat-header">
        <h2>{title}</h2> {/* Mostrar el título dinámico */}
        <button onClick={handleImportChats} className="conexionconia-import-button">
          Importar Chats
        </button>
      </div>
      <div className="conexionconia-chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`conexionconia-chat-message ${message.role}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="conexionconia-chat-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            console.log('Input value changed:', e.target.value);
            setInputValue(e.target.value);
          }}
          className="conexionconia-chat-input"
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSendMessage} className="conexionconia-chat-send-button">
          Enviar
        </button>
      </div>

      {showImportPopup && (
        <div className="conexionconia-import-popup">
          <h3>Seleccionar Chat para Importar</h3>
          {availableChats.length > 0 ? (
            availableChats.map(chat => (
              <div 
                key={chat._id} 
                className="conexionconia-import-item"
                onClick={() => handleSelectChat(chat._id)}
              >
                {chat.title}
              </div>
            ))
          ) : (
            <p>No hay chats disponibles para importar</p>
          )}
          <button onClick={() => setShowImportPopup(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default ConexionConIA;
