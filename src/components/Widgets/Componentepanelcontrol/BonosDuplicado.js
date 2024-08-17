import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widgetbonosDuplicado.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';
import BonoCreationModal from './BonoCreationModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const BonosDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    nombre: true,
    fechaComienzo: true,
    fechaExpiracion: true,
    estado: true,
    beneficiario: true,
    monto: true,
    tipo: true,
  });

  const [newBono, setNewBono] = useState({
    nombre: '',
    fechaComienzo: '',
    fechaExpiracion: '',
    estado: 'Pendiente',
    beneficiario: '',
    monto: 0,
    tipo: '',
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false); // Estado para el checkbox del thead
  const [selectedRows, setSelectedRows] = useState([]); // Estado para checkboxes de cada fila

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/bonos/`)
      .then((response) => {
        setData(response.data);
        setSelectedRows(new Array(response.data.length).fill(false)); // Inicializar estado de checkboxes
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleColumnToggle = (column) => {
    setVisibleColumns({ ...visibleColumns, [column]: !visibleColumns[column] });
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    const estadosPosibles = ['Activo', 'No Activo', 'Pendiente'];
    let estadoActualIndex = estadosPosibles.indexOf(newData[index].estado);
    newData[index].estado = estadosPosibles[(estadoActualIndex + 1) % estadosPosibles.length];
    setData(newData);
  };

  const handleCreateBonoClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBono({ ...newBono, [name]: value });
  };

  const handleCreateBono = async () => {
    const createdBono = {
      ...newBono,
      nombre: newBono.nombre || `Bono ${(data.length + 1)}`,
      fechaComienzo: newBono.fechaComienzo || new Date().toISOString().split('T')[0],
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bonos/`, createdBono);
      setData([...data, response.data]);

      setNewBono({
        nombre: '',
        fechaComienzo: '',
        fechaExpiracion: '',
        estado: 'Pendiente',
        beneficiario: '',
        monto: 0,
        tipo: '',
      });

      handleClosePopup();
    } catch (error) {
      console.error('Error al crear el bono:', error);
    }
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

    // Si se desmarca cualquier checkbox de fila, desmarca el checkbox de selectAll
    if (!updatedSelectedRows[index]) {
      setSelectAll(false);
    } else if (updatedSelectedRows.every(row => row)) {
      // Si todos los checkboxes de fila están marcados, marca el checkbox de selectAll
      setSelectAll(true);
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) =>
      val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  return (
    <div className={`widget-bonosDup ${theme}`}>
      <h2 className={theme}>Bonos</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Buscar bono..."
          value={filterText}
          onChange={handleFilterChange}
          className={`input-${theme}`}
        />
        <button
          className={`filter-btn ${theme}`}
          onClick={handleCreateBonoClick}
        >
          Crear Bono
        </button>
        {isEditMode && (
          <ColumnDropdown
            selectedColumns={visibleColumns}
            handleColumnToggle={handleColumnToggle}
          />
        )}
      </div>

      {isPopupOpen && (
        <BonoCreationModal 
          visibleColumns={visibleColumns}
          newBono={newBono}
          handleInputChange={handleInputChange}
          handleClosePopup={handleClosePopup}
          handleCreateBono={handleCreateBono}
          theme={theme}
        />
      )}

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
            {visibleColumns.nombre && <th>Nombre de Bono</th>}
            {visibleColumns.fechaComienzo && <th>Fecha de Comienzo</th>}
            {visibleColumns.fechaExpiracion && <th>Fecha de Expiración</th>}
            {visibleColumns.estado && <th>Estado</th>}
            {visibleColumns.beneficiario && <th>Clientes asignados</th>}
            {visibleColumns.monto && <th>Importe</th>}
            {visibleColumns.tipo && <th>Tipo de Bono</th>}
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
              {visibleColumns.nombre && <td>{item.nombre}</td>}
              {visibleColumns.fechaComienzo && <td>{item.fechaComienzo}</td>}
              {visibleColumns.fechaExpiracion && <td>{item.fechaExpiracion}</td>}
              {visibleColumns.estado && <td>{item.estado}</td>}
              {visibleColumns.beneficiario && <td>{item.beneficiario}</td>}
              {visibleColumns.monto && <td>{item.monto}</td>}
              {visibleColumns.tipo && <td>{item.tipo}</td>}
              <td>
                <div className="dropdown options-dropdown">
                  <button className={`dropdown-toggle ${theme}`}>...</button>
                  <div className={`dropdown-menu ${theme}`}>
                    <button
                      className={`dropdown-item ${theme}`}
                      onClick={() => handleChangeStatus(index)}
                    >
                      Cambiar Estado
                    </button>
                    <button className={`dropdown-item ${theme}`}>Opción 2</button>
                    <button className={`dropdown-item ${theme}`}>Opción 3</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BonosDuplicado;
