import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useStatuses } from "@/hooks/useStatus";
import { createStatus, updateStatus, deleteStatus } from "@/api/status";
import { useAuth } from "@/store/auth";
import type { Status } from "@/types/task";

interface ManageColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLUMN_COLORS = [
  { name: 'red', bg: '#EF4444', light: '#FEE2E2' },
  { name: 'orange', bg: '#F97316', light: '#FFEDD5' },
  { name: 'amber', bg: '#EACC00', light: '#FEF3C7' },
  { name: 'green', bg: '#22C55E', light: '#DCFCE7' },
  { name: 'blue', bg: '#3B82F6', light: '#DBEAFE' },
  { name: 'purple', bg: '#A855F7', light: '#F3E8FF' },
  { name: 'pink', bg: '#EC4899', light: '#FCE7F3' },
  { name: 'slate', bg: '#64748B', light: '#F1F5F9' },
];

interface StatusWithColor extends Status {
  color?: string;
}

export const ManageColumnsModal: React.FC<ManageColumnsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { statuses, loading, error, refetch } = useStatuses();
  const { businessId } = useAuth();
  const [columns, setColumns] = useState<StatusWithColor[]>([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("blue");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setColumns(statuses);
      setNewColumnName("");
      setNewColumnColor("blue");
      setEditingId(null);
      setEditingName("");
      setEditingColor("");
      setLocalError(null);
    }
  }, [isOpen, statuses]);

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) {
      setLocalError("El nombre de la columna es requerido");
      return;
    }

    if (columns.some((c) => c.name.toLowerCase() === newColumnName.toLowerCase())) {
      setLocalError("Ya existe una columna con ese nombre");
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      const bid = businessId();
      await createStatus({
        name: newColumnName,
        order: columns.length,
        business_id: bid || undefined,
      });
      setNewColumnName("");
      setNewColumnColor("blue");
      await refetch();
    } catch (err: any) {
      setLocalError(err.message || "Error al crear la columna");
      console.error("Error adding column:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (status: StatusWithColor) => {
    setEditingId(status.id);
    setEditingName(status.name);
    setEditingColor(status.color || "blue");
    setLocalError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim()) {
      setLocalError("El nombre no puede estar vacío");
      return;
    }

    if (
      columns.some(
        (c) =>
          c.id !== editingId &&
          c.name.toLowerCase() === editingName.toLowerCase()
      )
    ) {
      setLocalError("Ya existe una columna con ese nombre");
      return;
    }

    setIsSaving(true);
    setLocalError(null);

    try {
      await updateStatus(editingId!.toString(), {
        name: editingName,
      });
      setEditingId(null);
      setEditingName("");
      setEditingColor("");
      await refetch();
    } catch (err: any) {
      setLocalError(err.message || "Error al actualizar la columna");
      console.error("Error saving edit:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteColumn = async (id: number) => {
    setIsSaving(true);
    setLocalError(null);

    try {
      await deleteStatus(id.toString());
      await refetch();
    } catch (err: any) {
      setLocalError(err.message || "Error al eliminar la columna");
      console.error("Error deleting column:", err);
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 z-[10000]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Gestionar Columnas
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Crea, edita o elimina columnas para tu tablero Kanban
            </p>
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

        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {(error || localError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-700">{error || localError}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Agregar Nueva Columna
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddColumn();
                      }
                    }}
                    placeholder="Nombre"
                    disabled={isSaving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Color:</span>
                    <div className="flex gap-1 flex-wrap">
                      {COLUMN_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setNewColumnColor(color.name)}
                          className={`w-7 h-7 rounded-full transition-all border-2 ${
                            newColumnColor === color.name
                              ? "border-gray-400 scale-110"
                              : "border-gray-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: color.bg }}
                          title={color.name}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleAddColumn}
                      disabled={isSaving || !newColumnName.trim()}
                      className="ml-auto px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Columnas Actuales ({columns.length})
                </h3>
                {columns.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">
                    No hay columnas configuradas
                  </p>
                ) : (
                  columns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all"
                    >
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      </div>

                      <div
                        className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"
                        style={{
                          backgroundColor: COLUMN_COLORS.find(
                            (c) => c.name === (column.color || "blue")
                          )?.bg,
                        }}
                      />

                      <div className="flex-1">
                        {editingId === column.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveEdit();
                                }
                              }}
                              autoFocus
                              disabled={isSaving}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex gap-1">
                              {COLUMN_COLORS.map((color) => (
                                <button
                                  key={color.name}
                                  onClick={() => setEditingColor(color.name)}
                                  className={`w-5 h-5 rounded-full transition-all border ${
                                    editingColor === color.name
                                      ? "border-gray-400 ring-2 ring-offset-1 ring-blue-500"
                                      : "border-gray-300 hover:scale-110"
                                  }`}
                                  style={{ backgroundColor: color.bg }}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">
                            {column.name}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {editingId === column.id ? (
                          <button
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Guardar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(column)}
                            disabled={isSaving}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteColumn(column.id)}
                          disabled={isSaving || columns.length <= 1}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30"
                          title="Eliminar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, modalRoot);
};
