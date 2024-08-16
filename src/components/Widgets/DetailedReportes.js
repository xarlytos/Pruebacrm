import React, { useState } from 'react';
import NavegadorDeGraficos from './Componentepanelcontrol/NavegadorDeGraficos';
import ModalGenerarReporteRecurrente from './ModalGenerarReporteRecurrente';
import ModalGenerarReporteActual from './ModalGenerarReporteActual';
import './DetailedReportes.css';

function DetailedReportes({ theme, setTheme, onTabChange, activeTab }) {
  const [isRecurrentModalOpen, setIsRecurrentModalOpen] = useState(false);
  const [isActualModalOpen, setIsActualModalOpen] = useState(false);

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
  ];

  const handleDescargarReporte = (id) => {
    alert(`Descargando reporte con ID: ${id}`);
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
              <input type="checkbox" />
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
                <input type="checkbox" />
              </td>
              <td>{reporte.id}</td>
              <td>{reporte.nombre}</td>
              <td>{reporte.fecha}</td>
              <td>
                <button className="reportes-btn-acciones">...</button>
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
