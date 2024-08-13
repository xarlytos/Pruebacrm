import React from 'react';
import './MonthTool.css';

const MonthTool = ({ events, position }) => {
  return (
    <div className="month-tool-tooltip" style={{ top: position.top, left: position.left }}>
      <h3>Eventos</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <strong>{event.title}</strong><br />
            {event.start.toLocaleString()} - {event.end.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthTool;
