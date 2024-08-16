import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widget-Documentos.css';
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
  const [newDocumento, setNewDocumento] = useState({ id: '', titulo: '', fecha: '', tipo: '' });
  const [isDetailedDocumentoOpen, setIsDetailedDocumentoOpen] = useState(false);
  const [detailedDocumento, setDetailedDocumento] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch documents from the API when the component mounts
    const fetchDocumentos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/licenses/`);
        // Map the API data to the format expected by the component
        const mappedDocumentos = response.data.map(doc => ({
          id: doc._id,
          titulo: doc.name,
          fecha: new Date(doc.issueDate).toLocaleDateString(), // Convert date to a more readable format
          tipo: doc.type
        }));
        setDocumentos(mappedDocumentos);
      } catch (error) {
        console.error('Error fetching documentos:', error);
      }
    };

    fetchDocumentos();
  }, []);

  const filteredDocumentos = documentos.filter(documento =>
    (filterType === 'todos' || documento.tipo?.toLowerCase() === filterType) &&
    (
      documento.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.fecha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      documento.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
    )
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

  const handleOpenAddDocumentModal = () => {
    setIsAddDocumentModalOpen(true);
  };

  const handleCloseAddDocumentModal = () => {
    setIsAddDocumentModalOpen(false);
  };

  const handleAddDocumentoChange = (e) => {
    const { name, value } = e.target;
    setNewDocumento({ ...newDocumento, [name]: value });
  };

  const handleAddDocumentoSubmit = () => {
    setDocumentos([...documentos, { ...newDocumento, id: documentos.length + 1 }]);
    setNewDocumento({ id: '', titulo: '', fecha: '', tipo: '' });
    handleCloseAddDocumentModal();
  };

  const handleOpenDetailedDocumento = (documento) => {
    setDetailedDocumento(documento);
    setIsDetailedDocumentoOpen(true);
  };

  const handleCloseDetailedDocumento = () => {
    setIsDetailedDocumentoOpen(false);
    setDetailedDocumento(null);
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
      <button onClick={handleOpenAddDocumentModal} className={`Documentos-add-button ${theme}`}>
        Añadir Documento
      </button>
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
                      <button className="Documentos-action-item" onClick={() => handleOpenDetailedDocumento(documento)}>Ver Detalles</button>
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
      {isAddDocumentModalOpen && (
        <div className="Documentos-add-modal">
          <h3>Añadir Nuevo Documento</h3>
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={newDocumento.titulo}
            onChange={handleAddDocumentoChange}
            className={`Documentos-add-input ${theme}`}
          />
          <input
            type="date"
            name="fecha"
            placeholder="Fecha"
            value={newDocumento.fecha}
            onChange={handleAddDocumentoChange}
            className={`Documentos-add-input ${theme}`}
          />
          <select 
            name="tipo"
            value={newDocumento.tipo}
            onChange={handleAddDocumentoChange}
            className={`Documentos-add-select ${theme}`}
          >
            <option value="">Seleccione un tipo</option>
            <option value="licencia">Licencia</option>
            <option value="contrato">Contrato</option>
          </select>
          <button onClick={handleAddDocumentoSubmit} className={`Documentos-add-submit ${theme}`}>
            Guardar
          </button>
          <button onClick={handleCloseAddDocumentModal} className={`Documentos-add-cancel ${theme}`}>
            Cancelar
          </button>
        </div>
      )}
      {isDetailedDocumentoOpen && detailedDocumento && (
        <DetailedDocumento documento={detailedDocumento} onClose={handleCloseDetailedDocumento} />
      )}
    </div>
  );
}

export default WidgetDocumentos;
