import React, { useState } from 'react';
import './TablaplanesclienteDuplicado.css';
import Modalcreacionplanes from './ModalcreacionplanesDuplicado';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import AsociarClientesDropdown from './AsociarClientesDropdown';

const planesData = [
  {
    id: 'P001',
    nombre: 'Plan Básico',
    clientes: 120,
    precio: '$10/mes',
    duracion: '1 mes'
  },
  {
    id: 'P002',
    nombre: 'Plan Pro',
    clientes: 75,
    precio: '$20/mes',
    duracion: '1 año'
  },
  {
    id: 'P003',
    nombre: 'Plan Empresarial',
    clientes: 30,
    precio: '$50/mes',
    duracion: '1 año'
  }
];

const initialClientesData = [
  {
    id: 'C001',
    nombre: 'Cliente A',
    plan: 'Plan Básico'
  },
  {
    id: 'C002',
    nombre: 'Cliente B',
    plan: 'Plan Pro'
  },
  {
    id: 'C003',
    nombre: 'Cliente C',
    plan: 'Plan Empresarial'
  },
  {
    id: 'C004',
    nombre: 'Cliente D',
    plan: null
  }
];

const TablaPlanesDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState(planesData);
  const [clientes, setClientes] = useState(initialClientesData);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    nombre: true,
    clientes: true,
    precio: true,
    duracion: true
  });
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAsociarClientes, setShowAsociarClientes] = useState(false);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
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
            <th></th>
            {visibleColumns.id && <th>ID</th>}
            {visibleColumns.nombre && <th>Nombre del Plan</th>}
            {visibleColumns.clientes && <th>Clientes</th>}
            {visibleColumns.precio && <th>Precio</th>}
            {visibleColumns.duracion && <th>Duración</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              {visibleColumns.id && <td>{item.id}</td>}
              {visibleColumns.nombre && <td>{item.nombre}</td>}
              {visibleColumns.clientes && <td>{item.clientes}</td>}
              {visibleColumns.precio && <td>{item.precio}</td>}
              {visibleColumns.duracion && <td>{item.duracion}</td>}
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
