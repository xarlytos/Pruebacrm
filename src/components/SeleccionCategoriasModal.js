import React from 'react';
import './SeleccionCategoriasModal.css';

const SeleccionCategoriasModal = ({ camposDisponibles, camposVisibles, handleCampoVisibleChange, onClose, theme }) => {
    return (
        <div className={`modaaal ${theme}`}>
            <div className={`modaaal-content ${theme}`}>
                <span className={`close ${theme}`} onClick={onClose}>&times;</span>
                <h4>Seleccionar Categorías</h4>
                <div className="campo-select">
                    {camposDisponibles.map(campo => (
                        <label key={campo.key} className={theme}>
                            <input
                                type="checkbox"
                                checked={camposVisibles.includes(campo.key)}
                                onChange={() => handleCampoVisibleChange(campo.key)}
                                className={theme}
                            />
                            {campo.label}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SeleccionCategoriasModal;
