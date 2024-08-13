import React from 'react';
import './WireframeModal.css';

const WireframeModal = ({ show, onClose, tool, theme }) => {
  if (!show) return null;

  let url;
  switch (tool) {
    case 'Tool 4':
      url = 'https://www.fotor.com/';
      break;
    case 'Tool 5':
      url = 'https://www.recraft.ai/';
      break;
    case 'Tool 6':
      url = 'https://socialdude.ai/es';
      break;
    default:
      url = null;
  }

  return (
    <div className={`wireframe-modal ${theme}`}>
      <div className={`wireframe-modal-content ${theme}`}>
        <span className="close-button" onClick={onClose}>&times;</span>
        {url ? (
          <iframe src={url} title={`${tool} Wireframe`} className="wireframe-iframe"></iframe>
        ) : (
          <p>No wireframe available for {tool}</p>
        )}
      </div>
    </div>
  );
};

export default WireframeModal;
