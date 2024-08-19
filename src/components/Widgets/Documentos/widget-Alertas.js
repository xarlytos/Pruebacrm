import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WidgetAlertas({ theme }) {
  const [alertas, setAlertas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [editAlertId, setEditAlertId] = useState(null); // Para saber cuál alerta estamos editando
  const [newDisplayDate, setNewDisplayDate] = useState(''); // Nueva fecha de visualización
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const response = await axios.get('https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas');
        const alertasLicencia = response.data.filter(alerta => alerta.tipo === 'licencia');
        setAlertas(alertasLicencia);
      } catch (error) {
        console.error('Error al cargar las alertas:', error);
      }
    };

    fetchAlertas();
  }, []);

  const handleUpdateDisplayDate = async (id) => {
    try {
      await axios.put(`https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas/${id}`, {
        displayDate: new Date(newDisplayDate).toISOString()
      });
      // Actualizar la lista de alertas con la nueva fecha
      setAlertas(alertas.map(alerta => 
        alerta._id === id ? { ...alerta, displayDate: newDisplayDate } : alerta
      ));
      setEditAlertId(null);
      setNewDisplayDate('');
    } catch (error) {
      console.error('Error al actualizar la fecha de visualización:', error);
    }
  };

  const handleDeleteAlerta = async (id) => {
    try {
      await axios.delete(`https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com/api/alertas/${id}`);
      // Actualizar la lista de alertas eliminando la alerta borrada
      setAlertas(alertas.filter(alerta => alerta._id !== id));
    } catch (error) {
      console.error('Error al borrar la alerta:', error);
    }
  };

  const filteredAlertas = alertas.filter(alerta =>
    alerta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(alerta.alertDate).toLocaleDateString().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAlertas.slice(indexOfFirstItem, indexOfLastItem);

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredAlertas.length / itemsPerPage);

  return (
    <div className={`Licencias-widget ${theme}`}>
      <h2>Alertas de Licencias</h2>
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
            <th>Título</th>
            <th>Fecha de Alerta</th>
            <th>Fecha de Recordatorio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((alerta) => (
            <tr key={alerta._id}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{alerta.title}</td>
              <td>{new Date(alerta.alertDate).toLocaleDateString()}</td>
              <td>
                {editAlertId === alerta._id ? (
                  <input
                    type="date"
                    value={newDisplayDate}
                    onChange={e => setNewDisplayDate(e.target.value)}
                    onBlur={() => handleUpdateDisplayDate(alerta._id)}
                  />
                ) : (
                  new Date(alerta.displayDate).toLocaleDateString()
                )}
              </td>
              <td>
                <div className="Licencias-action-dropdown">
                  <button
                    className="Licencias-action-button"
                    onClick={() => toggleActionDropdown(alerta._id)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[alerta._id] && (
                    <div className="Licencias-action-content">
                      <button 
                        className="Licencias-action-item"
                        onClick={() => setEditAlertId(alerta._id)}
                      >
                        Editar Fecha
                      </button>
                      <button 
                        className="Licencias-action-item"
                        onClick={() => handleDeleteAlerta(alerta._id)}
                      >
                        Borrar
                      </button>
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

export default WidgetAlertas;
