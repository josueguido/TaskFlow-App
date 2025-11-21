import {
  addUserToProject,
  getProjectUsers,
  getUserRoleInProject,
  removeUserFromProject,
  updateUserRoleInProject,
  getProjectsByUser,
  isProjectAdmin,
  countProjectUsers
} from '../../models/projectUsers.model';
import { logger } from '../../utils/logger';
import { BadRequestError } from '../../errors/BadRequestError';
import { NotFoundError } from '../../errors/NotFoundError';

export const addUserToProjectService = async (projectId: number, userId: number, role: 'admin' | 'member' = 'member') => {
  try {
    logger.info(`[PROJECT_USERS] Adding user ${userId} to project ${projectId} with role ${role}`);

    // Verificar que el usuario no esté ya en el proyecto
    const existingRole = await getUserRoleInProject(projectId, userId);
    if (existingRole) {
      throw new BadRequestError('User is already a member of this project');
    }

    return await addUserToProject(projectId, userId, role);
  } catch (error) {
    logger.error(`Error adding user to project:`, error);
    throw error;
  }
};

export const getProjectUsersService = async (projectId: number) => {
  try {
    logger.info(`[PROJECT_USERS] Getting users for project ${projectId}`);
    return await getProjectUsers(projectId);
  } catch (error) {
    logger.error(`Error getting project users:`, error);
    throw error;
  }
};

export const getUserRoleService = async (projectId: number, userId: number) => {
  try {
    logger.info(`[PROJECT_USERS] Getting role for user ${userId} in project ${projectId}`);
    const role = await getUserRoleInProject(projectId, userId);

    if (!role) {
      throw new NotFoundError('User is not a member of this project');
    }

    return { role };
  } catch (error) {
    logger.error(`Error getting user role:`, error);
    throw error;
  }
};

export const removeUserFromProjectService = async (projectId: number, userId: number) => {
  try {
    logger.info(`[PROJECT_USERS] Removing user ${userId} from project ${projectId}`);

    // Verificar que no es el último admin
    const role = await getUserRoleInProject(projectId, userId);
    if (role === 'admin') {
      const adminCount = await countProjectAdmins(projectId);
      if (adminCount <= 1) {
        throw new BadRequestError('Cannot remove the last admin from a project');
      }
    }

    await removeUserFromProject(projectId, userId);
  } catch (error) {
    logger.error(`Error removing user from project:`, error);
    throw error;
  }
};

export const updateUserRoleService = async (projectId: number, userId: number, role: 'admin' | 'member') => {
  try {
    logger.info(`[PROJECT_USERS] Updating user ${userId} role to ${role} in project ${projectId}`);

    const currentRole = await getUserRoleInProject(projectId, userId);
    if (!currentRole) {
      throw new NotFoundError('User is not a member of this project');
    }

    // Si está bajando de admin, verificar que no sea el único
    if (currentRole === 'admin' && role === 'member') {
      const adminCount = await countProjectAdmins(projectId);
      if (adminCount <= 1) {
        throw new BadRequestError('Cannot demote the last admin from a project');
      }
    }

    return await updateUserRoleInProject(projectId, userId, role);
  } catch (error) {
    logger.error(`Error updating user role:`, error);
    throw error;
  }
};

export const getProjectsByUserService = async (userId: number, businessId: number) => {
  try {
    logger.info(`[PROJECT_USERS] Getting projects for user ${userId} in business ${businessId}`);
    return await getProjectsByUser(userId, businessId);
  } catch (error) {
    logger.error(`Error getting user projects:`, error);
    throw error;
  }
};

export const isProjectAdminService = async (projectId: number, userId: number): Promise<boolean> => {
  try {
    return await isProjectAdmin(projectId, userId);
  } catch (error) {
    logger.error(`Error checking if user is admin:`, error);
    throw error;
  }
};

// Helper: contar admins en un proyecto
const countProjectAdmins = async (projectId: number): Promise<number> => {
  const users = await getProjectUsers(projectId);
  return users.filter(u => u.role === 'admin').length;
};
