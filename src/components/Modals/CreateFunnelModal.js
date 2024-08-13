// src/components/Modals/CreateFunnelModal.js
import React, { useState } from 'react';
import './CreateFunnelModal.css';

const CreateFunnelModal = ({ onClose, onCreate }) => {
  const [funnelName, setFunnelName] = useState('');
  const [funnelDescription, setFunnelDescription] = useState('');
  const [activeForm, setActiveForm] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleFormSelection = (formType) => {
    setActiveForm(formType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(funnelName, funnelDescription);
    setFunnelName('');
    setFunnelDescription('');
    setActiveForm(null);
    onClose();
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const templates = [
    { id: 1, name: 'Plantilla 1', imgSrc: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Plantilla 2', imgSrc: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Plantilla 3', imgSrc: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Plantilla 4', imgSrc: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Plantilla 5', imgSrc: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Plantilla 6', imgSrc: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Plantilla 7', imgSrc: 'https://via.placeholder.com/150' },
    { id: 8, name: 'Plantilla 8', imgSrc: 'https://via.placeholder.com/150' },
    { id: 9, name: 'Plantilla 9', imgSrc: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <button className="modal-close-button" onClick={onClose}>Cerrar</button>
          <button className="modal-save-button" onClick={() => onCreate(selectedTemplate)}>Guardar Plantilla</button>
        </div>
        <h2>Crear Nuevo Funnel</h2>
        {!activeForm ? (
          <div className="button-container">
            <button className="option-button" onClick={() => handleFormSelection('Plantillas')}>
              <img src="https://static.vecteezy.com/system/resources/previews/006/692/135/non_2x/list-icon-template-black-color-editable-list-icon-symbol-flat-sign-isolated-on-white-background-simple-logo-illustration-for-graphic-and-web-design-free-vector.jpg" alt="Plantillas" />
              Plantillas
            </button>
            <button className="option-button" onClick={() => handleFormSelection('Crear funnel en blanco')}>
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAACUCAMAAADvY+hPAAAAWlBMVEX///8AAABiYmKxsbHz8/MpKSns7OwyMjLR0dGlpaXIyMjFxcXMzMy/v78mJiYjIyMJCQkdHR0ZGRlFRUVoaGjf399xcXF8fHwUFBSUlJQ4ODjX19eGhoarq6sYsBBKAAAB/ElEQVR4nO3Y7U7CQBCF4VkoH5ZuW6AqoNz/bWpicBeD1dA5x9ac9y8JPJkM2wWz7yvm+zb41naPPR/o0JMz+KMKSS4h5FBvgOZnjDkcgJOegcwh4CaNM4dyguYGNWmgOWxBO30xnwuXlvWVGjPpi3nu83bLxfWoITsNNi8QkwabwwEwabQZsR4gc5vuXa07GmQ+HU+4nUaZX6oGth4g82ptODTObHGVTg/X9QCaLaZDxPXugTRbmdbD8/SAmq3Krh9+aKw53+nWbT3AZotp0guvSaPNts6OPKdJw81WZlcQnx8BeHO+01uXSRPMFtN6NB47zTBfPcYdJk0x28Z1pznmfKd3gydNMlvcfqLroZNmmT13mmZ2PKd55nynh11NiWaLu4QeMmmm2dbpizhkp6lm26T1GLDTsN/dt1+v9unIu3vSIHPz+nCzc5cGffdfvfj/vnq6c9J/ag7LCZqPozDXvcavzcZgLrpe4yjNdp6guXidnvn9AX2c/VS3H5n5N8UJmucyU5KZk8ycZOYkMyeZOcnMSWZOMnOSmZPMnGTmJDMnmTnJzElmTjJzkpmTzJxk5iQzJ5k5ycxJZk4yc5KZk8ycZOYkMyeZOcnMSWZOMnOSmZPMnGTmJDMnmTnJzElmTjJzkpmTzJxk5iQzJ5k5ycxJZk4yc/qn5jel0h3Ts8UTlQAAAABJRU5ErkJggg==" alt="Crear funnel en blanco" />
              Crear funnel en blanco
            </button>
            <button className="option-button" onClick={() => handleFormSelection('IA')}>
              <img src="https://static.vecteezy.com/system/resources/previews/003/419/556/non_2x/line-icon-for-artificial-intelligence-vector.jpg" alt="IA" />
              IA
            </button>
          </div>
        ) : activeForm === 'Plantillas' ? (
          <div className="templates-container">
            {templates.map(template => (
              <div 
                key={template.id} 
                className={`template-card ${selectedTemplate === template ? 'selected' : ''}`} 
                onClick={() => handleTemplateSelect(template)}
              >
                <img src={template.imgSrc} alt={template.name} />
                <p>{template.name}</p>
              </div>
            ))}
            <div className="modal-buttons">
              <button className="cancel-button" type="button" onClick={onClose}>Cancelar</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre del Funnel"
              value={funnelName}
              onChange={(e) => setFunnelName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Descripción del Funnel"
              value={funnelDescription}
              onChange={(e) => setFunnelDescription(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="create-button" type="submit">Crear</button>
              <button className="cancel-button" type="button" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateFunnelModal;
