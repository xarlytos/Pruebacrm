import React, { useState } from 'react';
import './widget-LicenciasDuplicado.css';

function WidgetLicenciasDuplicado({ isEditMode, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    id: true,
    titulo: true,
    fecha: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const licencias = [
    { id: 1, titulo: 'Licencia 1', fecha: '2023-01-01' },
    { id: 3, titulo: 'Licencia 2', fecha: '2023-01-03' },
    { id: 5, titulo: 'Licencia 3', fecha: '2023-01-05' },
  ];

  const filteredLicencias = licencias.filter(licencia =>
    licencia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    licencia.fecha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLicencias.slice(indexOfFirstItem, indexOfLastItem);

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredLicencias.length / itemsPerPage);

  return (
    <div className={`Licencias-widget ${theme}`}>
      <h2>Licencias</h2>
      <div className="Licencias-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`Licencias-filter-input ${theme}`}
        />
      </div>
      <table className={`Licencias-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {selectedColumns.id && <th>ID</th>}
            {selectedColumns.titulo && <th>Título</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((licencia) => (
            <tr key={licencia.id}>
              <td>
                <input type="checkbox" />
              </td>
              {selectedColumns.id && <td>{licencia.id}</td>}
              {selectedColumns.titulo && <td>{licencia.titulo}</td>}
              {selectedColumns.fecha && <td>{licencia.fecha}</td>}
              <td>
                <div className="Licencias-action-dropdown">
                  <button
                    className="Licencias-action-button"
                    onClick={() => toggleActionDropdown(licencia.id)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[licencia.id] && (
                    <div className="Licencias-action-content">
                      <button className="Licencias-action-item">Descargar</button>
                      <button className="Licencias-action-item">Borrar</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="Licencias-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="Licencias-pagination-button"
        >
          Anterior
        </button>
        <span className="Licencias-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="Licencias-pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default WidgetLicenciasDuplicado;
