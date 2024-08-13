import React from 'react';
import './navbarfiltros.css';

const NavbarFiltros = ({ filters, clearFilter }) => {
  const renderFilterTag = (label, value, key) => (
    <div className="filter-tag" key={key}>
      {label} {value} <span className="filter-clear" onClick={() => clearFilter(key)}>x</span>
    </div>
  );

  return (
    <div className="navbar-filtros">
      {filters.startDate && renderFilterTag('Inicio', new Date(filters.startDate).toLocaleDateString(), 'startDate')}
      {filters.endDate && renderFilterTag('Fin', new Date(filters.endDate).toLocaleDateString(), 'endDate')}
      {filters.estado && renderFilterTag('', filters.estado, 'estado')}
      {filters.minMonto && renderFilterTag('Mín. €', filters.minMonto, 'minMonto')}
      {filters.maxMonto && renderFilterTag('Máx. €', filters.maxMonto, 'maxMonto')}
      {filters.tipo && renderFilterTag('', filters.tipo, 'tipo')}
    </div>
  );
};

export default NavbarFiltros;
