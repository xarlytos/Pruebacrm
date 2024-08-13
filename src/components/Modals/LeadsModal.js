// src/components/Modals/LeadsModal.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './LeadsModal.css';

const SortableItem = ({ id, lead }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="kanban-card">
      <h4>{lead.name}</h4>
      <p>{lead.email}</p>
      <p>{lead.phone}</p>
    </div>
  );
};

const LeadsModal = ({ onClose }) => {
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', status: 'New' });
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no proporcionado.');
        }

        const response = await axios.get('http://localhost:5000/api/leads', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setLeads(response.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
  }, []);

  const leadStatuses = ['New', 'Contacted', 'Qualified', 'Lost', 'Won'];

  const handleAddLead = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no proporcionado.');
      }

      const response = await axios.post('http://localhost:5000/api/leads', newLead, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setLeads([...leads, response.data]);
      setNewLead({ name: '', email: '', phone: '', status: 'New' });
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const handleChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const { id: activeId } = active;
    const { id: overId } = over;

    if (activeId !== overId) {
      const oldIndex = leads.findIndex((lead) => lead._id === activeId);
      const newIndex = leads.findIndex((lead) => lead._id === overId);

      const updatedLeads = arrayMove(leads, oldIndex, newIndex);

      // Asignar el estado correcto basado en el contenedor de destino
      const draggedLead = leads.find((lead) => lead._id === activeId);
      const newStatus = leadStatuses.find((status) => status === overId);
      if (!newStatus) {
        console.error('Invalid status');
        return;
      }

      draggedLead.status = newStatus;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no proporcionado.');
        }

        await axios.put(`http://localhost:5000/api/leads/${activeId}`, draggedLead, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setLeads(updatedLeads);
      } catch (error) {
        console.error('Error updating lead:', error);
      }
    }
  };

  return (
    <div className="leads-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Leads</h2>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="button-group">
          <button className="action-button" onClick={() => setIsFormVisible(!isFormVisible)}>
            {isFormVisible ? 'Hide Form' : 'Add Lead'}
          </button>
          <button className="action-button">Filter Leads</button>
          <button className="action-button">Import Leads</button>
          <button className="action-button">Update Leads</button>
        </div>
        {isFormVisible && (
          <form className="add-lead-form" onSubmit={handleAddLead}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newLead.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newLead.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newLead.phone}
              onChange={handleChange}
            />
            <select name="status" value={newLead.status} onChange={handleChange}>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button type="submit" className="add-lead-button">
              Add Lead
            </button>
          </form>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {leadStatuses.map((status) => (
              <SortableContext key={status} items={leads.filter((lead) => lead.status === status)} strategy={verticalListSortingStrategy}>
                <div className="kanban-column" id={status}>
                  <h3>{status}</h3>
                  {leads
                    .filter((lead) => lead.status === status)
                    .map((lead) => (
                      <SortableItem key={lead._id} id={lead._id} lead={lead} />
                    ))}
                </div>
              </SortableContext>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default LeadsModal;
