import React, { useState, useEffect } from 'react';
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
  const [licencias, setLicencias] = useState([]); // Estado para las licencias
  const [showAddLicenseModal, setShowAddLicenseModal] = useState(false); // Estado para mostrar/ocultar el modal
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
        const response = await fetch('http://localhost:5005/api/licenses/');
        if (!response.ok) {
          throw new Error('Error al obtener las licencias');
        }
        const licensesData = await response.json();

        // Mapeamos los datos obtenidos para que coincidan con las columnas de la tabla
        const mappedLicencias = licensesData.map((license, index) => ({
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
      const response = await fetch('http://localhost:5005/api/licenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLicense),
      });

      if (!response.ok) {
        throw new Error('Error al crear la licencia');
      }

      const createdLicense = await response.json();

      // Actualizar la lista de licencias con la nueva licencia
      setLicencias([
        ...licencias,
        {
          id: createdLicense._id,
          titulo: createdLicense.name,
          fecha: new Date(createdLicense.issueDate).toLocaleDateString(),
        },
      ]);

      // Cerrar el modal y resetear el formulario
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
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={newLicense.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="type"
                placeholder="Tipo"
                value={newLicense.type}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="organization"
                placeholder="Organización"
                value={newLicense.organization}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="issueDate"
                placeholder="Fecha de Emisión"
                value={newLicense.issueDate}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="expirationDate"
                placeholder="Fecha de Expiración"
                value={newLicense.expirationDate}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="attachment"
                placeholder="Adjunto"
                value={newLicense.attachment}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="renewalState"
                placeholder="Estado de Renovación"
                value={newLicense.renewalState}
                onChange={handleInputChange}
                required
              />
              <input
                type="date"
                name="reminderDate"
                placeholder="Fecha de Recordatorio"
                value={newLicense.reminderDate}
                onChange={handleInputChange}
              />
              <textarea
                name="notes"
                placeholder="Notas"
                value={newLicense.notes}
                onChange={handleInputChange}
              />
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
