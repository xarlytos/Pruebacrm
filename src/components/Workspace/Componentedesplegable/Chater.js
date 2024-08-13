import React from 'react';
import './Chater.css';

const chaterData = [
    {
        id: 1,
        profilePic: 'path/to/profile1.jpg',
        name: 'Juan',
        messages: [
            { text: 'Hola entrenador', date: 'Recibido hace 5 horas', sent: false },
            { text: 'Que tal cliente', date: 'Enviado hace 5 horas', sent: true },
            { text: 'Hola', date: 'Recibido hace 5 horas', sent: false },
        ],
    },
    {
        id: 2,
        profilePic: 'path/to/profile2.jpg',
        name: 'Maria',
        messages: [
            { text: 'Buenos días', date: 'Recibido hace 2 horas', sent: false },
            { text: '¿Cómo estás?', date: 'Recibido hace 1 hora', sent: false },
            { text: 'Bien, gracias', date: 'Enviado hace 30 minutos', sent: true },
        ],
    },
    // Add more chat messages as needed
];

const Chater = ({ openChatModal }) => {
    return (
        <div className="Chater-column">
            <h3>Chater</h3>
            <div className="Chater-chater-container">
                {chaterData.map((chat) => (
                    <div className="Chater-item" key={chat.id} onClick={() => openChatModal(chat)}>
                        <div className="Chater-status-text">
                            <img src={chat.profilePic} alt="profile" className="Chater-profile-pic" />
                            <p><strong>{chat.name}:</strong> {chat.messages[0].text}</p>
                        </div>
                        <div className="Chater-date">
                            <p>{chat.messages[0].date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chater;
