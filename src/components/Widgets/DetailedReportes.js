import React, { useState } from 'react';
import NavegadorDeGraficos from './Componentepanelcontrol/NavegadorDeGraficos';
import ModalGenerarReporteRecurrente from './ModalGenerarReporteRecurrente';
import ModalGenerarReporteActual from './ModalGenerarReporteActual';
import './DetailedReportes.css';

function DetailedReportes({ theme, setTheme, onTabChange, activeTab }) {
  const [isRecurrentModalOpen, setIsRecurrentModalOpen] = useState(false);
  const [isActualModalOpen, setIsActualModalOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  const handleOpenRecurrentModal = () => {
    setIsRecurrentModalOpen(true);
  };

  const handleCloseRecurrentModal = () => {
    setIsRecurrentModalOpen(false);
  };

  const handleOpenActualModal = () => {
    setIsActualModalOpen(true);
  };

  const handleCloseActualModal = () => {
    setIsActualModalOpen(false);
  };

  const reportes = [
    { fecha: '2024-08-01', nombre: 'Reporte Mensual Agosto', id: 1 },
    { fecha: '2024-07-01', nombre: 'Reporte Mensual Julio', id: 2 },
    { fecha: '2024-06-01', nombre: 'Reporte Mensual Junio', id: 3 },
  ];

  const handleDescargarReporte = (id) => {
    alert(`Descargando reporte con ID: ${id}`);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = reportes.map((reporte) => reporte.id);
      setSelectedReports(allIds);
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (id) => {
    setSelectedReports((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((reportId) => reportId !== id)
        : [...prevSelected, id]
    );
  };

  return (
    <div className={`detailed-reportes ${theme}`}>
      <NavegadorDeGraficos onTabChange={onTabChange} activeTab={activeTab} theme={theme} />
      <h1 className="reportes-titulo">Reportes Detallados</h1>
      <div className="reportes-buttons">
        <button
          onClick={handleOpenRecurrentModal}
          className={`btn-generar-reporte ${theme}`}
        >
          Generar Reporte Recurrente
        </button>
        <button
          onClick={handleOpenActualModal}
          className={`btn-generar-reporte ${theme}`}
        >
          Generar Reporte Actual
        </button>
      </div>
      <table className="tabla-reportes">
        <thead>
          <tr>
            <th className="reportes-checkbox-col">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedReports.length === reportes.length}
              />
            </th>
            <th>ID</th>
            <th>Título</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.id}>
              <td className="reportes-checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedReports.includes(reporte.id)}
                  onChange={() => handleSelectReport(reporte.id)}
                />
              </td>
              <td>{reporte.id}</td>
              <td>{reporte.nombre}</td>
              <td>{reporte.fecha}</td>
              <td>
                <button
                  onClick={() => handleDescargarReporte(reporte.id)}
                  className={`reportes-btn-descargar ${theme}`}
                >
                  Descargar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="reportes-pagination">
        <button className="reportes-pagination-btn">Anterior</button>
        <span>Página 1 de 1</span>
        <button className="reportes-pagination-btn">Siguiente</button>
      </div>
      <ModalGenerarReporteRecurrente
        isOpen={isRecurrentModalOpen}
        onClose={handleCloseRecurrentModal}
        theme={theme}
      />
      <ModalGenerarReporteActual
        isOpen={isActualModalOpen}
        onClose={handleCloseActualModal}
        theme={theme}
      />
    </div>
  );
}

export default DetailedReportes;
