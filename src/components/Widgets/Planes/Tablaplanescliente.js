import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tablaplanescliente.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import Modalcreacionplanes from './Modalcreacionplanes';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const Tablaplanescliente = ({ isEditMode, onTitleClick }) => {
  const [fixedPlans, setFixedPlans] = useState([]);
  const [variablePlans, setVariablePlans] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    email: true,
    telefono: true,
    plan: true,
    clientes: true,
    precio: true,
    duracion: true,
  });
  const [currentTable, setCurrentTable] = useState('planes');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [planToAssociate, setPlanToAssociate] = useState(null);
  const [selectedClient, setSelectedClient] = useState('');

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      const [clientesResponse, fixedResponse, variableResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/clientes`),
        axios.get(`${API_BASE_URL}/plans/fixed`),
        axios.get(`${API_BASE_URL}/plans/variable`),
      ]);

      console.log('Clientes:', clientesResponse.data);
      console.log('Fixed plans:', fixedResponse.data);
      console.log('Variable plans:', variableResponse.data);

      setClientes(clientesResponse.data);
      setFixedPlans(fixedResponse.data);
      setVariablePlans(variableResponse.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered. Current table:', currentTable);
    fetchData();
  }, [currentTable]);

  const handleOpenCreatePlanModal = () => {
    setShowCreatePlanModal(true);
  };

  const handleCloseCreatePlanModal = () => {
    setShowCreatePlanModal(false);
    fetchData();
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
    console.log('Filter text changed:', e.target.value);
  };

  const handleColumnToggle = (column) => {
    const updatedColumns = { ...visibleColumns, [column]: !visibleColumns[column] };
    setVisibleColumns(updatedColumns);
    console.log('Column visibility toggled:', updatedColumns);
  };

  const handleChangeTable = (table) => {
    console.log('Table changed to:', table);
    setCurrentTable(table);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    console.log('Sorting by:', key, 'Direction:', direction);
  };

  const combinedPlans = [...fixedPlans, ...variablePlans];
  console.log('Combined plans:', combinedPlans);

  const sortedData = currentTable === 'planes' ? [...combinedPlans] : [...clientes];
  console.log('Sorted data:', sortedData);

  const filteredData = sortedData.filter(item =>
    Object.values(item).some(val =>
      val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );
  console.log('Filtered data:', filteredData);

  const handleCheckboxChange = (plan) => {
    const isSelected = selectedPlans.includes(plan);
    if (isSelected) {
      setSelectedPlans(selectedPlans.filter(p => p !== plan));
    } else {
      setSelectedPlans([...selectedPlans, plan]);
    }
    console.log('Selected plans:', selectedPlans);
  };

  const handleDeleteSelectedPlans = async () => {
    const deletePromises = selectedPlans.map(plan => {
      const isFixedPlan = plan.contractDuration || plan.frequency;
      const deleteUrl = isFixedPlan
        ? `${API_BASE_URL}/plans/fixed/${plan._id}`
        : `${API_BASE_URL}/plans/variable/${plan._id}`;
      
      console.log('Deleting plan at:', deleteUrl);
      return axios.delete(deleteUrl);
    });
  
    try {
      await Promise.all(deletePromises);
      setFixedPlans(fixedPlans.filter(plan => !selectedPlans.includes(plan)));
      setVariablePlans(variablePlans.filter(plan => !selectedPlans.includes(plan)));
      setSelectedPlans([]);
      console.log('Selected plans deleted successfully');
    } catch (error) {
      console.error('Error al borrar los planes:', error);
    }
  };

  const renderClientColumn = (planId) => {
    const client = clientes.find(cliente => cliente.associatedPlans.includes(planId));
    console.log('Rendering client for Plan ID:', planId, 'Found client:', client);
    return client ? client.nombre : 'N/A';
  };

  const handleDeletePlan = (plan) => {
    console.log('Plan selected for deletion:', plan);
    setShowDeletePopup(true);
    setPlanToDelete(plan);
  };

  const confirmDeletePlan = async () => {
    try {
      const deleteUrl = planToDelete.contractDuration || planToDelete.frequency 
        ? `${API_BASE_URL}/plans/fixed/${planToDelete._id}` 
        : `${API_BASE_URL}/plans/variable/${planToDelete._id}`;
      
      console.log('Deleting plan at:', deleteUrl);
      await axios.delete(deleteUrl);
      setFixedPlans(fixedPlans.filter(plan => plan._id !== planToDelete._id));
      setVariablePlans(variablePlans.filter(plan => plan._id !== planToDelete._id));
      console.log('Plan deleted successfully');
    } catch (error) {
      console.error('Error al borrar el plan:', error);
    }
    setShowDeletePopup(false);
    setPlanToDelete(null);
  };

  const cancelDeletePlan = () => {
    console.log('Deletion cancelled');
    setShowDeletePopup(false);
    setPlanToDelete(null);
  };

  const handleAssociatePlanToClient = (plan) => {
    console.log('Plan selected for association:', plan);
    const planType = plan.hours_worked ? 'VariablePlan' : 'FixedPlan';
    setPlanToAssociate({
      ...plan,
      planType
    });
  };

  const handleClientSelection = (e) => {
    setSelectedClient(e.target.value);
    console.log('Client selected:', e.target.value);
  };

  const confirmAssociatePlan = async () => {
    if (!planToAssociate || !selectedClient) {
        console.error('Plan or Client is not selected');
        return;
    }

    const planId = planToAssociate._id;
    const planType = planToAssociate.hours_worked ? 'VariablePlan' : 'FixedPlan';

    if (!planId || !planType) {
        console.error('Plan ID or Plan Type is missing');
        return;
    }

    console.log('Associating plan', planId, 'with client', selectedClient, 'and plan type', planType);

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/clientes/${selectedClient}/plan`,
            {
                planId,
                planType
            }
        );
        console.log('Plan asociado exitosamente:', response.data);
    } catch (error) {
        console.error('Error associating plan:', error);
    }
  };

  const cancelAssociatePlan = () => {
    console.log('Association cancelled');
    setPlanToAssociate(null);
    setSelectedClient('');
  };

  const handleUnassociatePlan = async (clienteId, planId) => {
    try {
      console.log('Unassociating plan with ID:', planId, 'from client with ID:', clienteId);
      await axios.put(`${API_BASE_URL}/api/clientes/${clienteId}/desasociar-plan`, { planId });
      setClientes(clientes.map(cliente => 
        cliente._id === clienteId 
          ? { ...cliente, associatedPlans: cliente.associatedPlans.filter(id => id !== planId) }
          : cliente
      ));
      console.log('Client unassociated from plan successfully');
    } catch (error) {
      console.error('Error al desasociar el cliente del plan:', error);
    }
  };

  const renderPlanColumn = (cliente) => {
    const associatedPlan = combinedPlans.find(plan => cliente.associatedPlans.includes(plan._id));
    console.log('Rendering plan for Client ID:', cliente._id, 'Found plan:', associatedPlan);
    return associatedPlan ? associatedPlan.name : 'Sin plan asociado';
  };

  return (

    <div className="Tablaplanescliente-container">
      <h2 onClick={onTitleClick}>{currentTable === 'planes' ? 'Planes de Clientes' : 'Clientes'}</h2>
      <div className="Tablaplanescliente-controls">
        <input
          type="text"
          placeholder={`Buscar ${currentTable === 'planes' ? 'plan' : 'cliente'}...`}
          value={filterText}
          onChange={handleFilterChange}
        />
        <div className="Tablaplanescliente-button-group">
          <button onClick={() => handleChangeTable('planes')}>Tabla de Planes</button>
          <button onClick={() => handleChangeTable('clientes')}>Tabla de Clientes</button>
          {currentTable === 'planes' && (
            <>
              <button onClick={handleOpenCreatePlanModal}>Crear Plan</button>
              <button onClick={handleDeleteSelectedPlans} disabled={selectedPlans.length === 0}>Borrar Planes Seleccionados</button>
            </>
          )}
        </div>
        {isEditMode && (
          <ColumnDropdown
            selectedColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />
        )}
      </div>
      <div className="Tablaplanescliente-table-wrapper">
        <table>
          <thead>
            <tr>
              {currentTable === 'planes' ? (
                <>
                  <th></th>
                  {visibleColumns.nombre && <th onClick={() => handleSort('name')}>aaa</th>}
                  {visibleColumns.clientes && <th>Clientes</th>}
                  {visibleColumns.precio && <th>Precio</th>}
                  {visibleColumns.duracion && <th>Duración</th>}
                  <th>Opciones</th>
                </>
              ) : (
                <>
                  {visibleColumns.nombre && <th onClick={() => handleSort('nombre')}>Nombre del Cliente</th>}
                  {visibleColumns.email && <th onClick={() => handleSort('email')}>Correo Electrónico</th>}
                  {visibleColumns.telefono && <th onClick={() => handleSort('telefono')}>Teléfono</th>}
                  {visibleColumns.plan && <th onClick={() => handleSort('associatedPlans')}>Plan Asociado</th>}
                  <th>Opciones</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                {currentTable === 'planes' ? (
                  <>
                    <td><input type="checkbox" checked={selectedPlans.includes(item)} onChange={() => handleCheckboxChange(item)} /></td>
                    {visibleColumns.nombre && <td>{item.name}</td>}
                    {visibleColumns.clientes && <td>{renderClientColumn(item._id)}</td>}
                    {visibleColumns.precio && <td>{item.rate || item.hourlyRate}</td>}
                    {visibleColumns.duracion && <td>{item.contractDuration || 'N/A'}</td>}
                    <td>
                      <div className="dropdown">
                        <button className="dropbtn">...</button>
                        <div className="dropdown-menu">
                          <button onClick={() => handleDeletePlan(item)}>Eliminar Plan</button>
                          <button onClick={() => handleAssociatePlanToClient(item)}>Asociar a Cliente</button>
                        </div>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    {visibleColumns.nombre && <td>{item.nombre}</td>}
                    {visibleColumns.email && <td>{item.email}</td>}
                    {visibleColumns.telefono && <td>{item.telefono}</td>}
                    {visibleColumns.plan && <td>{renderPlanColumn(item)}</td>}
                    <td>
                      <button onClick={() => handleUnassociatePlan(item._id, item.associatedPlans[0])}>
                        Desasociar Cliente
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeletePopup && (
        <div className="Tablaplanescliente-popup">
          <div className="Tablaplanescliente-popup-content">
            <h3>¿Estás seguro de que quieres borrar este plan?</h3>
            <button onClick={confirmDeletePlan}>Sí</button>
            <button onClick={cancelDeletePlan}>No</button>
          </div>
        </div>
      )}
      {planToAssociate && (
        <div className="Tablaplanescliente-popup">
          <div className="Tablaplanescliente-popup-content">
            <h3>Selecciona un cliente para asociar el plan: {planToAssociate.name}</h3>
            <select value={selectedClient} onChange={handleClientSelection}>
              <option value="">Seleccionar Cliente</option>
              {clientes.map(client => (
                <option key={client._id} value={client._id}>{client.nombre}</option>
              ))}
            </select>
            <button onClick={confirmAssociatePlan}>Asociar</button>
            <button onClick={cancelAssociatePlan}>Cancelar</button>
          </div>
        </div>
      )}
      {showCreatePlanModal && (
        <Modalcreacionplanes onClose={handleCloseCreatePlanModal} />
      )}
    </div>
  );
};

export default Tablaplanescliente;
