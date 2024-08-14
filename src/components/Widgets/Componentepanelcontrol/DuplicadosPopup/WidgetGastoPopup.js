import React, { useState, useEffect } from 'react';
import './WidgetGastoPopup.css';

const WidgetGastoPopup = ({ theme, setTheme }) => {
  const [data, setData] = useState([]); 
  const [filterText, setFilterText] = useState('');
  const [isGastoDropdownOpen, setIsGastoDropdownOpen] = useState(false);
  const [newGasto, setNewGasto] = useState({
    concept: '',
    description: '',
    category: '',
    amount: '',
    status: '',
    date: '',
    frequency: '',
    duration: '',
    client: '',
    plan: '',
    planType: ''
  });

  // Hacer una solicitud para obtener los gastos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/expenses/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error al cargar los gastos:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const handleChangeStatus = (index) => {
    const newData = [...data];
    newData[index].status = newData[index].status === 'Pagado' ? 'Pendiente' : 'Pagado';
    setData(newData);
  };

  const toggleGastoDropdown = () => {
    setIsGastoDropdownOpen(!isGastoDropdownOpen);
  };

  const handleGastoChange = (e) => {
    const { name, value } = e.target;
    setNewGasto({ ...newGasto, [name]: value });
  };

  const handleAddGasto = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5005/api/expenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGasto)
      });

      if (!response.ok) {
        throw new Error('Error al crear el gasto');
      }

      const createdGasto = await response.json();
      setData([...data, createdGasto]);
      setNewGasto({
        concept: '',
        description: '',
        category: '',
        amount: '',
        status: '',
        date: '',
        frequency: '',
        duration: '',
        client: '',
        plan: '',
        planType: ''
      });
      setIsGastoDropdownOpen(false);
    } catch (error) {
      console.error('Error al añadir el gasto:', error);
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`popup-widget-gasto ${theme}`}>
      <h3 className="popup-gasto-title">Gastos</h3>
      <div className="controls">
        <input 
          type="text" 
          placeholder="Buscar gasto..." 
          value={filterText} 
          onChange={handleFilterChange} 
          className={`${theme}`}
        />
        <div className="gasto-button-container">
          <div className="dropdown">
            <button onClick={toggleGastoDropdown} className={`${theme}`}>Añadir Gasto</button>
            {isGastoDropdownOpen && (
              <div className={`dropdown-content ${theme}`}>
                <h3>Añadir Gasto</h3>
                <form onSubmit={handleAddGasto}>
                  <input 
                    type="text" 
                    name="concept" 
                    placeholder="Concepto" 
                    value={newGasto.concept} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                    required
                  />
                  <input 
                    type="text" 
                    name="description" 
                    placeholder="Descripción" 
                    value={newGasto.description} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                    required
                  />
                  <input 
                    type="text" 
                    name="category" 
                    placeholder="Categoría" 
                    value={newGasto.category} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                    required
                  />
                  <input 
                    type="number" 
                    name="amount" 
                    placeholder="Monto" 
                    value={newGasto.amount} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                    required
                  />
                  <input 
                    type="text" 
                    name="status" 
                    placeholder="Estado" 
                    value={newGasto.status} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                    required
                  />
                  <input 
                    type="date" 
                    name="date" 
                    placeholder="Fecha" 
                    value={newGasto.date} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                    required
                  />
                  <select 
                    name="frequency" 
                    value={newGasto.frequency} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  >
                    <option value="">Frecuencia</option>
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quincenal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                  <input 
                    type="number" 
                    name="duration" 
                    placeholder="Duración (meses)" 
                    value={newGasto.duration} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="client" 
                    placeholder="ID Cliente" 
                    value={newGasto.client} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <input 
                    type="text" 
                    name="plan" 
                    placeholder="ID Plan" 
                    value={newGasto.plan} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  />
                  <select 
                    name="planType" 
                    value={newGasto.planType} 
                    onChange={handleGastoChange} 
                    className={`${theme}`}
                  >
                    <option value="">Tipo de Plan</option>
                    <option value="FixedPlan">Plan Fijo</option>
                    <option value="VariablePlan">Plan Variable</option>
                  </select>
                  <button type="submit">Añadir</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Concepto</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Frecuencia</th>
            <th>Duración</th>
            <th>ID Cliente</th>
            <th>ID Plan</th>
            <th>Tipo de Plan</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{item.concept}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{item.amount}</td>
              <td>{item.status}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.frequency}</td>
              <td>{item.duration}</td>
              <td>{item.client}</td>
              <td>{item.plan}</td>
              <td>{item.planType}</td>
              <td>
                <div className="dropdown options-dropdown">
                  <button className={`dropdown-toggle options-btn ${theme}`}>...</button>
                  <div className={`dropdown-menu options-menu ${theme}`}>
                    <button className={`dropdown-item ${theme}`} onClick={() => handleChangeStatus(index)}>
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
      <button onClick={toggleTheme} className={`theme-toggle-btn ${theme}`}>Cambiar Tema</button>
    </div>
  );
};

export default WidgetGastoPopup;
