import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PlansTrade({ plan }) {
  const [allClients, setAllClients] = useState([]);
  const [assignedClients, setAssignedClients] = useState([]);
  const [unassignedClients, setUnassignedClients] = useState([]);
  const [selectedAssignedClients, setSelectedAssignedClients] = useState([]);
  const [selectedUnassignedClients, setSelectedUnassignedClients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5005/api/clientes/plans')
      .then(response => {
        setAllClients(response.data);
        const assigned = response.data.filter(client => client.associatedPlans && client.associatedPlans.some(p => p._id === plan._id));
        const unassigned = response.data.filter(client => !client.associatedPlans || !client.associatedPlans.some(p => p._id === plan._id));
        setAssignedClients(assigned);
        setUnassignedClients(unassigned);
      })
      .catch(error => console.error(error));
  }, [plan._id]);

  const handleTrade = () => {
    const assignPromises = selectedUnassignedClients.map(clientId => {
      return axios.post(`http://localhost:5005/api/clientes/${clientId}/plan`, { planId: plan._id, planType: plan.hourlyRate ? 'VariablePlan' : 'FixedPlan' });
    });

    const unassignPromises = selectedAssignedClients.map(clientId => {
      return axios.delete(`http://localhost:5005/api/clientes/${clientId}/plan`, { data: { planId: plan._id } });
    });

    Promise.all([...assignPromises, ...unassignPromises])
      .then(() => {
        axios.get('http://localhost:5005/api/clientes/plans')
          .then(response => {
            setAllClients(response.data);
            const assigned = response.data.filter(client => client.associatedPlans && client.associatedPlans.some(p => p._id === plan._id));
            const unassigned = response.data.filter(client => !client.associatedPlans || !client.associatedPlans.some(p => p._id === plan._id));
            setAssignedClients(assigned);
            setUnassignedClients(unassigned);
            setSelectedAssignedClients([]);
            setSelectedUnassignedClients([]);
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  };

  const handleCheckboxChange = (clientId, isAssigned) => {
    if (isAssigned) {
      setSelectedAssignedClients(prevState =>
        prevState.includes(clientId) ? prevState.filter(id => id !== clientId) : [...prevState, clientId]
      );
    } else {
      setSelectedUnassignedClients(prevState =>
        prevState.includes(clientId) ? prevState.filter(id => id !== clientId) : [...prevState, clientId]
      );
    }
  };

  return (
    <div>
      <h2>Trade Plan</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>Assigned Clients</h3>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Client Name</th>
              </tr>
            </thead>
            <tbody>
              {assignedClients.map(client => (
                <tr key={client._id}>
                  <td>
                    <input
                      type="checkbox"
                      value={client._id}
                      onChange={() => handleCheckboxChange(client._id, true)}
                      checked={selectedAssignedClients.includes(client._id)}
                    />
                  </td>
                  <td>{client.nombre} {client.apellido || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button onClick={handleTrade}>Trade</button>
        </div>
        <div>
          <h3>Unassigned Clients</h3>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Client Name</th>
              </tr>
            </thead>
            <tbody>
              {unassignedClients.map(client => (
                <tr key={client._id}>
                  <td>
                    <input
                      type="checkbox"
                      value={client._id}
                      onChange={() => handleCheckboxChange(client._id, false)}
                      checked={selectedUnassignedClients.includes(client._id)}
                    />
                  </td>
                  <td>{client.nombre} {client.apellido || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PlansTrade;
