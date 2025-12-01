import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { createProject, type CreateProjectDTO } from "@/api/projects";
import { useAuth } from "@/store/auth";
import { ArrowLeft, Loader } from "lucide-react";

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .min(3, "Name must be at least 3 characters")
    .max(255, "Name cannot exceed 255 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

type CreateProjectForm = z.infer<typeof createProjectSchema>;

export const CreateProjectPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const businessId = useAuth((state) => state.businessId());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectForm>({
    resolver: zodResolver(createProjectSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateProjectForm) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      if (!businessId) {
        setError(
          "No se pudo obtener el ID del negocio. Por favor, inicia sesión nuevamente."
        );
        return;
      }

      const projectPayload = {
        businessId: Number(businessId),
        name: data.name,
      } as CreateProjectDTO;
      
      if (data.description) {
        projectPayload.description = data.description;
      }

      const newProject = await createProject(projectPayload);

      setSuccessMessage(`Project "${newProject.name}" created successfully!`);
      reset();

      setTimeout(() => {
        navigate("/app");
      }, 1500);
    } catch (err: any) {
      console.error("Error creating project:", err);
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        "Error creating project. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create new project
            </h1>
            <p className="text-gray-600">
              Complete the form to create a new project in your business
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  ✓ {successMessage}
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">⚠ {error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Ej: Website Redesign"
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-base ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                {...register("description")}
                id="description"
                placeholder="Add a description for your project..."
                disabled={loading}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed resize-none text-base ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Maximum 1000 characters
              </p>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleGoBack}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader size={20} className="animate-spin" />}
                {loading ? "Creating..." : "Create project"}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              ℹ️ It will be created in your current business. You can add team members once it's created.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
