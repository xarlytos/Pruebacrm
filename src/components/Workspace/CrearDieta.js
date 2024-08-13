import React, { useState } from 'react';
import styles from './CrearDieta.module.css'; // Importamos el archivo CSS para estilos

const CrearDieta = ({ clienteId, onClose, onSave }) => {
    const [nombreDieta, setNombreDieta] = useState('');
    const [comidas, setComidas] = useState([{ nombreComida: '', calorias: 0, macronutrientes: { proteinas: 0, carbohidratos: 0, grasas: 0 } }]);

    const handleAddComida = () => {
        setComidas([...comidas, { nombreComida: '', calorias: 0, macronutrientes: { proteinas: 0, carbohidratos: 0, grasas: 0 } }]);
    };

    const handleComidaChange = (index, event) => {
        const newComidas = comidas.slice();
        const { name, value } = event.target;
        if (name in newComidas[index].macronutrientes) {
            newComidas[index].macronutrientes[name] = value;
        } else {
            newComidas[index][name] = value;
        }
        setComidas(newComidas);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({ nombreDieta, comidas });
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={onClose}>&times;</span>
                <h2>Crear Dieta</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nombre de la Dieta</label>
                        <input
                            type="text"
                            name="nombreDieta"
                            placeholder="Nombre de la Dieta"
                            value={nombreDieta}
                            onChange={(e) => setNombreDieta(e.target.value)}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    {comidas.map((comida, index) => (
                        <div key={index} className={styles.formGroup}>
                            <label>Nombre de la Comida</label>
                            <input
                                type="text"
                                name="nombreComida"
                                placeholder="Nombre de la Comida"
                                value={comida.nombreComida}
                                onChange={(e) => handleComidaChange(index, e)}
                                required
                                className={styles.inputField}
                            />
                            <label>Calorías</label>
                            <input
                                type="number"
                                name="calorias"
                                placeholder="Calorías"
                                value={comida.calorias}
                                onChange={(e) => handleComidaChange(index, e)}
                                required
                                className={styles.inputField}
                            />
                            <label>Proteínas</label>
                            <input
                                type="number"
                                name="proteinas"
                                placeholder="Proteínas"
                                value={comida.macronutrientes.proteinas}
                                onChange={(e) => handleComidaChange(index, e)}
                                required
                                className={styles.inputField}
                            />
                            <label>Carbohidratos</label>
                            <input
                                type="number"
                                name="carbohidratos"
                                placeholder="Carbohidratos"
                                value={comida.macronutrientes.carbohidratos}
                                onChange={(e) => handleComidaChange(index, e)}
                                required
                                className={styles.inputField}
                            />
                            <label>Grasas</label>
                            <input
                                type="number"
                                name="grasas"
                                placeholder="Grasas"
                                value={comida.macronutrientes.grasas}
                                onChange={(e) => handleComidaChange(index, e)}
                                required
                                className={styles.inputField}
                            />
                        </div>
                    ))}
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={handleAddComida} className={styles.btnSecondary}>Añadir Comida</button>
                        <button type="submit" className={styles.btnPrimary}>Guardar Dieta</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearDieta;
