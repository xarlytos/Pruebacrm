import React, { useState } from 'react';
import './PopupInfoMark.css';

const PopupInfoMark = ({ show, onClose }) => {
    const [reportFrequency, setReportFrequency] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');

    if (!show) {
        return null;
    }

    const handleFrequencyChange = (event) => {
        setReportFrequency(event.target.value);
    };

    const handleMethodChange = (event) => {
        setDeliveryMethod(event.target.value);
    };

    return (
        <div className="popup-backdrop">
            <div className="popup-content">
                <h2>Generar informes</h2>
                <div className="popup-field">
                    <label>Generar informe cada cuanto tiempo?</label>
                    <select value={reportFrequency} onChange={handleFrequencyChange}>
                        <option value="">Seleccione una opción</option>
                        <option value="weekly">Semanalmente</option>
                        <option value="biweekly">Cada 15 días</option>
                        <option value="monthly">Mensualmente</option>
                    </select>
                </div>
                <div className="popup-field">
                    <label>Método de envío</label>
                    <select value={deliveryMethod} onChange={handleMethodChange}>
                        <option value="">Seleccione una opción</option>
                        <option value="email">Correo electrónico</option>
                        <option value="whatsapp">Whatsapp</option>
                    </select>
                </div>
                <div className="popup-buttons">
                    <button className="report-button">Generar informe actual</button>
                    <button className="report-button">Generar informe recurrentes</button>
                </div>
                <button onClick={onClose} className="close-button">Cerrar</button>
            </div>
        </div>
    );
};

export default PopupInfoMark;
