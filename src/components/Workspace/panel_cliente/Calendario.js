import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendario.css'; // Asegúrate de importar el archivo CSS

const Calendario = () => {
    const [value, setValue] = useState(new Date());

    const handleDateChange = (date) => {
        setValue(date);
    };

    return (
        <div className="calendario-section">
            <h3>Calendario</h3>
            <div className="calendario-container">
                <Calendar
                    onChange={handleDateChange}
                    value={value}
                />
            </div>
        </div>
    );
};

export default Calendario;
