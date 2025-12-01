import React, { useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import {
  DndContext,
  type DragOverEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Column } from './Column';
import { useTasks, useTaskMutations } from '../../hooks/useTasks';
import { useStatuses } from '../../hooks/useStatus';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { TaskAssignUsersModal } from './TaskAssignUsersModal';
import type { TaskWithRelations, Status } from '../../types/task';
import type { Column as ColumnType } from '../../types/column';

interface KanbanBoardProps {
  className?: string;
  projectId?: number;
}

export interface KanbanBoardRef {
  openNewTaskModal: () => void;
}

export const KanbanBoard = forwardRef<KanbanBoardRef, KanbanBoardProps>(({ 
  className = '',
  projectId
}, ref) => {
  const { tasks, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useTasks(projectId);
  const { statuses, loading: statusLoading } = useStatuses();
  
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [createTaskStatusId, setCreateTaskStatusId] = useState<number | null>(null);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);
  const [assignUsersModalOpen, setAssignUsersModalOpen] = useState(false);
  const [assigningTask, setAssigningTask] = useState<TaskWithRelations | null>(null);

  useImperativeHandle(ref, () => ({
    openNewTaskModal: () => {
      const firstStatus = statuses[0];
      if (firstStatus) {
        setCreateTaskStatusId(firstStatus.id);
        setCreateTaskModalOpen(true);
      }
    },
  }), [statuses]);

  React.useEffect(() => {
  }, [tasks, statuses, projectId]);

  const { 
    deleteTask, 
    changeStatus,
    loading: mutationLoading 
  } = useTaskMutations();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const sortedStatuses = useMemo(() => {
    return statuses.sort((a: Status, b: Status) => a.order - b.order);
  }, [statuses]);

  const hasValidData = sortedStatuses.length > 0;

  const getTasksByStatusId = (statusId: number): TaskWithRelations[] => {
    let filtered = tasks.filter((task: TaskWithRelations) => task.status_id === statusId);
    
    if (projectId) {
      filtered = filtered.filter((task: TaskWithRelations) => task.project_id === projectId);
    }
    
    return filtered;
  };

  const taskStatusIds = useMemo(() => {
    return Array.from(new Set(tasks.map((t: TaskWithRelations) => t.status_id)));
  }, [tasks]);

  const orphanedStatusIds = useMemo(() => {
    return taskStatusIds.filter(
      statusId => !sortedStatuses.find(s => s.id === statusId)
    );
  }, [taskStatusIds, sortedStatuses]);

  const handleTaskEdit = (task: TaskWithRelations) => {
    setEditingTask(task);
    setEditTaskModalOpen(true);
  };

  const handleTaskAssignUsers = (task: TaskWithRelations) => {
    setAssigningTask(task);
    setAssignUsersModalOpen(true);
  };

  const handleTaskDelete = async (taskId: number) => {
    const success = await deleteTask(taskId);
    if (success) {
      refetchTasks();
    }
  };

  const handleAddTask = (statusId: number) => {
    setCreateTaskStatusId(statusId);
    setCreateTaskModalOpen(true);
  };

  const handleTaskCreated = () => {
    refetchTasks();
  };

  const handleTaskUpdated = () => {
    refetchTasks();
  };

  const handleTaskDeleted = () => {
    refetchTasks();
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const newStatusId = parseInt(overId as string);
    const task = tasks.find((t: TaskWithRelations) => t.id.toString() === activeId);

    if (task && task.status_id !== newStatusId) {
      const newStatus = sortedStatuses.find((s: Status) => s.id === newStatusId);
      if (newStatus) {
        changeStatus(task.id, newStatus.id).then(() => {
          refetchTasks();
        });
      }
    }
  };

  const handleDragEnd = () => {};

  if (tasksLoading || statusLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando board...</span>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error al cargar el board</p>
          <p className="text-gray-500 text-sm">{tasksError}</p>
          <button 
            onClick={() => refetchTasks()}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!hasValidData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No hay columnas configuradas</p>
          <p className="text-gray-400 text-sm">Configura los estados en la administración</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full ${className}`}>
      {createTaskStatusId && (
        <CreateTaskModal
          isOpen={createTaskModalOpen}
          onClose={() => {
            setCreateTaskModalOpen(false);
            setCreateTaskStatusId(null);
          }}
          statusId={createTaskStatusId}
          onTaskCreated={handleTaskCreated}
        />
      )}
      
      <EditTaskModal
        isOpen={editTaskModalOpen}
        onClose={() => {
          setEditTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />

      <TaskAssignUsersModal
        isOpen={assignUsersModalOpen}
        onClose={() => {
          setAssignUsersModalOpen(false);
          setAssigningTask(null);
        }}
        task={assigningTask}
        onSuccess={handleTaskUpdated}
      />

      {mutationLoading && (
        <div className="fixed top-4 right-4 z-50 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Updating tasks...
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Tablero Kanban</h1>
        {/* <div className="text-xs text-gray-500">
          <details>
            <summary className="cursor-pointer">Debug</summary>
            <div className="bg-gray-100 p-2 rounded mt-2 max-w-md">
              <p>Total Status: {sortedStatuses.length}</p>
              <p>Status IDs: {sortedStatuses.map(s => s.id).join(', ')}</p>
              <p>Total Tasks: {tasks.length}</p>
              <p>Task Status IDs: {taskStatusIds.join(', ')}</p>
              <p>Orphaned: {orphanedStatusIds.join(', ')}</p>
            </div>
          </details>
        </div> */}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="flex gap-4 overflow-x-auto overflow-y-hidden h-[calc(100vh-240px)] px-6 py-4"
        >
          {sortedStatuses.map((status: Status) => {
            const statusColors: Record<string, string> = {
              'To Do': '#ef4444',
              'In Progress': '#f59e0b',
              'Done': '#10b981'
            };

            const columnData: ColumnType = {
              id: status.id.toString(),
              title: status.name,
              status: status.name,
              color: statusColors[status.name] || '#6b7280',
              order: status.order,
              wipLimit: 10
            };

            return (
              <Column
                key={status.id}
                column={columnData}
                tasks={getTasksByStatusId(status.id)}
                onTaskEdit={handleTaskEdit}
                onTaskAssignUsers={handleTaskAssignUsers}
                onTaskDelete={(taskId: string) => handleTaskDelete(parseInt(taskId))}
                onAddTask={() => handleAddTask(status.id)}
              />
            );
          })}

          {orphanedStatusIds.length > 0 && (
            <>
              {orphanedStatusIds.map((orphanStatusId) => {
                const columnData: ColumnType = {
                  id: orphanStatusId.toString(),
                  title: `Status ${orphanStatusId} (Desconocido)`,
                  status: `Status ${orphanStatusId}`,
                  color: '#9ca3af',
                  order: 999,
                  wipLimit: 10
                };

                return (
                  <Column
                    key={`orphan-${orphanStatusId}`}
                    column={columnData}
                    tasks={getTasksByStatusId(orphanStatusId)}
                    onTaskEdit={handleTaskEdit}
                    onTaskAssignUsers={handleTaskAssignUsers}
                    onTaskDelete={(taskId: string) => handleTaskDelete(parseInt(taskId))}
                    onAddTask={() => {}}
                  />
                );
              })}
            </>
          )}
        </div>
      </DndContext>

      {tasks.length > 0 && (
        <div className="mt-0 px-6 py-2 flex gap-4 text-xs text-gray-600 flex-wrap border-t border-gray-200 overflow-x-auto">
          <span>Total tasks: {tasks.length}</span>
          {sortedStatuses.map((status: Status) => (
            <span key={status.id}>
              {status.name}: {getTasksByStatusId(status.id).length}
            </span>
          ))}
          {orphanedStatusIds.length > 0 && (
            <>
              <span className="text-red-600 font-semibold">
                ⚠️ {orphanedStatusIds.reduce((acc, id) => acc + getTasksByStatusId(id).length, 0)} tareas con status desconocido
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
});