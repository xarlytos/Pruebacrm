import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateFunnelModal from '../Modals/CreateFunnelModal';
import LeadsModal from '../Modals/LeadsModal';
import './FunnelsList.css';
import { FaPlus } from 'react-icons/fa';

const FunnelsList = () => {
  const [funnels, setFunnels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFunnels = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no proporcionado.');
        }
  
        const response = await axios.get('http://localhost:5000/api/funnels', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setFunnels(response.data);
      } catch (error) {
        console.error('Error fetching funnels:', error);
        if (error.response && error.response.status === 401) {
          alert('Unauthorized. Please log in again.');
          navigate('/login');
        }
      }
    };
  
    fetchFunnels();
  }, [navigate]);
  
  const handleCreateNewFunnel = async (name, description) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no proporcionado.');
      }

      const response = await axios.post('http://localhost:5000/api/funnels', { 
        name, 
        description,
        nodes: [],
        edges: []
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setFunnels([...funnels, response.data]);
    } catch (error) {
      console.error('Error creating new funnel:', error);
    }
  };

  const handleDeleteFunnel = async (funnelId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no proporcionado.');
      }

      await axios.delete(`http://localhost:5000/api/funnels/${funnelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setFunnels(funnels.filter(funnel => funnel._id !== funnelId));
    } catch (error) {
      console.error('Error deleting funnel:', error);
    }
  };

  return (
    <div className="funnels-list">
      <div className="header">
        <h1>Your Funnels</h1>
        <button className="create-button" onClick={() => setIsModalOpen(true)}>
          <FaPlus />
        </button>
        <button className="leads-button" onClick={() => setIsLeadsModalOpen(true)}>Leads</button>
      </div>
      {isModalOpen && (
        <CreateFunnelModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateNewFunnel}
        />
      )}
      {isLeadsModalOpen && (
        <LeadsModal onClose={() => setIsLeadsModalOpen(false)} />
      )}
      <div className="funnels-container">
        {funnels.map((funnel) => (
          <div key={funnel._id} className="funnel-card">
            <div className="funnel-info">
              <h3>{funnel.name}</h3>
              <p>{funnel.description}</p>
            </div>
            <div className="funnel-actions">
              <button className="edit-button" onClick={() => navigate(`/workflow/${funnel._id}`)}>Edit</button>
              <button className="delete-button" onClick={() => handleDeleteFunnel(funnel._id)}>Delete</button>
              <button className="toggle-button">On</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelsList;
