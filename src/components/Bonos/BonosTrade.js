import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BonosTrade.css';

function BonosTrade({ bono, onClose, onTrade }) {
  const [allClients, setAllClients] = useState([]);
  const [assignedClients, setAssignedClients] = useState([]);
  const [unassignedClients, setUnassignedClients] = useState([]);
  const [selectedAssignedClients, setSelectedAssignedClients] = useState([]);
  const [selectedUnassignedClients, setSelectedUnassignedClients] = useState([]);

  useEffect(() => {
    console.log('Fetching clients with bono ID:', bono._id);
    axios.get('http://localhost:5000/clients/with-bonos')
      .then(response => {
        console.log('Fetched clients:', response.data);
        setAllClients(response.data);
        const assigned = response.data.filter(client => {
          const hasBono = client.associatedBonos.some(b => b.toString() === bono._id);
          console.log(`Client ${client._id} has bono ${bono._id}:`, hasBono);
          return hasBono;
        });
        const unassigned = response.data.filter(client => {
          const hasBono = client.associatedBonos.some(b => b.toString() === bono._id);
          console.log(`Client ${client._id} does not have bono ${bono._id}:`, !hasBono);
          return !hasBono;
        });
        setAssignedClients(assigned);
        setUnassignedClients(unassigned);
        console.log('Assigned clients:', assigned);
        console.log('Unassigned clients:', unassigned);
      })
      .catch(error => console.error('Error fetching clients:', error));
  }, [bono._id]);

  const handleTrade = () => {
    console.log('Starting trade...');
    console.log('Selected unassigned clients:', selectedUnassignedClients);
    console.log('Selected assigned clients:', selectedAssignedClients);

    const assignPromises = selectedUnassignedClients.map(clientId => {
      console.log(`Assigning bono ${bono._id} to client ${clientId}`);
      return axios.put(`http://localhost:5000/clients/${clientId}/add-bono`, { bonoId: bono._id });
    });

    const unassignPromises = selectedAssignedClients.map(clientId => {
      console.log(`Removing bono ${bono._id} from client ${clientId}`);
      return axios.put(`http://localhost:5000/clients/${clientId}/remove-bono`, { bonoId: bono._id });
    });

    Promise.all([...assignPromises, ...unassignPromises])
      .then(() => {
        console.log('Trade completed. Fetching updated clients...');
        axios.get('http://localhost:5000/clients/with-bonos')
          .then(response => {
            console.log('Fetched updated clients:', response.data);
            setAllClients(response.data);
            const assigned = response.data.filter(client => {
              const hasBono = client.associatedBonos.some(b => b.toString() === bono._id);
              console.log(`Client ${client._id} has bono ${bono._id}:`, hasBono);
              return hasBono;
            });
            const unassigned = response.data.filter(client => {
              const hasBono = client.associatedBonos.some(b => b.toString() === bono._id);
              console.log(`Client ${client._id} does not have bono ${bono._id}:`, !hasBono);
              return !hasBono;
            });
            setAssignedClients(assigned);
            setUnassignedClients(unassigned);
            setSelectedAssignedClients([]);
            setSelectedUnassignedClients([]);
            console.log('Updated assigned clients:', assigned);
            console.log('Updated unassigned clients:', unassigned);
          })
          .catch(error => console.error('Error fetching updated clients:', error));
      })
      .catch(error => console.error('Error during trade:', error));
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
      <h2>Trade Bono</h2>
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
                  <td>{client.firstName} {client.lastName}</td>
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
                  <td>{client.firstName} {client.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default BonosTrade;
