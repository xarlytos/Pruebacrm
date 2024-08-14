// EditModal.js
import React from 'react';
import Modal from 'react-modal';

const EditModal = ({ isOpen, onRequestClose, children, className }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Edit Modal"
            ariaHideApp={false}
            className={`condicion-fisica-modal ${className}`}
            overlayClassName="condicion-fisica-modal-overlay"
        >
            {children}
            <button onClick={onRequestClose} className="condicion-fisica-close-btn">Cerrar</button>
        </Modal>
    );
};

export default EditModal;
