import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widget-LicenciasDuplicado.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

function WidgetLicenciasDuplicado({ isEditMode, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    id: true,
    titulo: true,
    fecha: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [licencias, setLicencias] = useState([]); 
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false); 
  const [newLicense, setNewLicense] = useState({
    name: '',
    type: '',
    organization: '',
    issueDate: '',
    expirationDate: '',
    attachment: '',
    renewalState: '',
    notes: '',
    reminderDate: '',
  });
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/licenses/`);
        const licensesData = response.data;

        const mappedLicencias = licensesData.map((license) => ({
          id: license._id,
          titulo: license.name,
          fecha: new Date(license.issueDate).toLocaleDateString(),
        }));

        setLicencias(mappedLicencias);
      } catch (error) {
        console.error('Error al obtener las licencias:', error);
      }
    };

    fetchLicenses();
  }, []);

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

  const handleAddLicense = () => {
    setShowAddLicenseModal(true);
  };

  const handleCloseModal = () => {
    setShowAddLicenseModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLicense({ ...newLicense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/licenses/`, newLicense);

      const createdLicense = response.data;

      setLicencias([
        ...licencias,
        {
          id: createdLicense._id,
          titulo: createdLicense.name,
          fecha: new Date(createdLicense.issueDate).toLocaleDateString(),
        },
      ]);

      setShowAddLicenseModal(false);
      setNewLicense({
        name: '',
        type: '',
        organization: '',
        issueDate: '',
        expirationDate: '',
        attachment: '',
        renewalState: '',
        notes: '',
        reminderDate: '',
      });
    } catch (error) {
      console.error('Error al crear la licencia:', error);
    }
  };

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
        <button className={`Licencias-add-button ${theme}`} onClick={handleAddLicense}>
          Añadir Licencia
        </button>
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

      {showAddLicenseModal && (
        <div className="modal-overlay">
          <div className={`modal-content ${theme}`}>
            <h3>Añadir Nueva Licencia</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Nombre"
                  value={newLicense.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Tipo</label>
                <input
                  type="text"
                  name="type"
                  id="type"
                  placeholder="Tipo"
                  value={newLicense.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="organization">Organización</label>
                <input
                  type="text"
                  name="organization"
                  id="organization"
                  placeholder="Organización"
                  value={newLicense.organization}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="issueDate">Fecha de Emisión</label>
                <input
                  type="date"
                  name="issueDate"
                  id="issueDate"
                  placeholder="Fecha de Emisión"
                  value={newLicense.issueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expirationDate">Fecha de Expiración</label>
                <input
                  type="date"
                  name="expirationDate"
                  id="expirationDate"
                  placeholder="Fecha de Expiración"
                  value={newLicense.expirationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="attachment">Adjunto</label>
                <input
                  type="text"
                  name="attachment"
                  id="attachment"
                  placeholder="Adjunto"
                  value={newLicense.attachment}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="renewalState">Estado de Renovación</label>
                <input
                  type="text"
                  name="renewalState"
                  id="renewalState"
                  placeholder="Estado de Renovación"
                  value={newLicense.renewalState}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reminderDate">Fecha de Recordatorio</label>
                <input
                  type="date"
                  name="reminderDate"
                  id="reminderDate"
                  placeholder="Fecha de Recordatorio"
                  value={newLicense.reminderDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notas</label>
                <textarea
                  name="notes"
                  id="notes"
                  placeholder="Notas"
                  value={newLicense.notes}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Añadir Licencia</button>
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

export default WidgetLicenciasDuplicado;
