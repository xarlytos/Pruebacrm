import React from 'react';
import './NavbarPrevisionesFiltros.css';

const NavbarPrevisionesFiltros = ({ filters, clearFilter }) => {
  const renderFilterTag = (label, value, key) => (
    <div className="filter-tag" key={key}>
      {label} {value} <span className="filter-clear" onClick={() => clearFilter(key)}>x</span>
    </div>
  );

  return (
    <div className="navbar-filtros">
      {filters.startDate && renderFilterTag('Inicio:', new Date(filters.startDate).toLocaleDateString(), 'startDate')}
      {filters.endDate && renderFilterTag('Fin:', new Date(filters.endDate).toLocaleDateString(), 'endDate')}
      {filters.metodo.length > 0 && filters.metodo.map((method, index) => renderFilterTag('Método:', method, `metodo-${index}`))}
      {filters.minMonto && renderFilterTag('Mín. €', filters.minMonto, 'minMonto')}
      {filters.maxMonto && renderFilterTag('Máx. €', filters.maxMonto, 'maxMonto')}
      {filters.estatus && renderFilterTag('Estatus:', filters.estatus, 'estatus')}
    </div>
  );
};

export default NavbarPrevisionesFiltros;
