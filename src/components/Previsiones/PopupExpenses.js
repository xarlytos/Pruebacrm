import React, { useState } from 'react';
import './popupexpense.css';
import { FaPen } from 'react-icons/fa';

function PopupExpenses({ show, handleClose, handleSubmit, handleChange, newExpense, categories, clients, fixedPlans, variablePlans, addCategory, editCategory }) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [indefiniteDuration, setIndefiniteDuration] = useState(false);

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory) {
      addCategory(newCategory);
      setNewCategory('');
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategory(category);
    setEditingCategoryValue(category);
  };

  const handleEditingCategoryChange = (e) => {
    setEditingCategoryValue(e.target.value);
  };

  const saveEditedCategory = () => {
    editCategory(editingCategory, editingCategoryValue);
    setEditingCategory(null);
  };

  const handleAssignToChange = (e) => {
    setAssignTo(e.target.value);
    handleChange({ target: { name: 'client', value: '' } });
    handleChange({ target: { name: 'plan', value: '' } });
    handleChange({ target: { name: 'frequency', value: '' } });
    handleChange({ target: { name: 'duration', value: '' } });
    handleChange({ target: { name: 'date', value: '' } });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setAssignTo('');
      handleChange({ target: { name: 'client', value: '' } });
      handleChange({ target: { name: 'plan', value: '' } });
    }
    handleChange(e);
  };

  const handleCheckboxChange = () => {
    setIndefiniteDuration(!indefiniteDuration);
    handleChange({ target: { name: 'duration', value: indefiniteDuration ? '' : 'indefinido' } });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (assignTo === '' && !newExpense.date) {
      alert('Por favor, asigne el gasto a un cliente, a un plan, o seleccione una fecha de pago.');
      return;
    }
    if (assignTo === 'client') {
      newExpense.plan = null;
    } else if (assignTo === 'plan') {
      newExpense.client = null;
    }
    handleSubmit(e);
  };

  return (
    <div className={`popup ${show ? 'show' : ''}`}>
      <div className="popup-inner">
        <h2>Añadir Gasto</h2>
        <form onSubmit={handleSubmitForm}>
          <input
            type="text"
            name="concept"
            value={newExpense.concept}
            onChange={handleFormChange}
            placeholder="Concepto"
            required
          />
          <textarea
            name="description"
            value={newExpense.description}
            onChange={handleFormChange}
            placeholder="Descripción"
            required
          />
          <input
            type="number"
            name="amount"
            value={newExpense.amount}
            onChange={handleFormChange}
            placeholder="Importe"
            required
          />
          <select
            name="status"
            value={newExpense.status}
            onChange={handleFormChange}
            required
          >
            <option value="">Seleccione Estado</option>
            <option value="Pagado">Pagado</option>
            <option value="No pagado">No pagado</option>
          </select>
          <div className="category-section">
            <div className="select-wrapper">
              <select
                name="category"
                value={newExpense.category}
                onChange={handleFormChange}
                required
              >
                <option value="">Seleccione Categoría</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
                <option value="new-category">Añadir nueva categoría</option>
              </select>
              {categories.map((category, index) => (
                <div key={index} className="category-option">
                  {editingCategory === category ? (
                    <input
                      type="text"
                      value={editingCategoryValue}
                      onChange={handleEditingCategoryChange}
                      onBlur={saveEditedCategory}
                      autoFocus
                    />
                  ) : (
                    <div className="category-name">
                      {category}
                      <FaPen onClick={() => startEditingCategory(category)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {newExpense.category === 'new-category' && (
              <div className="add-category">
                <input
                  type="text"
                  value={newCategory}
                  onChange={handleCategoryChange}
                  placeholder="Añadir categoría"
                />
                <button type="button" onClick={handleAddCategory}>+</button>
              </div>
            )}
          </div>
          <select
            name="assignTo"
            value={assignTo}
            onChange={handleAssignToChange}
            required={!newExpense.date}
          >
            <option value="">Asignar a</option>
            <option value="client">Cliente</option>
            <option value="plan">Plan</option>
          </select>
          {assignTo === 'client' && (
            <select
              name="client"
              value={newExpense.client}
              onChange={handleFormChange}
              required
            >
              <option value="">Seleccionar Cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          )}
          {assignTo === 'plan' && (
            <select
              name="plan"
              value={newExpense.plan}
              onChange={handleFormChange}
              required
            >
              <option value="">Seleccionar Plan</option>
              {[...fixedPlans, ...variablePlans].map((plan) => (
                <option key={plan._id} value={plan._id}>{plan.name}</option>
              ))}
            </select>
          )}
          {!assignTo && (
            <>
              <input
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleFormChange}
                required
              />
              <select
                name="frequency"
                value={newExpense.frequency}
                onChange={handleFormChange}
                required
              >
                <option value="">Seleccione Frecuencia</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Bisemanal</option>
                <option value="monthly">Mensual</option>
              </select>
              <input
                type="number"
                name="duration"
                value={newExpense.duration}
                onChange={handleFormChange}
                placeholder="Duración (en meses)"
                disabled={indefiniteDuration}
                required={!indefiniteDuration}
              />
              <label>
                <input
                  type="checkbox"
                  checked={indefiniteDuration}
                  onChange={handleCheckboxChange}
                />
                Duración indefinida
              </label>
            </>
          )}
          <button type="submit">Añadir Gasto</button>
        </form>
        <button className="close-btn" onClick={handleClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default PopupExpenses;
