import React, { useState, useEffect } from 'react';
import './TablaplanesclienteDuplicado.css';
import Modalcreacionplanes from './ModalcreacionplanesDuplicado';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import AsociarClientesDropdown from './AsociarClientesDropdown';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const TablaPlanesDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    nombre: true,
    clientes: true,
    precio: true,
    tipoPlan: true, 
  });
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAsociarClientes, setShowAsociarClientes] = useState(false);

  const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox del thead
  const [selectedRows, setSelectedRows] = useState([]); // Estado para checkboxes de cada fila

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const [planesFijosResponse, planesVariablesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/plans/fixed/`),
          fetch(`${API_BASE_URL}/plans/variable/`)
        ]);

        if (!planesFijosResponse.ok || !planesVariablesResponse.ok) {
          throw new Error('Error al obtener los planes');
        }

        const [planesFijos, planesVariables] = await Promise.all([
          planesFijosResponse.json(),
          planesVariablesResponse.json()
        ]);

        const combinedData = [
          ...planesFijos.map(plan => ({
            id: plan._id,
            nombre: plan.name,
            clientes: plan.client ? 1 : 0,
            precio: `$${plan.rate}/mes`,
            tipoPlan: 'Fijo',
          })),
          ...planesVariables.map(plan => ({
            id: plan._id,
            nombre: plan.name,
            clientes: plan.client ? 1 : 0,
            precio: `$${plan.hourlyRate}/hora`,
            tipoPlan: 'Variable',
          }))
        ];

        setData(combinedData);
        setSelectedRows(new Array(combinedData.length).fill(false)); // Inicializar estado de checkboxes
      } catch (error) {
        console.error('Error al obtener los planes:', error);
      }
    };

    fetchPlanes();
  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setSelectedRows(new Array(data.length).fill(isChecked));
  };

  const handleRowCheckboxChange = (index) => {
    const updatedSelectedRows = [...selectedRows];
    updatedSelectedRows[index] = !updatedSelectedRows[index];
    setSelectedRows(updatedSelectedRows);

    if (!updatedSelectedRows[index]) {
      setSelectAll(false);
    } else if (updatedSelectedRows.every(row => row)) {
      setSelectAll(true);
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleOpenCreatePlanModal = () => {
    setShowCreatePlanModal(true);
  };

  const handleCloseCreatePlanModal = () => {
    setShowCreatePlanModal(false);
  };

  const handleAsociarClientes = (plan) => {
    setSelectedPlan(plan);
    setShowAsociarClientes(true);
  };

  const handleCloseAsociarClientes = () => {
    setShowAsociarClientes(false);
    setSelectedPlan(null);
  };

  const handleTradeClientes = (clientesAsociadosIds, clientesNoAsociadosIds) => {
    const updatedClientes = clientes.map(cliente => {
      if (clientesAsociadosIds.includes(cliente.id)) {
        return { ...cliente, plan: null };
      }
      if (clientesNoAsociadosIds.includes(cliente.id)) {
        return { ...cliente, plan: selectedPlan.nombre };
      }
      return cliente;
    });

    setClientes(updatedClientes);
  };

  const clientesAsociados = clientes.filter(cliente => cliente.plan === selectedPlan?.nombre);
  const clientesNoAsociados = clientes.filter(cliente => cliente.plan !== selectedPlan?.nombre);

  return (
    <div className={`TablaplanesclienteDup-container ${theme}`}>
      <h2 className={theme}>Planes</h2>
      <div className="Tablaplanescliente-controls">
        <input
          type="text"
          placeholder="Buscar plan..."
          value={filterText}
          onChange={handleFilterChange}
          className={`input-${theme}`}
        />
        <div className="Tablaplanescliente-button-group">
          <button className={`button-${theme}`} onClick={handleOpenCreatePlanModal}>Crear Plan</button>
        </div>
        {isEditMode && (
          <ColumnDropdown
            selectedColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </th>
            {visibleColumns.id && <th>ID</th>}
            {visibleColumns.nombre && <th>Nombre del Plan</th>}
            {visibleColumns.clientes && <th>Clientes</th>}
            {visibleColumns.precio && <th>Precio</th>}
            {visibleColumns.tipoPlan && <th>Tipo de Plan</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows[index]}
                  onChange={() => handleRowCheckboxChange(index)}
                />
              </td>
              {visibleColumns.id && <td>{item.id}</td>}
              {visibleColumns.nombre && <td>{item.nombre}</td>}
              {visibleColumns.clientes && <td>{item.clientes}</td>}
              {visibleColumns.precio && <td>{item.precio}</td>}
              {visibleColumns.tipoPlan && <td>{item.tipoPlan}</td>}
              <td>
                <div className="Tablaplanescliente-dropdown Tablaplanescliente-options-dropdown">
                  <button className={`dropdown-toggle ${theme} options-btn`}>...</button>
                  <div className={`dropdown-menu ${theme} options-menu`}>
                    <button className={`dropdown-item ${theme}`}>Editar Plan</button>
                    <button
                      className={`dropdown-item ${theme}`}
                      onClick={() => handleAsociarClientes(item)}
                    >
                      Asociar Clientes
                    </button>
                    <button className={`dropdown-item ${theme}`}>Borrar Plan</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showCreatePlanModal && (
        <Modalcreacionplanes onClose={handleCloseCreatePlanModal} />
      )}
      {showAsociarClientes && (
        <div className="Tablaplanescliente-popup">
          <div className={`Tablaplanescliente-popup-content ${theme}`}>
            <AsociarClientesDropdown
              plan={selectedPlan}
              clientes={clientesAsociados}
              clientesNoAsociados={clientesNoAsociados}
              onTrade={handleTradeClientes}
            />
            <button onClick={handleCloseAsociarClientes}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaPlanesDuplicado;
