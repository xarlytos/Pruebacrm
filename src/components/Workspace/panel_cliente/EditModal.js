// src/components/EditModal.js
import React from 'react';
import Modal from 'react-modal';

const EditModal = ({ isOpen, onRequestClose, children }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Modal"
            ariaHideApp={false}
        >
            {children}
            <button onClick={onRequestClose}>Cerrar</button>
        </Modal>
    );
};

export default EditModal;
