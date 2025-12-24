import {
  getProjects,
  getProjectsByBusinessId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
} from '../../models/project.model';
import { contextLogger } from '../../utils/contextLogger';

export const getProjectsByBusiness = async (businessId: string, params?: any) => {
  try {
    contextLogger.debug(`Getting projects for business`, {
      businessId,
      action: 'GET_PROJECTS_BY_BUSINESS'
    });
    return await getProjectsByBusinessId(businessId);
  } catch (error) {
    contextLogger.error('Error getting projects by business', {
      businessId,
      action: 'GET_PROJECTS_BY_BUSINESS_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    contextLogger.debug(`Getting project`, {
      projectId,
      action: 'GET_PROJECT'
    });
    return await getProjectById(projectId);
  } catch (error) {
    contextLogger.error(`Error getting project`, {
      projectId,
      action: 'GET_PROJECT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const createNewProject = async (projectData: { business_id: string, name: string, description?: string }, creatorUserId?: number) => {
  try {
    contextLogger.info('Creating new project', {
      businessId: projectData.business_id,
      projectName: projectData.name,
      creatorUserId,
      action: 'CREATE_PROJECT'
    });
    return await createProject({ ...projectData, creatorUserId });
  } catch (error) {
    contextLogger.error('Error creating project', {
      businessId: projectData.business_id,
      action: 'CREATE_PROJECT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const updateExistingProject = async (projectId: string, updateData: { name?: string, description?: string }) => {
  try {
    contextLogger.info(`Updating project`, {
      projectId,
      action: 'UPDATE_PROJECT'
    });
    return await updateProject(projectId, updateData);
  } catch (error) {
    contextLogger.error(`Error updating project`, {
      projectId,
      action: 'UPDATE_PROJECT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const removeProject = async (projectId: string) => {
  try {
    contextLogger.info(`Deleting project`, {
      projectId,
      action: 'DELETE_PROJECT'
    });
    return await deleteProject(projectId);
  } catch (error) {
    contextLogger.error(`Error deleting project`, {
      projectId,
      action: 'DELETE_PROJECT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getBusinessProjectStats = async (businessId: string) => {
  try {
    contextLogger.debug(`Getting project stats for business`, {
      businessId,
      action: 'GET_PROJECT_STATS'
    });
    return await getProjectStats(businessId);
  } catch (error) {
    contextLogger.error(`Error getting project stats for business`, {
      businessId,
      action: 'GET_PROJECT_STATS_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};
