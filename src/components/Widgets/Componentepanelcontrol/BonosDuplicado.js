import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './widgetbonosDuplicado.css';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const BonosDuplicado = ({ isEditMode, theme }) => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    numero: true,
    fecha: true,
    estado: true,
    beneficiario: true,
    monto: true,
    tipo: true,
  });

  const [newBono, setNewBono] = useState({
    numero: '',
    fecha: '',
    estado: 'Pendiente',
    beneficiario: '',
    monto: 0,
    tipo: '',
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/bonos/`)
      .then((response) => {
        setData(response.data);
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
    newData[index].estado =
      newData[index].estado === 'Activo' ? 'Pendiente' : 'Activo';
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
      numero: newBono.numero || data.length + 1,
      fecha: newBono.fecha || new Date().toLocaleDateString(),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bonos/`, createdBono);
      setData([...data, response.data]);

      setNewBono({
        numero: '',
        fecha: '',
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
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-popup-btn" onClick={handleClosePopup}>
              X
            </button>
            <form className="create-bono-form">
              {visibleColumns.numero && (
                <div className="form-group">
                  <label htmlFor="numero">Número de Bono</label>
                  <input
                    type="text"
                    name="numero"
                    id="numero"
                    placeholder="Número de Bono"
                    value={newBono.numero}
                    onChange={handleInputChange}
                    className={`input-${theme}`}
                  />
                </div>
              )}

              {visibleColumns.fecha && (
                <div className="form-group">
                  <label htmlFor="fecha">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    id="fecha"
                    value={newBono.fecha}
                    onChange={handleInputChange}
                    className={`input-${theme}`}
                  />
                </div>
              )}

              {visibleColumns.estado && (
                <div className="form-group">
                  <label htmlFor="estado">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    id="estado"
                    value={newBono.estado}
                    onChange={handleInputChange}
                    className={`input-${theme}`}
                  />
                </div>
              )}

              {visibleColumns.beneficiario && (
                <div className="form-group">
                  <label htmlFor="beneficiario">Beneficiario</label>
                  <input
                    type="text"
                    name="beneficiario"
                    id="beneficiario"
                    placeholder="Beneficiario"
                    value={newBono.beneficiario}
                    onChange={handleInputChange}
                    className={`input-${theme}`}
                  />
                </div>
              )}

              {visibleColumns.monto && (
                <div className="form-group">
                  <label htmlFor="monto">Importe</label>
                  <input
                    type="number"
                    name="monto"
                    id="monto"
                    placeholder="Monto"
                    value={newBono.monto}
                    onChange={handleInputChange}
                    className={`input-${theme}`}
                  />
                </div>
              )}

              {visibleColumns.tipo && (
                <div className="form-group">
                  <label htmlFor="tipo">Tipo de Bono</label>
                  <input
                    type="text"
                    name="tipo"
                    id="tipo"
                    placeholder="Tipo de Bono"
                    value={newBono.tipo}
                    onChange={handleInputChange}
                    className={`input-${theme}`}
                  />
                </div>
              )}
            </form>
            <button className={`create-btn ${theme}`} onClick={handleCreateBono}>
              Crear Bono
            </button>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            {visibleColumns.numero && <th>Número de Bono</th>}
            {visibleColumns.fecha && <th>Fecha</th>}
            {visibleColumns.estado && <th>Estado</th>}
            {visibleColumns.beneficiario && <th>Beneficiario</th>}
            {visibleColumns.monto && <th>Importe</th>}
            {visibleColumns.tipo && <th>Tipo de Bono</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              {visibleColumns.numero && <td>{item.numero}</td>}
              {visibleColumns.fecha && <td>{item.fecha}</td>}
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
