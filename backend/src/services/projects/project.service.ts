import {
  getProjects,
  getProjectsByBusinessId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
} from '../../models/project.model';
import { logger } from '../../utils/logger';

export const getProjectsByBusiness = async (businessId: string, params?: any) => {
  try {
    logger.info(`Getting projects for business ${businessId}`);
    return await getProjectsByBusinessId(businessId);
  } catch (error) {
    logger.error('Error getting projects by business:', error);
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    logger.info(`Getting project with ID: ${projectId}`);
    return await getProjectById(projectId);
  } catch (error) {
    logger.error(`Error getting project ${projectId}:`, error);
    throw error;
  }
};

export const createNewProject = async (projectData: { business_id: string, name: string, description?: string }, creatorUserId?: number) => {
  try {
    logger.info('Creating new project');
    return await createProject({ ...projectData, creatorUserId });
  } catch (error) {
    logger.error('Error creating project:', error);
    throw error;
  }
};

export const updateExistingProject = async (projectId: string, updateData: { name?: string, description?: string }) => {
  try {
    logger.info(`Updating project with ID: ${projectId}`);
    return await updateProject(projectId, updateData);
  } catch (error) {
    logger.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};

export const removeProject = async (projectId: string) => {
  try {
    logger.info(`Deleting project with ID: ${projectId}`);
    return await deleteProject(projectId);
  } catch (error) {
    logger.error(`Error deleting project ${projectId}:`, error);
    throw error;
  }
};

export const getBusinessProjectStats = async (businessId: string) => {
  try {
    logger.info(`Getting project stats for business ${businessId}`);
    return await getProjectStats(businessId);
  } catch (error) {
    logger.error(`Error getting project stats for business ${businessId}:`, error);
    throw error;
  }
};
