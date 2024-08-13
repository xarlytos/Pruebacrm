import React, { useState } from 'react';
import './CSVPreviewModal.css';

const CSVPreviewModal = ({ datosCSV, onClose, onConfirm, theme }) => {
    const [datosEditados, setDatosEditados] = useState(datosCSV);

    const handleInputChange = (e, rowIndex, columnName) => {
        const newDatos = [...datosEditados];
        newDatos[rowIndex][columnName] = e.target.value;
        setDatosEditados(newDatos);
    };

    return (
        <div className="modal">
            <div className={`modal-content ${theme}`}>
                <button className="close" onClick={onClose}>&times;</button>
                <h3>Vista Previa de Datos</h3>
                <table>
                    <thead>
                        <tr>
                            {Object.keys(datosCSV[0]).map((key, index) => (
                                <th key={index}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {datosEditados.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.keys(row).map((columnName, colIndex) => (
                                    <td key={colIndex}>
                                        <input 
                                            type="text" 
                                            value={row[columnName]} 
                                            onChange={(e) => handleInputChange(e, rowIndex, columnName)} 
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => onConfirm(datosEditados)}>Confirmar Importación</button>
            </div>
        </div>
    );
};

export default CSVPreviewModal;
