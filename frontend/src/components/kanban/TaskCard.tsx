import React from 'react';
import type { TaskWithRelations } from '../../types/task';

interface TaskCardProps {
  task: TaskWithRelations;
  onEdit?: () => void;
  onAssignUsers?: () => void;
  onDelete?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onAssignUsers,
  onDelete,
  onDragStart
}) => {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  
  return (
    <div 
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.id.toString());
        onDragStart?.(e, task.id);
      }}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-move group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 pr-2">
          {task.title}
        </h3>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onAssignUsers && (
            <button
              onClick={onAssignUsers}
              className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
              title="Assign users"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          {task.status?.name || 'Sin estado'}
        </span>
        
        {task.creator && (
          <span className="text-xs text-gray-500">
            por {task.creator.name}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex items-center gap-1">
              {task.assignees.slice(0, 2).map((assignment) => (
                <div key={assignment.user_id} className="flex items-center gap-1">
                  {assignment.user.avatar ? (
                    <img
                      src={assignment.user.avatar}
                      alt={assignment.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {assignment.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {task.assignees.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{task.assignees.length - 2}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400">Unassigned</span>
          )}
        </div>

        {task.due_date && (
          <div className={`flex items-center gap-1 text-xs ${
            isOverdue ? 'text-red-600' : 'text-gray-500'
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.due_date).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">ID: {task.id}</span>
      </div>
    </div>
  );
};