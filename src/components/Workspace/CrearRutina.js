import React, { useState } from 'react';
import axios from 'axios';
import './CrearCliente.css';

const CrearRutina = ({ clienteId, onClose, onSave }) => {
    const [routine, setRoutine] = useState({
        nombre: '',
        descripcion: '',
        creador: '',
        dias: [],
        esquema: '',
        intensidad: '',
    });

    const [days, setDays] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoutine({
            ...routine,
            [name]: value,
        });
    };

    const handleAddDay = () => {
        setDays([...days, { nombre: '', ejercicios: [] }]);
    };

    const handleDayChange = (index, e) => {
        const newDays = [...days];
        newDays[index][e.target.name] = e.target.value;
        setDays(newDays);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/routines', { ...routine, dias: days, cliente: clienteId });
            setRoutine({
                nombre: '',
                descripcion: '',
                creador: '',
                dias: [],
                esquema: '',
                intensidad: '',
            });
            setDays([]);
            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error creating routine:', error);
        }
    };

    return (
        <div className="crear-rutina-modal">
            <div className="crear-rutina-content" onClick={(e) => e.stopPropagation()}>
                <span className="crear-rutina-close" onClick={onClose}>&times;</span>
                <h2>Crear Rutina</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={routine.nombre}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={routine.descripcion}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Esquema</label>
                        <input
                            type="text"
                            name="esquema"
                            value={routine.esquema}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Intensidad</label>
                        <input
                            type="text"
                            name="intensidad"
                            value={routine.intensidad}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                        onClick={handleAddDay}
                    >
                        Agregar Día
                    </button>
                    {days.map((day, index) => (
                        <div key={index} className="mb-4">
                            <label className="block text-gray-700">Nombre del Día</label>
                            <input
                                type="text"
                                name="nombre"
                                value={day.nombre}
                                onChange={(e) => handleDayChange(index, e)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Crear Rutina
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CrearRutina;
