import React, { useState } from 'react';
import Papa from 'papaparse';
import './PopupClienteCSV.css';

// Definir los campos del esquema de cliente
const clienteSchemaFields = [
    'nombre', 'apellido', 'edad', 'genero', 'altura', 'peso', 'telefono', 'email', 
    'direccion', 'notas', 'objetivos', 'progreso', 'historialEntrenamiento', 
    'planEntrenamiento', 'planDieta', 'mensajes', 'associatedPlans', 'planTypes', 
    'incomes', 'paymentMethod', 'totalHours', 'associatedBonos', 'historialMedico', 
    'nivelExperiencia', 'cuestionarioPreferencias', 'canalCaptacionCliente', 
    'ocupacion', 'fechaNacimiento', 'tiempoConEntrenador', 'redesSociales', 
    'historialCompras'
];

const requiredFields = [
    'nombre', 'apellido', 'edad', 'genero', 'altura', 'peso', 'telefono', 
    'email', 'direccion', 'paymentMethod'
];

const PopupClienteCSV = ({ onClose, onConfirm, theme }) => {
    const [csvData, setCsvData] = useState([]);
    const [fileError, setFileError] = useState(null);
    const [fieldMapping, setFieldMapping] = useState({});
    const [validationError, setValidationError] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const csvHeaders = Object.keys(results.data[0]);
                const initialMapping = csvHeaders.reduce((acc, header) => {
                    acc[header] = header; // Default mapping is header to header
                    return acc;
                }, {});
                setCsvData(results.data);
                setFieldMapping(initialMapping);
                setFileError(null);
            },
            error: (error) => {
                console.error('Error al leer el archivo:', error);
                setFileError('Error al leer el archivo');
            }
        });
    };

    const handleFieldChange = (csvField, schemaField) => {
        setFieldMapping((prevMapping) => ({
            ...prevMapping,
            [csvField]: schemaField,
        }));
    };

    const validateData = (data) => {
        for (const field of requiredFields) {
            if (!data[0].hasOwnProperty(field)) {
                setValidationError(`El campo requerido "${field}" no está presente en los datos del CSV.`);
                return false;
            }
        }
        setValidationError(null);
        return true;
    };

    const handleConfirm = () => {
        const transformedData = csvData.map((row) => {
            const transformedRow = {};
            for (const csvField in fieldMapping) {
                const schemaField = fieldMapping[csvField];
                transformedRow[schemaField] = row[csvField];
            }
            return transformedRow;
        });

        if (validateData(transformedData)) {
            onConfirm(transformedData);
            onClose();
        }
    };

    return (
        <div className={`popup-overlay ${theme}`}>
            <div className={`popup-content ${theme}`}>
                <h2>Previsualización de CSV</h2>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
                {fileError && <p className="error">{fileError}</p>}
                {validationError && <p className="error">{validationError}</p>}
                {csvData.length > 0 && (
                    <>
                        <div className="field-mapping">
                            <h3>Asignar campos</h3>
                            {Object.keys(csvData[0]).map((csvField, index) => (
                                <div key={index} className="field-mapping-row">
                                    <span>{csvField}</span>
                                    <select
                                        value={fieldMapping[csvField]}
                                        onChange={(e) => handleFieldChange(csvField, e.target.value)}
                                    >
                                        {clienteSchemaFields.map((schemaField) => (
                                            <option key={schemaField} value={schemaField}>
                                                {schemaField}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="csv-preview">
                            <table>
                                <thead>
                                    <tr>
                                        {Object.keys(csvData[0]).map((key, index) => (
                                            <th key={index}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {csvData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Object.values(row).map((value, colIndex) => (
                                                <td key={colIndex}>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
                <div className="popup-actions">
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleConfirm} disabled={csvData.length === 0}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default PopupClienteCSV;
