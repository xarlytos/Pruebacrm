import React, { useState } from 'react';
import ChatComponentContentC from './ChatComponentContentC';
import Modal from './Modal';
import WireframeModal from './WireframeModal';
import './ContentCreation.css';
import chatsConfig from './chatsConfig.json';

const ContentCreation = ({ theme }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChatConfig, setSelectedChatConfig] = useState(null);
  const [showWireframe, setShowWireframe] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const handleChatClick = (config) => {
    setSelectedChatConfig(config);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChatConfig(null);
  };

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    setShowWireframe(true);
  };

  const handleCloseWireframe = () => {
    setShowWireframe(false);
    setSelectedTool(null);
  };

  const getIconPath = (title) => {
    try {
      return require(`./assets/icons/${title.toLowerCase()}.png`);
    } catch (error) {
      console.error(`Icon not found for ${title}`);
      return null;
    }
  };

  return (
    <div className={`content-creation ${theme}`}>
      {chatsConfig.map((config, index) => (
        <div key={index} className={`content-card ${theme}`} onClick={() => handleChatClick(config)}>
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
      {showModal && selectedChatConfig && (
        <Modal show={showModal} onClose={handleCloseModal} config={selectedChatConfig} />
      )}
      {showWireframe && selectedTool && (
        <WireframeModal show={showWireframe} onClose={handleCloseWireframe} tool={selectedTool} theme={theme} />
      )}
    </div>
  );
};

export default ContentCreation;
