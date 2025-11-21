import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskWithRelations } from '../../types/task';
import { TaskCard } from './TaskCard';

interface TaskCardDraggableProps {
  task: TaskWithRelations;
  onEdit?: () => void;
  onAssignUsers?: () => void;
  onDelete?: () => void;
}

export const TaskCardDraggable: React.FC<TaskCardDraggableProps> = ({
  task,
  onEdit,
  onAssignUsers,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'scale-105 shadow-lg' : ''}`}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onAssignUsers={onAssignUsers}
        onDelete={onDelete}
      />
    </div>
  );
};
