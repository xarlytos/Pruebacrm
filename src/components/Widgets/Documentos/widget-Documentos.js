import React, { useState } from 'react';
import './widget-Documentos.css';
import DetailedDocumento from './DetailedDocumento';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

function WidgetDocumentos({ isEditMode, onTitleClick, theme }) { // Recibir el tema como prop
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [selectedColumns, setSelectedColumns] = useState({
    id: true,
    titulo: true,
    fecha: true,
    tipo: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const documentos = [
  ];

  const filteredDocumentos = documentos.filter(documento =>
    (filterType === 'todos' || documento.tipo === filterType) &&
    (documento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
     documento.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
     documento.tipo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);

  const handleColumnToggle = column => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);

  const [isDetailedDocumentoOpen, setDetailedDocumentoOpen] = useState(false);

  const handleOpenDetailedDocumento = () => {
    setDetailedDocumentoOpen(true);
  };

  const handleCloseDetailedDocumento = () => {
    setDetailedDocumentoOpen(false);
  };

  return (
    <div className={`Documentos-widget Documentos-widget-documentos ${theme}`}>
      <div className="Documentos-widget-handle"></div>
      <h2 onClick={onTitleClick}>Documentos</h2>
      {isEditMode && (
        <ColumnDropdown
          selectedColumns={selectedColumns}
          handleColumnToggle={handleColumnToggle}
        />
      )}
      <div className="Documentos-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`Documentos-filter-input ${theme}`}
        />
        <select 
          onChange={e => setFilterType(e.target.value)} 
          className={`Documentos-filter-select ${theme}`}
        >
          <option value="todos">Todos</option>
          <option value="licencia">Licencias</option>
          <option value="contrato">Contratos</option>
        </select>
      </div>
      <table className="Documentos-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {selectedColumns.id && <th>ID</th>}
            {selectedColumns.titulo && <th>Título</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            {selectedColumns.tipo && <th>Tipo</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((documento) => (
            <tr key={documento.id}>
              <td>
                <input type="checkbox" />
              </td>
              {selectedColumns.id && <td>{documento.id}</td>}
              {selectedColumns.titulo && <td>{documento.titulo}</td>}
              {selectedColumns.fecha && <td>{documento.fecha}</td>}
              {selectedColumns.tipo && <td>{documento.tipo}</td>}
              <td>
                <div className="Documentos-action-dropdown">
                  <button 
                    className={`Documentos-action-button ${theme}`} 
                    onClick={() => toggleActionDropdown(documento.id)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[documento.id] && (
                    <div className="Documentos-action-content">
                      <button className="Documentos-action-item">Descargar</button>
                      <button className="Documentos-action-item">Borrar</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="Documentos-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`Documentos-pagination-button ${theme}`}
        >
          Anterior
        </button>
        <span className="Documentos-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`Documentos-pagination-button ${theme}`}
        >
          Siguiente
        </button>
      </div>
      {isDetailedDocumentoOpen && (
        <DetailedDocumento onClose={handleCloseDetailedDocumento} />
      )}
    </div>
  );
}

export default WidgetDocumentos;
