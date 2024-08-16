import React, { useState } from 'react';

function WidgetDocumentosOtros({ isEditMode, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    nombre: true,
    descripcion: true,
    fecha: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [documentos, setDocumentos] = useState([]);
  const [showAddDocumentoModal, setShowAddDocumentoModal] = useState(false);
  const [newDocumento, setNewDocumento] = useState({
    nombre: '',
    descripcion: '',
    archivo: null,
  });
  const itemsPerPage = 5;

  const filteredDocumentos = documentos.filter(documento =>
    documento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    documento.fecha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocumentos.slice(indexOfFirstItem, indexOfLastItem);

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredDocumentos.length / itemsPerPage);

  const handleAddDocumento = () => {
    setShowAddDocumentoModal(true);
  };

  const handleCloseModal = () => {
    setShowAddDocumentoModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocumento({ ...newDocumento, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewDocumento({ ...newDocumento, archivo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fechaActual = new Date().toLocaleDateString();
    const nuevoDocumento = {
      id: documentos.length + 1, // Generar un ID simple basado en la longitud del array
      nombre: newDocumento.nombre,
      descripcion: newDocumento.descripcion,
      archivo: newDocumento.archivo,
      archivoURL: URL.createObjectURL(newDocumento.archivo), // Crear una URL para descargar el archivo
      fecha: fechaActual,
    };

    setDocumentos([...documentos, nuevoDocumento]);

    setShowAddDocumentoModal(false);
    setNewDocumento({
      nombre: '',
      descripcion: '',
      archivo: null,
    });
  };

  const handleDownload = (archivoURL, nombre) => {
    const link = document.createElement('a');
    link.href = archivoURL;
    link.download = nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`Licencias-widget ${theme}`}>
      <h2>Otros Documentos</h2>
      <div className="Licencias-filter-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`Licencias-filter-input ${theme}`}
        />
        <button className={`Licencias-add-button ${theme}`} onClick={handleAddDocumento}>
          Añadir Documento
        </button>
      </div>
      <table className={`Licencias-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {selectedColumns.nombre && <th>Nombre</th>}
            {selectedColumns.descripcion && <th>Descripción</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((documento) => (
            <tr key={documento.id}>
              <td>
                <input type="checkbox" />
              </td>
              {selectedColumns.nombre && <td>{documento.nombre}</td>}
              {selectedColumns.descripcion && <td>{documento.descripcion}</td>}
              {selectedColumns.fecha && <td>{documento.fecha}</td>}
              <td>
                <div className="Licencias-action-dropdown">
                  <button
                    className="Licencias-action-button"
                    onClick={() => toggleActionDropdown(documento.id)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[documento.id] && (
                    <div className="Licencias-action-content">
                      <button
                        className="Licencias-action-item"
                        onClick={() => handleDownload(documento.archivoURL, documento.nombre)}
                      >
                        Descargar
                      </button>
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

      {showAddDocumentoModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${theme}`}>
            <h3>Añadir Nuevo Documento</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  placeholder="Nombre"
                  value={newDocumento.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  placeholder="Descripción"
                  value={newDocumento.descripcion}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="archivo">Subir Archivo</label>
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <button type="submit">Añadir Documento</button>
              <button type="button" onClick={handleCloseModal}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WidgetDocumentosOtros;
