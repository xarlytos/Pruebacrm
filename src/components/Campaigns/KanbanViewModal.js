import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import './Modal.css';
import './KanbanViewModal.css';

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '8px',
    padding: '16px',
    borderRadius: '4px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #ddd',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}

function KanbanViewModal({ onClose }) {
  const [tasks, setTasks] = useState({
    'email-enviado': [
      { id: 'task-1', content: 'Juanjo@gmail.com' },
      { id: 'task-2', content: 'Josejuan@gmail.com' },
    ],
    'enlace-abierto': [
      { id: 'task-3', content: 'mara@gmail.com' },
    ],
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTasks((prevTasks) => {
        const activeContainer = Object.keys(prevTasks).find((key) =>
          prevTasks[key].find((task) => task.id === active.id)
        );
        const overContainer = Object.keys(prevTasks).find((key) =>
          prevTasks[key].find((task) => task.id === over.id)
        );

        if (activeContainer && overContainer) {
          const activeIndex = prevTasks[activeContainer].findIndex((task) => task.id === active.id);
          const overIndex = prevTasks[overContainer].findIndex((task) => task.id === over.id);

          return {
            ...prevTasks,
            [activeContainer]: arrayMove(prevTasks[activeContainer], activeIndex, overIndex),
            [overContainer]: arrayMove(prevTasks[overContainer], overIndex, activeIndex),
          };
        }

        return prevTasks;
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Vista Kanban</h2>
        <button className="close-button" onClick={onClose}>×</button>
        <div className="kanban-container">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <div className="kanban-column">
              <h3>Email enviado</h3>
              <SortableContext items={tasks['email-enviado']} strategy={verticalListSortingStrategy}>
                {tasks['email-enviado'].map((task) => (
                  <SortableItem key={task.id} id={task.id}>
                    {task.content}
                  </SortableItem>
                ))}
              </SortableContext>
            </div>
            <div className="kanban-column">
              <h3>Enlace abierto</h3>
              <SortableContext items={tasks['enlace-abierto']} strategy={verticalListSortingStrategy}>
                {tasks['enlace-abierto'].map((task) => (
                  <SortableItem key={task.id} id={task.id}>
                    {task.content}
                  </SortableItem>
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default KanbanViewModal;
