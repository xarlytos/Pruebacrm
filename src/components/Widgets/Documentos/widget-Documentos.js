import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widget-Documentos.css';
import FormDocumentos from './FormDocumentos';
import DetailedDocumento from './DetailedDocumento';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

function WidgetDocumentos({ isEditMode, onTitleClick, theme }) {
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
  const [documentos, setDocumentos] = useState([]);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [isDetailedDocumentoOpen, setIsDetailedDocumentoOpen] = useState(false);
  const [detailedDocumento, setDetailedDocumento] = useState(null);

  const [selectedDocumentos, setSelectedDocumentos] = useState({});
  const [isSelectAll, setIsSelectAll] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/licenses/`);
        const mappedDocumentos = response.data.map(doc => ({
          id: doc._id,
          titulo: doc.name,
          fecha: new Date(doc.issueDate).toLocaleDateString(),
          tipo: doc.type
        }));
        setDocumentos(mappedDocumentos);
      } catch (error) {
        console.error('Error fetching documentos:', error);
      }
    };

    fetchDocumentos();
  }, []);

  useEffect(() => {
    const allSelected = documentos.length > 0 && documentos.every(doc => selectedDocumentos[doc.id]);
    setIsSelectAll(allSelected);
  }, [selectedDocumentos, documentos]);

  const filteredDocumentos = documentos.filter(documento => {
    const matchesType = filterType === 'todos' || 
      (filterType === 'licencia' && documento.tipo.toLowerCase() === 'software') || 
      documento.tipo?.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = documento.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          documento.fecha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          documento.tipo?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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

  const handleOpenAddDocumentModal = () => {
    setIsAddDocumentModalOpen(true);
  };

  const handleCloseAddDocumentModal = () => {
    setIsAddDocumentModalOpen(false);
  };

  const handleOpenDetailedDocumento = (documento) => {
    setDetailedDocumento(documento);
    setIsDetailedDocumentoOpen(true);
  };

  const handleCloseDetailedDocumento = () => {
    setIsDetailedDocumentoOpen(false);
    setDetailedDocumento(null);
  };

  const handleSelectAll = () => {
    const newSelected = {};
    if (!isSelectAll) {
      currentItems.forEach(doc => {
        newSelected[doc.id] = true;
      });
    }
    setSelectedDocumentos(newSelected);
    setIsSelectAll(!isSelectAll);
  };

  const handleCheckboxChange = (id) => {
    setSelectedDocumentos(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={`uniquePrefix-Documentos-widget uniquePrefix-Documentos-widget-documentos ${theme}`}>
      <div className="uniquePrefix-Documentos-widget-handle"></div>
      <h2 onClick={onTitleClick}>Documentos</h2>
      {isEditMode && (
        <ColumnDropdown
          selectedColumns={selectedColumns}
          handleColumnToggle={handleColumnToggle}
        />
      )}
      <div className="uniquePrefix-Documentos-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`uniquePrefix-Documentos-filter-input ${theme}`}
        />
        <select 
          onChange={e => setFilterType(e.target.value)} 
          className={`uniquePrefix-Documentos-filter-select ${theme}`}
        >
          <option value="todos">Todos</option>
          <option value="licencia">Licencias</option>
          <option value="contrato">Contratos</option>
        </select>
      </div>
      <button onClick={handleOpenAddDocumentModal} className={`uniquePrefix-Documentos-add-button ${theme}`}>
        Añadir Documento
      </button>
      <table className="uniquePrefix-Documentos-table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={isSelectAll} 
                onChange={handleSelectAll} 
              />
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
                <input 
                  type="checkbox" 
                  checked={!!selectedDocumentos[documento.id]} 
                  onChange={() => handleCheckboxChange(documento.id)} 
                />
              </td>
              {selectedColumns.id && <td>{documento.id}</td>}
              {selectedColumns.titulo && <td>{documento.titulo}</td>}
              {selectedColumns.fecha && <td>{documento.fecha}</td>}
              {selectedColumns.tipo && <td>{documento.tipo}</td>}
              <td>
                <div className="uniquePrefix-Documentos-action-dropdown">
                  <button 
                    className={`uniquePrefix-Documentos-action-button ${theme}`} 
                    onClick={() => toggleActionDropdown(documento.id)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[documento.id] && (
                    <div className="uniquePrefix-Documentos-action-content">
                      <button className="uniquePrefix-Documentos-action-item" onClick={() => handleOpenDetailedDocumento(documento)}>Ver Detalles</button>
                      <button className="uniquePrefix-Documentos-action-item">Descargar</button>
                      <button className="uniquePrefix-Documentos-action-item">Borrar</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="uniquePrefix-Documentos-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`uniquePrefix-Documentos-pagination-button ${theme}`}
        >
          Anterior
        </button>
        <span className="uniquePrefix-Documentos-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`uniquePrefix-Documentos-pagination-button ${theme}`}
        >
          Siguiente
        </button>
      </div>
      
      <FormDocumentos
        isOpen={isAddDocumentModalOpen}
        onClose={handleCloseAddDocumentModal}
      />

      {isDetailedDocumentoOpen && detailedDocumento && (
        <DetailedDocumento documento={detailedDocumento} onClose={handleCloseDetailedDocumento} />
      )}
    </div>
  );
}

export default WidgetDocumentos;
