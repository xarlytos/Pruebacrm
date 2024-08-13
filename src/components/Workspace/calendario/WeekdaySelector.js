const WeekdaySelector = ({ selectedDay, onDayChange }) => {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
    return (
      <div className="weekday-selector">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`weekday-button ${selectedDay === index ? 'selected' : ''}`}
            onClick={() => onDayChange(index)}
          >
            {day}
          </button>
        ))}
      </div>
    );
  };
  