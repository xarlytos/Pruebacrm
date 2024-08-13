import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { ic_add } from 'react-icons-kit/md/ic_add';

const AdvancedFilters = ({ eventType, onAdvancedFilterChange }) => {
  const [locations, setLocations] = useState(['']);
  const [participants, setParticipants] = useState(['']);

  const handleAddLocation = () => setLocations([...locations, '']);
  const handleAddParticipant = () => setParticipants([...participants, '']);

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
    onAdvancedFilterChange(eventType, 'location', newLocations);
  };

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
    onAdvancedFilterChange(eventType, 'participants', newParticipants);
  };

  return (
    <div className="Sidebarcalendario-filter-fields">
      <label>
        Ubicación:
        {locations.map((location, index) => (
          <div key={index} className="Sidebarcalendario-input-group">
            <input type="text" value={location} onChange={(e) => handleLocationChange(index, e.target.value)} />
            {index === locations.length - 1 && (
              <button type="button" onClick={handleAddLocation}>
                <Icon icon={ic_add} size={16} />
              </button>
            )}
          </div>
        ))}
      </label>
      <label>
        Participantes:
        {participants.map((participant, index) => (
          <div key={index} className="Sidebarcalendario-input-group">
            <input type="text" value={participant} onChange={(e) => handleParticipantChange(index, e.target.value)} />
            {index === participants.length - 1 && (
              <button type="button" onClick={handleAddParticipant}>
                <Icon icon={ic_add} size={16} />
              </button>
            )}
          </div>
        ))}
      </label>
    </div>
  );
};

export default AdvancedFilters;
