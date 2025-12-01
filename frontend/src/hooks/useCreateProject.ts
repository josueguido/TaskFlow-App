import { useState, useCallback } from "react";
import { createProject } from "@/api/projects";
import type { Project, CreateProjectDTO } from "@/api/projects";

interface UseCreateProjectState {
  loading: boolean;
  error: string | null;
  success: boolean;
  project: Project | null;
}

interface UseCreateProjectResult extends UseCreateProjectState {
  createNewProject: (data: CreateProjectDTO) => Promise<Project | null>;
  reset: () => void;
}

export const useCreateProject = (): UseCreateProjectResult => {
  const [state, setState] = useState<UseCreateProjectState>({
    loading: false,
    error: null,
    success: false,
    project: null,
  });

  const createNewProject = useCallback(
    async (data: CreateProjectDTO): Promise<Project | null> => {
      try {
        setState({ loading: true, error: null, success: false, project: null });

        const newProject = await createProject(data);

        setState({
          loading: false,
          error: null,
          success: true,
          project: newProject,
        });

        return newProject;
      } catch (err: any) {
        const errorMessage =
          err?.message ||
          err?.response?.data?.message ||
          "Error creating project";

        setState({
          loading: false,
          error: errorMessage,
          success: false,
          project: null,
        });

        return null;
      }
    },
    []
  );


  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      success: false,
      project: null,
    });
  }, []);

  return {
    ...state,
    createNewProject,
    reset,
  };
};
