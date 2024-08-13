import React from 'react';
import './Tab.css';

const Tab = ({ label, isActive, onClick }) => {
    return (
        <button className={`tablinks ${isActive ? 'active' : ''} draggable-handle`} onClick={onClick}>
            {label}
        </button>
    );
};

export default Tab;
