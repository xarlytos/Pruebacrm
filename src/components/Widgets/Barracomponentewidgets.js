import React from 'react';
import './Barracomponentewidgets.css'; // Asegúrate de crear el archivo CSS para estilizar la barra

function Barracomponentewidgets({ onClose, theme, removedWidgets, onReaddWidget }) {
  return (
    <div className={`barra-component-widgets ${theme}`}>
      <button onClick={onClose} className="close-sidebar-btn">Cerrar</button>
      <h2>Componentes Widgets</h2>
      <ul>
        {removedWidgets.length > 0 ? (
          removedWidgets.map(widget => (
            <li key={widget.i}>
              <button onClick={() => onReaddWidget(widget)}>
                {widget.i} - Añadir
              </button>
            </li>
          ))
        ) : (
          <li>No hay widgets eliminados</li>
        )}
      </ul>
    </div>
  );
}

export default Barracomponentewidgets;
