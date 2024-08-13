import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Listaderutinas.css';
import FileTable from './FileTable';
import PopupDeCreacionDePlanificacion from './PopupDeCreacionDePlanificacion';

const Listaderutinas = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [planToAssociate, setPlanToAssociate] = useState(null);
  const [viewFiles, setViewFiles] = useState(false);

  const predefinedMetas = [
    'cardio', 'fuerza', 'hipertrofia', 'resistencia', 'movilidad',
    'coordinación', 'definición', 'recomposición', 'rehabilitación'
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/routines');
        if (Array.isArray(response.data)) {
          setPlans(response.data);
          console.log('Fetched plans:', response.data);
        } else {
          console.error('Unexpected response data for plans:', response.data);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clientes');
        if (Array.isArray(response.data)) {
          setClients(response.data);
          console.log('Fetched clients:', response.data);
        } else {
          console.error('Unexpected response data for clients:', response.data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchPlans();
    fetchClients();
  }, []);

  const handleEditPlan = (planId) => {
    navigate(`/edit-routine/${planId}`, { state: { theme } });
  };

  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`/api/routines/${planId}`);
      setPlans(plans.filter((plan) => plan._id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleAssociateClient = async (planId, clientId) => {
    try {
      await axios.put(`/api/clientes/${clientId}/rutinas/${planId}`);
      
      setPlanToAssociate(null);
      setSelectedClientId(null);

      const updatedPlans = await axios.get('/api/routines');
      setPlans(updatedPlans.data);
    } catch (error) {
      console.error('Error associating client to plan:', error);
    }
  };

  const filteredPlans = Array.isArray(plans) ? plans.filter((plan) =>
    plan.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getAvailableClients = (plan) => {
    const associatedClientIds = plan.cliente ? [plan.cliente._id] : [];
    return clients.filter(client => !associatedClientIds.includes(client._id));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-mode', newTheme === 'dark');
  };

  return (
    <div className={`listaderutinas-contenedor ${theme}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Planificaciones</h2>
        <div>
          <button
            className="button"
            onClick={() => setShowPopup(true)}
          >
            Crear Planificación
          </button>
          <button
            className="button"
            onClick={toggleTheme}
          >
            Cambiar Tema
          </button>
          <button
            className="button"
            onClick={() => setViewFiles(!viewFiles)}
          >
            {viewFiles ? 'Ver Planificaciones' : 'Ver Archivos'}
          </button>
        </div>
      </div>
      {viewFiles ? (
        <FileTable theme={theme} />
      ) : (
        <>
          <input
            className={`input ${theme}`}
            type="text"
            placeholder="Buscar planificaciones"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="overflow-x-auto">
            <table className={`listaderutinas-table ${theme}`}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Duración</th>
                  <th>Fecha de Inicio</th>
                  <th>Meta</th>
                  <th>Clientes Asociados</th>
                  <th className="listaderutinas-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan._id}>
                    <td>{plan.nombre}</td>
                    <td>{plan.descripcion}</td>
                    <td>{plan.duracion}</td>
                    <td>{plan.fechaInicio}</td>
                    <td>{plan.meta}</td>
                    <td>
                      {plan.cliente ? plan.cliente.nombre : 'No asociado'}
                      {console.log('Clientes asociados a la planificación:', plan.cliente)}
                    </td>
                    <td className="listaderutinas-actions">
                      <div className="listaderutinas-dropdown">
                        <button className="listaderutinas-dropbtn">⋮</button>
                        <div className="listaderutinas-dropdown-content">
                          <a href="#" onClick={() => handleEditPlan(plan._id)}>Editar</a>
                          <a href="#" onClick={() => handleDeletePlan(plan._id)}>Borrar</a>
                          <a href="#" onClick={() => setPlanToAssociate(plan._id)}>Asociar Cliente</a>
                        </div>
                      </div>
                      {planToAssociate === plan._id && (
                        <div className="mt-2">
                          <select
                            className="input"
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                          >
                            <option value="">Seleccione un cliente</option>
                            {getAvailableClients(plan).map((client) => (
                              <option key={client._id} value={client._id}>
                                {client.nombre}
                              </option>
                            ))}
                          </select>
                          <button
                            className="button mt-2"
                            onClick={() => handleAssociateClient(plan._id, selectedClientId)}
                          >
                            Asociar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <PopupDeCreacionDePlanificacion
        show={showPopup}
        onClose={() => setShowPopup(false)}
        predefinedMetas={predefinedMetas}
        theme={theme}  // Pasar el tema como prop
      />
    </div>
  );
};

export default Listaderutinas;
