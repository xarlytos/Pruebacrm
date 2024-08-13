// src/components/CrearPlan.js
import React, { useState } from 'react';

const CrearPlan = ({ clienteId, onClose, onSave }) => {
    const [nombrePlan, setNombrePlan] = useState('');
    const [tipoPlan, setTipoPlan] = useState('FixedPlan');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes enviar el plan al backend
        // onSave debería actualizar el cliente en el estado padre
        onSave({ nombrePlan, tipoPlan });
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Crear Plan</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="nombrePlan"
                        placeholder="Nombre del Plan"
                        value={nombrePlan}
                        onChange={(e) => setNombrePlan(e.target.value)}
                        required
                    />
                    <select
                        name="tipoPlan"
                        value={tipoPlan}
                        onChange={(e) => setTipoPlan(e.target.value)}
                        required
                    >
                        <option value="FixedPlan">Fixed Plan</option>
                        <option value="VariablePlan">Variable Plan</option>
                    </select>
                    <button type="submit">Guardar Plan</button>
                </form>
            </div>
        </div>
    );
};

export default CrearPlan;
