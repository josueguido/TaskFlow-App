import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { assignUserToTask, unassignUserFromTask } from "@/api/tasks";
import { useUsers } from "@/hooks/useUsers";
import type { TaskWithRelations } from "@/types/task";

interface TaskAssignUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithRelations | null;
  onSuccess?: () => void;
}

export const TaskAssignUsersModal: React.FC<TaskAssignUsersModalProps> = ({
  isOpen,
  onClose,
  task,
  onSuccess,
}) => {
  const { users } = useUsers();
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && task) {
      setAssignedUsers(task.assignees?.map((a) => a.user_id.toString()) || []);
      setError(null);
    }
  }, [isOpen, task]);

  const handleToggleUser = async (userId: string) => {
    if (!task) return;

    try {
      setLoading(true);
      setError(null);

      const userIdNum = Number(userId);
      if (assignedUsers.includes(userId)) {
        await unassignUserFromTask(task.id, userIdNum);
        setAssignedUsers((prev) => prev.filter((id) => id !== userId));
      } else {
        await assignUserToTask(task.id, userIdNum);
        setAssignedUsers((prev) => [...prev, userId]);
      }
    } catch (err: any) {
      setError(err.message || "Error updating assignment");
      console.error("Error toggling user assignment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 z-[10000]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Assign Users
            </h2>
            <p className="text-sm text-gray-600 mt-1">{task.title}</p>
          </div>
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

        <div className="px-6 py-4 max-h-64 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            {users.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No hay usuarios disponibles
              </p>
            ) : (
              users.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={assignedUsers.includes(user.id)}
                    onChange={() => handleToggleUser(user.id)}
                    disabled={loading}
                    className="rounded border-gray-300 w-4 h-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  {assignedUsers.includes(user.id) && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onSuccess?.();
              onClose();
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {assignedUsers.length} asignado{assignedUsers.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, modalRoot);
};
