import React, { useState } from 'react';
import './Campaigns.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MassPublishModal from './MassPublishModal';
import UploadPostsModal from './UploadPostsModal';
import CreateAdModal from './CreateAdModal';
import MassEmailModal from './MassEmailModal';
import KanbanViewModal from './KanbanViewModal';
import EmailCreationModal from './EmailCreationModal';

function Campaigns({ theme }) {
  const [activeTab, setActiveTab] = useState('organico');
  const [date, setDate] = useState(new Date());
  const [showMassPublishModal, setShowMassPublishModal] = useState(false);
  const [showUploadPostsModal, setShowUploadPostsModal] = useState(false);
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [showMassEmailModal, setShowMassEmailModal] = useState(false);
  const [showKanbanViewModal, setShowKanbanViewModal] = useState(false);
  const [showEmailCreationModal, setShowEmailCreationModal] = useState(false);

  const handleEditClick = () => {
    setShowKanbanViewModal(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'organico':
        return (
          <div className={`organico-container ${theme}`}>
            <Calendar className={theme} onChange={setDate} value={date} />
            <p>Fecha seleccionada: {date.toDateString()}</p>
            <div className={`campaigns-button-container ${theme}`}>
              <button className={`campaigns-action-button ${theme} button-publicacion-masiva`} onClick={() => setShowMassPublishModal(true)}>Publicación masiva</button>
              <button className={`campaigns-action-button ${theme} button-subir-publicaciones`} onClick={() => setShowUploadPostsModal(true)}>Subir publicaciones</button>
            </div>
          </div>
        );
      case 'anuncios':
        return (
          <div className={`anuncios-container ${theme}`}>
            <button className={`button-crear-anuncio ${theme}`} onClick={() => setShowCreateAdModal(true)}>Crear anuncio</button>
            <table className={`ad-table ${theme}`}>
              <thead>
                <tr>
                  <th className={`${theme}`}>Título</th>
                  <th className={`${theme}`}>Descripción</th>
                  <th className={`${theme}`}>Fecha</th>
                  <th className={`${theme}`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${theme}`}>Ejemplo de Anuncio</td>
                  <td className={`${theme}`}>Descripción del anuncio</td>
                  <td className={`${theme}`}>28/05/2024</td>
                  <td>
                    <button className={`button-editar ${theme}`}>Editar</button>
                    <button className={`button-eliminar ${theme}`}>Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'correos':
        return (
          <div className={`correos-container ${theme}`}>
            <div className={`campaigns-button-container ${theme}`}>
              <button className={`button-correo-masivo ${theme}`} onClick={() => setShowMassEmailModal(true)}>Correo masivo</button>
              <button className={`button-ia-creacion-correos ${theme}`} onClick={() => setShowEmailCreationModal(true)}>IA para creación de correos</button>
            </div>
            <table className={`email-table ${theme}`}>
              <thead>
                <tr>
                  <th className={`${theme}`}>Asunto</th>
                  <th className={`${theme}`}>Destinatarios</th>
                  <th className={`${theme}`}>Fecha</th>
                  <th className={`${theme}`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${theme}`}>Ejemplo de Correo</td>
                  <td className={`${theme}`}>ejemplo@correo.com</td>
                  <td className={`${theme}`}>28/05/2024</td>
                  <td>
                    <button className={`button-editar ${theme}`} onClick={handleEditClick}>Editar</button>
                    <button className={`button-eliminar ${theme}`}>Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`campaigns-container ${theme}`}>
      <div className={`campaigns-tab-container ${theme}`}>
        <button
          className={`campaigns-tab ${activeTab === 'organico' ? 'active' : ''} ${theme}`}
          onClick={() => setActiveTab('organico')}
        >
          Contenido orgánico
        </button>
        <button
          className={`campaigns-tab ${activeTab === 'anuncios' ? 'active' : ''} ${theme}`}
          onClick={() => setActiveTab('anuncios')}
        >
          Anuncios
        </button>
        <button
          className={`campaigns-tab ${activeTab === 'correos' ? 'active' : ''} ${theme}`}
          onClick={() => setActiveTab('correos')}
        >
          Correos masivos
        </button>
      </div>
      <div className={`campaigns-content-container ${theme}`}>
        {renderContent()}
      </div>
      {showMassPublishModal && <MassPublishModal onClose={() => setShowMassPublishModal(false)} />}
      {showUploadPostsModal && <UploadPostsModal onClose={() => setShowUploadPostsModal(false)} />}
      {showCreateAdModal && <CreateAdModal onClose={() => setShowCreateAdModal(false)} />}
      {showMassEmailModal && <MassEmailModal onClose={() => setShowMassEmailModal(false)} />}
      {showKanbanViewModal && <KanbanViewModal onClose={() => setShowKanbanViewModal(false)} />}
      {showEmailCreationModal && <EmailCreationModal onClose={() => setShowEmailCreationModal(false)} />}
    </div>
  );
}

export default Campaigns;
