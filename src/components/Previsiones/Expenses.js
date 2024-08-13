import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, format } from 'date-fns';
import './expenses.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import PopupExpenses from './PopupExpenses';
import axios from 'axios';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [clients, setClients] = useState([]);
  const [fixedPlans, setFixedPlans] = useState([]);
  const [variablePlans, setVariablePlans] = useState([]);
  const [newExpense, setNewExpense] = useState({
    concept: '',
    description: '',
    amount: '',
    status: '',
    category: '',
    date: '',
    frequency: '',
    duration: '',
    client: '',
    plan: ''
  });
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    status: ''
  });

  const [categories, setCategories] = useState(['Alquiler', 'Personal/ Salarios', 'Facturas', 'Material']);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const [showDateRange, setShowDateRange] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchClients();
    fetchFixedPlans();
    fetchVariablePlans();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clients');
      setClients(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFixedPlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/plans/fixed');
      setFixedPlans(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVariablePlans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/plans/variable');
      setVariablePlans(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleDateRangeChange = (ranges) => {
    const { selection } = ranges;
    setDateRange([selection]);
    setFilters({
      ...filters,
      startDate: selection.startDate,
      endDate: selection.endDate
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/expenses', newExpense);
      fetchExpenses();
      setNewExpense({
        concept: '',
        description: '',
        amount: '',
        status: '',
        category: '',
        date: '',
        frequency: '',
        duration: '',
        client: '',
        plan: ''
      });
      setShowPopup(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/expenses/update-status/${id}`, { status });
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };
  
  const addCategory = (category) => {
    setCategories([...categories, category]);
  };

  const editCategory = (oldCategory, newCategory) => {
    setCategories(categories.map(cat => (cat === oldCategory ? newCategory : cat)));
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesStartDate = filters.startDate ? new Date(expense.date) >= new Date(filters.startDate) : true;
    const matchesEndDate = filters.endDate ? new Date(expense.date) <= new Date(filters.endDate) : true;
    const matchesCategory = filters.category ? expense.category === filters.category : true;
    const matchesStatus = filters.status ? expense.status === filters.status : true;
    return matchesStartDate && matchesEndDate && matchesCategory && matchesStatus;
  });

  const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  const paidExpenses = filteredExpenses.filter(expense => expense.status === 'Pagado').reduce((total, expense) => total + expense.amount, 0);
  const unpaidExpenses = filteredExpenses.filter(expense => expense.status === 'No pagado').reduce((total, expense) => total + expense.amount, 0);

  const downloadCSV = () => {
    window.location.href = 'http://localhost:5000/api/expenses/export/csv';
  };

  return (
    <div className="Expenses-container">
      <h2>Gastos</h2>
      <div className="Expenses-filters">
        <input 
          type="text" 
          value={`${format(dateRange[0].startDate, 'dd/MM/yyyy')} - ${format(dateRange[0].endDate, 'dd/MM/yyyy')}`} 
          readOnly 
          onClick={() => setShowDateRange(!showDateRange)} 
        />
        {showDateRange && (
          <DateRange
            ranges={dateRange}
            onChange={handleDateRangeChange}
            dateDisplayFormat="dd/MM/yyyy"
          />
        )}
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">Categoría</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Estado de Pago</option>
          <option value="Pagado">Pagado</option>
          <option value="No pagado">No pagado</option>
        </select>
      </div>
      <div className="Expenses-summary">
        <div><strong>Total Gastos:</strong> {totalExpenses} €</div>
        <div><strong>Pagado:</strong> {paidExpenses} €</div>
        <div><strong>No pagado:</strong> {unpaidExpenses} €</div>
      </div>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
      >
        Añadir Gasto
      </button>
      <button
        type="button"
        onClick={downloadCSV}
      >
        Descargar CSV
      </button>
      <PopupExpenses 
        show={showPopup} 
        handleClose={() => setShowPopup(false)} 
        handleSubmit={handleSubmit} 
        handleChange={handleChange} 
        newExpense={newExpense} 
        categories={categories} 
        clients={clients} // Pasar los clientes al componente PopupExpenses
        fixedPlans={fixedPlans} // Pasar los planes fijos al componente PopupExpenses
        variablePlans={variablePlans} // Pasar los planes variables al componente PopupExpenses
        addCategory={addCategory}
        editCategory={editCategory}
      />
      <table className="Expenses-table">
        <thead>
          <tr>
            <th>Fecha de Pago</th>
            <th>Categoría</th>
            <th>Concepto</th>
            <th>Importe</th>
            <th>Estado de Pago</th>
            <th>Tipo de Gasto</th>
            <th>Cliente</th>
            <th>Plan</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense, index) => (
            <tr key={index}>
              <td>{format(new Date(expense.date), 'dd/MM/yyyy')}</td>
              <td>{expense.category}</td>
              <td>{expense.concept}</td>
              <td>{expense.amount} €</td>
              <td>
                <select
                  value={expense.status}
                  onChange={(e) => handleStatusChange(expense._id, e.target.value)}
                  className="Expenses-status-select"
                >
                  <option value="Pagado">Pagado</option>
                  <option value="No pagado">No pagado</option>
                </select>
              </td>
              <td>{expense.client ? 'Cliente' : 'Plan'}</td>
              <td>{expense.client ? `${expense.client.firstName} ${expense.client.lastName}` : '-'}</td>
              <td>{expense.plan ? expense.plan.name : '-'}</td>
              <td>
                <button onClick={() => handleStatusChange(expense._id, expense.status === 'Pagado' ? 'No pagado' : 'Pagado')} className="Expenses-change-status-button">
                  Cambiar estado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Expenses;
