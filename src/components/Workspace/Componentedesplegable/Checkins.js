import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Checkins.css';
import { IoFitnessOutline, IoRestaurantOutline, IoDocumentTextOutline } from 'react-icons/io5';

const Checkins = () => {
    const [checkins, setCheckins] = useState([]);
    const [selectedCheckin, setSelectedCheckin] = useState(null);

    useEffect(() => {
        // Función para obtener los check-ins desde la API
        const fetchCheckins = async () => {
            try {
                const response = await axios.get('http://localhost:5005/api/checkins');
                setCheckins(response.data);
            } catch (error) {
                console.error('Error fetching checkins:', error);
            }
        };

        fetchCheckins();
    }, []);

    const handleItemClick = (checkin) => {
        setSelectedCheckin(checkin);
    };

    const closeModal = () => {
        setSelectedCheckin(null);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'workout':
                return <IoFitnessOutline size={20} />;
            case 'diet':
                return <IoRestaurantOutline size={20} />;
            default:
                return null;
        }
    };

    const getIcons = (type, hasNote) => {
        return (
            <div style={{ display: 'flex', gap: '5px' }}>
                {getTypeIcon(type)}
                {hasNote && <IoDocumentTextOutline size={20} />}
            </div>
        );
    };

    return (
        <div className="Checkins-column">
            <h3>Check ins</h3>
            <div className="Checkins-checkins-container">
                {checkins.map((checkin) => (
                    <div className="Checkins-item" key={checkin._id} onClick={() => handleItemClick(checkin)}>
                        <div className="Checkins-status-text">
                            <div className={`Checkins-status ${checkin.status}`}></div>
                            <p><strong>{checkin.title}</strong>: {checkin.message}</p>
                            {getIcons(checkin.type, checkin.hasNote)}
                        </div>
                        {checkin.date && (
                            <div className="Checkins-date">
                                <p>{checkin.date}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedCheckin && (
                <div className="Checkins-modal" style={{ display: 'flex' }}>
                    <div className="Checkins-modal-content">
                        <span className="Checkins-close" onClick={closeModal}>&times;</span>
                        <h2>{selectedCheckin.title}</h2>
                        <p>{selectedCheckin.message}</p>
                        {selectedCheckin.date && <p><strong>Fecha:</strong> {selectedCheckin.date}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkins;
