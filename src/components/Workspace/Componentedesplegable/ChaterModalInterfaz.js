// src/ChaterModalInterfaz.js
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './ChaterModalInterfaz.css';

const ChaterModalInterfaz = ({ chat, onClose }) => {
    const [messages, setMessages] = useState(chat.messages);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim() !== '') {
            const message = {
                text: newMessage,
                date: new Date().toLocaleString(),
                sent: true,
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    return (
        <Draggable handle=".Chater-modal-header">
            <ResizableBox
                className="Chater-modal-content"
                width={400}
                height={500}
                minConstraints={[300, 300]}
                maxConstraints={[800, 600]}
                resizeHandles={['se']}
            >
                <div>
                    <div className="Chater-modal-header">
                        <img src={chat.profilePic} alt="profile" className="Chater-profile-pic-large" />
                        <h2>{chat.name}</h2>
                        <span className="Chater-close" onClick={onClose}>&times;</span>
                    </div>
                    <div className="Chater-modal-body">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`Chater-message ${message.sent ? 'sent' : 'received'}`}
                            >
                                <p>{message.text}</p>
                                <span className="Chater-modal-date">{message.date}</span>
                            </div>
                        ))}
                    </div>
                    <div className="Chater-modal-footer">
                        <input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            className="Chater-input"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="Chater-send-button" onClick={handleSend}>Enviar</button>
                    </div>
                </div>
            </ResizableBox>
        </Draggable>
    );
};

export default ChaterModalInterfaz;
