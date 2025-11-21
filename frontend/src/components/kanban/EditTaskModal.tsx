import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateTask, deleteTask, assignUserToTask, unassignUserFromTask } from "@/api/tasks";
import { useUsers } from "@/hooks/useUsers";
import type { TaskWithRelations, UpdateTaskData } from "@/types/task";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithRelations | null;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const { users } = useUsers();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
      setAssignedUsers(
        task.assignees?.map((a) => a.user_id.toString()) || []
      );
      setError(null);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, task]);

  const handleAssignUser = async (userId: string) => {
    if (!task) return;

    try {
      const userIdNum = Number(userId);
      if (assignedUsers.includes(userId)) {
        await unassignUserFromTask(task.id, userIdNum);
        setAssignedUsers((prev) => prev.filter((id) => id !== userId));
      } else {
        await assignUserToTask(task.id, userIdNum);
        setAssignedUsers((prev) => [...prev, userId]);
      }
    } catch (err: any) {
      setError(err.message || "Error al actualizar la asignación");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task || !title.trim()) {
      setError("El título es requerido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateTaskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
      };

      await updateTask(task.id, updateData);
      onTaskUpdated?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar la tarea");
      console.error("Error updating task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteTask(task.id);
      onTaskDeleted?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al eliminar la tarea");
      console.error("Error deleting task:", err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen || !task) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 z-[10000]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Editar Tarea</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">ID de tarea: {task.id}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre de la tarea"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || deleting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción detallada"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={loading || deleting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || deleting}
            />
          </div>

          {task.status && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Estado:</span> {task.status.name}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asignados ({assignedUsers.length})
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-sm text-gray-500">No hay usuarios disponibles</p>
              ) : (
                users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={assignedUsers.includes(user.id)}
                      onChange={() => handleAssignUser(user.id)}
                      disabled={loading || deleting}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          {!showDeleteConfirm && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading || deleting}
              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Eliminar
            </button>
          )}
          {showDeleteConfirm && (
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
            >
              Cancelar borrado
            </button>
          )}

          <div className="flex gap-3">
            {showDeleteConfirm && (
              <>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Eliminando...
                    </>
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </>
            )}
            {!showDeleteConfirm && (
              <>
                <button
                  onClick={onClose}
                  disabled={loading || deleting}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || deleting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, modalRoot);
};
