import React, { useState } from 'react';
import Draggable from 'react-draggable';
import Modal from './Modal';
import WireframeModal from './WireframeModal';
import ConexionConIA from './ConexionConIA'; // Importar el nuevo componente
import './ContentCreation.css';
import chatsConfig from './chatsConfig.json';

const ContentCreation = ({ theme }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChatConfig, setSelectedChatConfig] = useState(null);
  const [showWireframe, setShowWireframe] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeChats, setActiveChats] = useState([]); // Array para manejar múltiples chats
  const [showRecoveryPopup, setShowRecoveryPopup] = useState(false); // Estado para el popup de recuperación
  const [savedChats, setSavedChats] = useState([]); // Estado para los chats guardados

  const handleChatClick = (config) => {
    console.log('Chat clicked:', config);
    setSelectedChatConfig(config);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setShowModal(false);
    setSelectedChatConfig(null);
  };

  const handleToolClick = (tool) => {
    console.log('Tool clicked:', tool);
    setSelectedTool(tool);
    setShowWireframe(true);
  };

  const handleCloseWireframe = () => {
    console.log('Closing wireframe');
    setShowWireframe(false);
    setSelectedTool(null);
  };

  const handleConexionConIAClick = (title) => {
    console.log('ConexionConIA clicked:', title);
    const newChat = { id: Date.now(), title }; // Crear un nuevo chat con un ID único
    console.log('New chat created:', newChat);
    setActiveChats([...activeChats, newChat]); // Añadir el nuevo chat al array de chats activos
  };

  const handleCloseConexionConIA = (id) => {
    console.log('Closing ConexionConIA with id:', id);
    setActiveChats(activeChats.filter(chat => chat.id !== id)); // Cerrar chat filtrando el array
  };

  const handleOpenRecoveryPopup = async () => {
    console.log('Opening recovery popup');
    
    try {
      const response = await fetch('/api/getSavedChats'); // Supongamos que tienes una API que devuelve los chats guardados
      const chats = await response.json();
      
      setSavedChats(chats); // Guardar los chats en el estado
    } catch (error) {
      console.error('Error al recuperar los chats guardados:', error);
    }

    setShowRecoveryPopup(true); // Mostrar el popup de recuperación
  };

  const handleCloseRecoveryPopup = () => {
    console.log('Closing recovery popup');
    setShowRecoveryPopup(false); // Cerrar el popup de recuperación
  };

  const handleRecoverChat = (title) => {
    console.log('Recovering chat:', title);
    handleConexionConIAClick(title); // Esto crea un nuevo chat en la UI con el título del chat guardado
    handleCloseRecoveryPopup(); // Cerrar el popup después de la recuperación
  };

  const getIconPath = (title) => {
    try {
      console.log('Loading icon for:', title);
      return require(`./assets/icons/${title.toLowerCase()}.png`);
    } catch (error) {
      console.error(`Icon not found for ${title}`);
      return null;
    }
  };

  return (
    <div className={`content-creation ${theme}`}>
      {chatsConfig.map((config, index) => (
        <div 
          key={index} 
          className={`content-card ${theme}`} 
          onClick={index < 6 ? () => handleConexionConIAClick(config.title) : () => handleChatClick(config)}
        >
          <img src={getIconPath(config.title)} alt={`${config.title} icon`} />
          <h2>{config.title}</h2>
        </div>
      ))}
      <div className={`content-card ${theme}`} onClick={() => handleToolClick('Tool 4')}>
        <img src={getIconPath('Tool 4')} alt="Tool 4 icon" />
        <h2>Tool 4</h2>
      </div>
      <div className={`content-card ${theme}`} onClick={() => handleToolClick('Tool 5')}>
        <img src={getIconPath('Tool 5')} alt="Tool 5 icon" />
        <h2>Tool 5</h2>
      </div>
      <div className={`content-card ${theme}`} onClick={() => handleToolClick('Tool 6')}>
        <img src={getIconPath('Tool 6')} alt="Tool 6 icon" />
        <h2>Tool 6</h2>
      </div>
      <button className={`recovery-button ${theme}`} onClick={handleOpenRecoveryPopup}>
        Recuperar Chat
      </button>
      {showRecoveryPopup && (
        <div className="recovery-popup">
          <h3>Recuperar Chat</h3>
          {savedChats.length > 0 ? (
            savedChats.map((chat, index) => (
              <div 
                key={index} 
                className="recovery-item"
                onClick={() => handleRecoverChat(chat.title)}
              >
                {chat.title}
              </div>
            ))
          ) : (
            <p>No hay chats para recuperar</p>
          )}
          <button onClick={handleCloseRecoveryPopup}>Cerrar</button>
        </div>
      )}
      {activeChats.map(chat => (
        <Draggable key={chat.id}>
          <div className="conexionconia-wrapper" style={{ position: 'absolute', zIndex: chat.id }}>
            <ConexionConIA title={chat.title} theme={theme} /> {/* Pasar el tema a ConexionConIA */}
            <button onClick={() => handleCloseConexionConIA(chat.id)}>Cerrar {chat.title}</button>
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default ContentCreation;
