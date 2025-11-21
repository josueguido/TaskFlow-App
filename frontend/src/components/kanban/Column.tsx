import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskWithRelations } from '../../types/task';
import type { Column as ColumnType } from '../../types/column';
import { TaskCardDraggable } from './TaskCardDraggable';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskWithRelations[];
  onTaskEdit?: (task: TaskWithRelations) => void;
  onTaskAssignUsers?: (task: TaskWithRelations) => void;
  onTaskDelete?: (taskId: string) => void;
  onAddTask?: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onTaskEdit,
  onTaskAssignUsers,
  onTaskDelete,
  onAddTask
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const isWipLimitExceeded = column.wipLimit && tasks.length >= column.wipLimit;
  const taskIds = tasks.map((task) => task.id.toString());

  return (
    <div className="flex flex-col w-72 bg-gray-50 rounded-lg shadow-sm border border-gray-200 flex-shrink-0 h-full">
      <div className="flex items-center justify-between p-3 border-b bg-white rounded-t-lg flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-medium text-gray-900 truncate text-sm">{column.title}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
            {tasks.length}
            {column.wipLimit && ` / ${column.wipLimit}`}
          </span>
        </div>
        
        <button
          onClick={() => onAddTask?.(column.id)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0 ml-2"
          title="Add task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {isWipLimitExceeded && (
        <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 flex-shrink-0">
          <p className="text-xs text-amber-700">
            ⚠️ WIP limit exceeded
          </p>
        </div>
      )}

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 bg-gray-50 relative rounded-lg transition-all overflow-y-auto ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
        }`}
      >
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="w-6 h-6 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-xs">No tasks</p>
            </div>
          </div>
        ) : (
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskCardDraggable
                  key={task.id}
                  task={task}
                  onEdit={() => onTaskEdit?.(task)}
                  onAssignUsers={() => onTaskAssignUsers?.(task)}
                  onDelete={() => onTaskDelete?.(task.id.toString())}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>

      <div className="px-3 py-1.5 bg-white border-t rounded-b-lg flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
          <span>
            {tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length} overdue
          </span>
        </div>
      </div>
    </div>
  );
};
