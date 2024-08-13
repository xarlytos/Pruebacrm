import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import UploadContractForm from './UploadContractForm';
import axios from 'axios';
import './Contracts.css';

Modal.setAppElement('#root');

function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const addContract = (newContract) => {
    setContracts([...contracts, newContract]);
  };

  return (
    <div>
      <h2>Contratos</h2>
      <div className="contract-actions">
        <button className="upload-contract-btn" onClick={openUploadModal}>Subir Contrato</button>
      </div>
      <div className="contract-table">
        {contracts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Nombre del Archivo</th>
                <th>Tamaño</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => (
                <tr key={index}>
                  <td>{contract.name}</td>
                  <td>{(contract.size / 1024 / 1024).toFixed(2)} MB</td>
                  <td>{contract.type}</td>
                  <td>
                    <button>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No se han subido contratos.</p>
        )}
      </div>
      <Modal
        isOpen={isUploadModalOpen}
        onRequestClose={closeUploadModal}
        contentLabel="Subir Contrato"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <UploadContractForm closeModal={closeUploadModal} addContract={addContract} />
      </Modal>
    </div>
  );
}

export default Contracts;
