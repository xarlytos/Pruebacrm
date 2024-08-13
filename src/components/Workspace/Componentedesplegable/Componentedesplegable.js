// src/Componentedesplegable.js
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import Checkins from './Checkins';
import Alertas from './Alertas';
import Chater from './Chater';
import Tab from './Tab';
import './Componentedesplegable.css';

const Componentedesplegable = ({ onClose, openChatModal }) => {
    const [visibleColumns, setVisibleColumns] = useState({
        checkins: true,
        alertas: true,
        chater: true,
    });

    const toggleColumnVisibility = (column) => {
        setVisibleColumns((prevState) => ({
            ...prevState,
            [column]: !prevState[column],
        }));
    };

    return (
        <Draggable handle=".draggable-handle">
            <div className="draggable-container">
                <ResizableBox
                    className="componentedesplegable"
                    width={900}  // Ajusta el ancho a una cantidad que se vea bien en pantalla
                    height={600} // Ajusta la altura a una cantidad que se vea bien en pantalla
                    minConstraints={[500, 300]}
                    maxConstraints={[window.innerWidth * 0.9, window.innerHeight * 0.9]} // Límites máximos en relación al tamaño de la pantalla
                    resizeHandles={['se']}
                >
                    <div className="draggable-content">
                        <div className="header draggable-handle">
                            <button onClick={onClose} className="close-button">X</button>
                        </div>
                        <div className="tabs draggable-handle">
                            <Tab
                                label="Check ins"
                                isActive={visibleColumns.checkins}
                                onClick={() => toggleColumnVisibility('checkins')}
                            />
                            <Tab
                                label="Alertas"
                                isActive={visibleColumns.alertas}
                                onClick={() => toggleColumnVisibility('alertas')}
                            />
                            <Tab
                                label="Chater"
                                isActive={visibleColumns.chater}
                                onClick={() => toggleColumnVisibility('chater')}
                            />
                        </div>
                        <div className="content">
                            {visibleColumns.checkins && <Checkins />}
                            {visibleColumns.alertas && <Alertas />}
                            {visibleColumns.chater && <Chater openChatModal={openChatModal} />}
                        </div>
                    </div>
                </ResizableBox>
            </div>
        </Draggable>
    );
};

export default Componentedesplegable;
