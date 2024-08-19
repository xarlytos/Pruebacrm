// src/modalHandlers.js
import { useState } from 'react';

export const useModals = () => {
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isDetailedDocumentoOpen, setIsDetailedDocumentoOpen] = useState(false);
  const [isDetailedFacturaOpen, setIsDetailedFacturaOpen] = useState(false);
  const [isDetailedPlanesOpen, setIsDetailedPlanesOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  const openModal = (modalName) => {
    switch (modalName) {
      case 'detailedModal':
        setIsDetailedModalOpen(true);
        break;
      case 'detailedDocumento':
        setIsDetailedDocumentoOpen(true);
        break;
      case 'detailedFactura':
        setIsDetailedFacturaOpen(true);
        break;
      case 'detailedPlanes':
        setIsDetailedPlanesOpen(true);
        break;
      case 'scanModal':
        setIsScanModalOpen(true);
        break;
      case 'popupOpen':
        setIsPopupOpen(true);
        break;
      case 'creationModalOpen':
        setIsCreationModalOpen(true);
        break;
      default:
        break;
    }
  };

  const closeModal = (modalName) => {
    switch (modalName) {
      case 'detailedModal':
        setIsDetailedModalOpen(false);
        break;
      case 'detailedDocumento':
        setIsDetailedDocumentoOpen(false);
        break;
      case 'detailedFactura':
        setIsDetailedFacturaOpen(false);
        break;
      case 'detailedPlanes':
        setIsDetailedPlanesOpen(false);
        break;
      case 'scanModal':
        setIsScanModalOpen(false);
        break;
      case 'popupOpen':
        setIsPopupOpen(false);
        break;
      case 'creationModalOpen':
        setIsCreationModalOpen(false);
        break;
      default:
        break;
    }
  };

  return {
    isDetailedModalOpen,
    isDetailedDocumentoOpen,
    isDetailedFacturaOpen,
    isDetailedPlanesOpen,
    isScanModalOpen,
    isPopupOpen,
    isCreationModalOpen,
    openModal,
    closeModal,
  };
};
export const useDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
    const handleToggleDropdown = () => {
      setIsDropdownOpen(prevState => !prevState);
    };
  
    return {
      isDropdownOpen,
      handleToggleDropdown
    };
  };
  