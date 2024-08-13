import React, { useState } from 'react';
import './ClientFilterDropdown.css';

const ClientFilterDropdown = ({ onFilterChange, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        nombre: '',
        apellido: '',
        estado: '',
        telefono: '',
        email: '',
        tag: '',
        tipoDePlan: '',
        ultimoCheckin: '',
        clase: '',
        porcentajeCumplimiento: '',
        alertas: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
        setIsOpen(false);
    };

    return (
        <div className={`cc-client-filter-dropdown ${theme}`}>
            <button className={`cliente-action-btn ${theme}`} onClick={() => setIsOpen(!isOpen)}>
                Filtros
            </button>
            {isOpen && (
                <div className={`cc-cliente-dropdown-content ${theme}`}>
                    {Object.keys(filters).map((key) => (
                        <div key={key} className="cc-client-filter-item">
                            <label className={`cc-client-filter-label ${theme}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                            <input
                                type="text"
                                name={key}
                                value={filters[key]}
                                onChange={handleInputChange}
                                className={`cc-client-filter-input ${theme}`}
                            />
                        </div>
                    ))}
                    <button className={`cc-apply-filters-button ${theme}`} onClick={handleApplyFilters}>Aplicar Filtros</button>
                </div>
            )}
        </div>
    );
};

export default ClientFilterDropdown;
