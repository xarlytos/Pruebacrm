import React, { useState } from 'react';
import './Historialderegistrodeprogreso.css';

const Historialderegistrodeprogreso = ({ registros }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    const handleClosePopup = () => {
        setSelectedImage(null);
    };

    return (
        <div className="progress-history-container">
            <h3>Galería de Imágenes</h3>
            {registros.map((registro, index) => (
                <div key={index} className="progress-item" onClick={() => handleImageClick(registro.url)}>
                    {registro.tipo === 'imagen' ? (
                        <img src={registro.url} alt={`Registro ${index}`} className="progress-image" />
                    ) : (
                        <video controls className="progress-video">
                            <source src={registro.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    <div className="progress-date">{registro.fecha}</div>
                </div>
            ))}
            {selectedImage && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-content">
                        <img src={selectedImage} alt="Imagen en grande" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Historialderegistrodeprogreso;
