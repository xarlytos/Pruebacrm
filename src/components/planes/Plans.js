import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './Popup';
import PlansTrade from './PlansTrade'; // Import PlansTrade component

function Plans() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    type: 'fixed',
    rate: 0,
    startDate: '',
    frequency: 'weekly',
    contractDuration: 1,
    hourlyRate: 0,
    sessionsPerWeek: 0,
    paymentDay: '',
  });
  const [isIndefinitePlan, setIsIndefinitePlan] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTradePopupOpen, setIsTradePopupOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5005/plans/fixed')
      .then(response => setPlans(response.data))
      .catch(error => console.error(error));

    axios.get('http://localhost:5005/plans/variable')
      .then(response => setPlans(prevPlans => [...prevPlans, ...response.data]))
      .catch(error => console.error(error));
  }, []);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setIsPopupOpen(true);
  };

  const handleTradePlan = (plan) => {
    setSelectedPlan(plan);
    setIsTradePopupOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (selectedPlan) {
      setSelectedPlan({ ...selectedPlan, [name]: value });
    } else {
      if (name === 'indefinitePlan') {
        setIsIndefinitePlan(event.target.checked);
        setNewPlan({ ...newPlan, contractDuration: event.target.checked ? 99 : newPlan.contractDuration });
      } else {
        setNewPlan({ ...newPlan, [name]: value });
      }
    }
  };

  const handleUpdatePlan = () => {
    const endpoint = selectedPlan.hourlyRate ? 'variable' : 'fixed';
    axios.put(`http://localhost:5005/plans/${endpoint}/${selectedPlan._id}`, selectedPlan)
      .then(response => {
        const updatedPlans = plans.map(plan => plan._id === selectedPlan._id ? response.data : plan);
        setPlans(updatedPlans);
        setIsPopupOpen(false);
      })
      .catch(error => console.error('Error updating plan:', error));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const planData = newPlan.type === 'fixed' ? {
      name: newPlan.name,
      rate: newPlan.rate,
      startDate: newPlan.startDate,
      frequency: newPlan.frequency || 'weekly',
      contractDuration: isIndefinitePlan ? 99 : newPlan.contractDuration,
      paymentDay: newPlan.paymentDay,
      sessionsPerWeek: newPlan.sessionsPerWeek,
      status: 'active'
    } : {
      name: newPlan.name,
      hourlyRate: newPlan.hourlyRate,
      startDate: newPlan.startDate,
      paymentDay: newPlan.paymentDay,
      status: 'active'
    };

    const endpoint = newPlan.type === 'fixed' ? 'fixed' : 'variable';

    axios.post(`http://localhost:5005/plans/${endpoint}`, planData)
      .then(response => setPlans([...plans, response.data]))
      .catch(error => console.error(error));
  };

  const handleDeletePlan = (planId) => {
    const endpoint = plans.find(plan => plan._id === planId).hourlyRate ? 'variable' : 'fixed';
    axios.delete(`http://localhost:5000/plans/${endpoint}/${planId}`)
      .then(() => {
        setPlans(plans.filter(plan => plan._id !== planId));
      })
      .catch(error => console.error('Error deleting plan:', error));
  };

  return (
    <div>
      <h1>Plans</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Plan Name</label>
        <input
          type="text"
          name="name"
          value={newPlan.name}
          onChange={handleInputChange}
          placeholder="Plan Name"
          required
        />
        <label htmlFor="type">Plan Type</label>
        <select name="type" value={newPlan.type} onChange={handleInputChange}>
          <option value="fixed">Fixed Plan</option>
          <option value="variable">Variable Plan</option>
        </select>
        {newPlan.type === 'fixed' ? (
          <>
            <label htmlFor="rate">Rate</label>
            <input
              type="number"
              name="rate"
              value={newPlan.rate}
              onChange={handleInputChange}
              placeholder="Rate"
              required
            />
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={newPlan.startDate}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="paymentDay">Payment Day</label>
            <select
              name="paymentDay"
              value={newPlan.paymentDay}
              onChange={handleInputChange}
              required
            >
              {[...Array(30).keys()].map(day => (
                <option key={day + 1} value={day + 1}>{day + 1}</option>
              ))}
            </select>
            <label htmlFor="frequency">Frequency</label>
            <select
              name="frequency"
              value={newPlan.frequency}
              onChange={handleInputChange}
              required
            >
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <label htmlFor="contractDuration">Contract Duration</label>
            <input
              type="number"
              name="contractDuration"
              value={isIndefinitePlan ? 99 : newPlan.contractDuration}
              onChange={handleInputChange}
              placeholder="Contract Duration"
              required
              disabled={isIndefinitePlan}
            />
            <label>
              <input
                type="checkbox"
                name="indefinitePlan"
                checked={isIndefinitePlan}
                onChange={handleInputChange}
              />
              Plan indefinido
            </label>
            <label htmlFor="sessionsPerWeek">Sessions Per Week</label>
            <input
              type="number"
              name="sessionsPerWeek"
              value={newPlan.sessionsPerWeek}
              onChange={handleInputChange}
              placeholder="Sessions Per Week"
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="hourlyRate">Hourly Rate</label>
            <input
              type="number"
              name="hourlyRate"
              value={newPlan.hourlyRate}
              onChange={handleInputChange}
              placeholder="Hourly Rate"
              required
            />
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={newPlan.startDate}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="paymentDay">Payment Day</label>
            <select
              name="paymentDay"
              value={newPlan.paymentDay}
              onChange={handleInputChange}
              required
            >
              {[...Array(30).keys()].map(day => (
                <option key={day + 1} value={day + 1}>{day + 1}</option>
              ))}
            </select>
          </>
        )}
        <button type="submit">Add Plan</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(plan => (
            <tr key={plan._id}>
              <td onClick={() => handleSelectPlan(plan)}>{plan.name}</td>
              <td onClick={() => handleSelectPlan(plan)}>{plan.hourlyRate ? 'Variable Plan' : 'Fixed Plan'}</td>
              <td onClick={() => handleSelectPlan(plan)}>{plan.status}</td>
              <td>
                <button onClick={() => handleSelectPlan(plan)}>Edit</button>
                <button onClick={() => handleDeletePlan(plan._id)}>Delete</button>
                <button onClick={() => handleTradePlan(plan)}>Trade</button> {/* Trade button */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        {selectedPlan && (
          <div>
            <h2>Edit Plan</h2>
            <form>
              <label htmlFor="name">Plan Name</label>
              <input
                type="text"
                name="name"
                value={selectedPlan.name}
                onChange={handleInputChange}
                placeholder="Plan Name"
                required
              />
              {selectedPlan.hourlyRate ? (
                <>
                  <label htmlFor="hourlyRate">Hourly Rate</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={selectedPlan.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="Hourly Rate"
                    required
                  />
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={selectedPlan.startDate}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="paymentDay">Payment Day</label>
                  <select
                    name="paymentDay"
                    value={selectedPlan.paymentDay}
                    onChange={handleInputChange}
                    required
                  >
                    {[...Array(30).keys()].map(day => (
                      <option key={day + 1} value={day + 1}>{day + 1}</option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label htmlFor="rate">Rate</label>
                  <input
                    type="number"
                    name="rate"
                    value={selectedPlan.rate}
                    onChange={handleInputChange}
                    placeholder="Rate"
                    required
                  />
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={selectedPlan.startDate}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="paymentDay">Payment Day</label>
                  <select
                    name="paymentDay"
                    value={selectedPlan.paymentDay}
                    onChange={handleInputChange}
                    required
                  >
                    {[...Array(30).keys()].map(day => (
                      <option key={day + 1} value={day + 1}>{day + 1}</option>
                    ))}
                  </select>
                  <label htmlFor="frequency">Frequency</label>
                  <select
                    name="frequency"
                    value={selectedPlan.frequency}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <label htmlFor="contractDuration">Contract Duration</label>
                  <input
                    type="number"
                    name="contractDuration"
                    value={selectedPlan.contractDuration}
                    onChange={handleInputChange}
                    placeholder="Contract Duration"
                    required
                  />
                  <label htmlFor="sessionsPerWeek">Sessions Per Week</label>
                  <input
                    type="number"
                    name="sessionsPerWeek"
                    value={selectedPlan.sessionsPerWeek}
                    onChange={handleInputChange}
                    placeholder="Sessions Per Week"
                    required
                  />
                </>
              )}
              <label htmlFor="status">Status</label>
              <select
                name="status"
                value={selectedPlan.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button type="button" onClick={handleUpdatePlan}>Update Plan</button>
            </form>
          </div>
        )}
      </Popup>
      <Popup isOpen={isTradePopupOpen} onClose={() => setIsTradePopupOpen(false)}> {/* Trade Popup */}
        {selectedPlan && <PlansTrade plan={selectedPlan} />} {/* Render PlansTrade component */}
      </Popup>
    </div>
  );
}

export default Plans;
