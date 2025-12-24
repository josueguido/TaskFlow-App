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
import { contextLogger } from '../../utils/contextLogger';
import { BadRequestError } from '../../errors/BadRequestError';
import { NotFoundError } from '../../errors/NotFoundError';

export const addUserToProjectService = async (projectId: number, userId: number, role: 'admin' | 'member' = 'member') => {
  try {
    contextLogger.info(`Adding user to project`, {
      projectId,
      userId,
      role,
      action: 'ADD_USER_TO_PROJECT'
    });

    const existingRole = await getUserRoleInProject(projectId, userId);
    if (existingRole) {
      throw new BadRequestError('User is already a member of this project');
    }

    const result = await addUserToProject(projectId, userId, role);

    contextLogger.info(`User added to project successfully`, {
      projectId,
      userId,
      role,
      action: 'ADD_USER_TO_PROJECT_SUCCESS'
    });

    return result;
  } catch (error) {
    contextLogger.error(`Failed to add user to project`, {
      projectId,
      userId,
      role,
      action: 'ADD_USER_TO_PROJECT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getProjectUsersService = async (projectId: number) => {
  try {
    contextLogger.debug(`Getting project users`, {
      projectId,
      action: 'GET_PROJECT_USERS'
    });
    return await getProjectUsers(projectId);
  } catch (error) {
    contextLogger.error(`Error getting project users`, {
      projectId,
      action: 'GET_PROJECT_USERS_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getUserRoleService = async (projectId: number, userId: number) => {
  try {
    contextLogger.debug(`Getting user role in project`, {
      projectId,
      userId,
      action: 'GET_USER_ROLE'
    });
    const role = await getUserRoleInProject(projectId, userId);

    if (!role) {
      throw new NotFoundError('User is not a member of this project');
    }

    return { role };
  } catch (error) {
    contextLogger.error(`Error getting user role`, {
      projectId,
      userId,
      action: 'GET_USER_ROLE_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const removeUserFromProjectService = async (projectId: number, userId: number) => {
  try {
    contextLogger.info(`Removing user from project`, {
      projectId,
      userId,
      action: 'REMOVE_USER_FROM_PROJECT'
    });

    const role = await getUserRoleInProject(projectId, userId);
    if (role === 'admin') {
      const adminCount = await countProjectAdmins(projectId);
      if (adminCount <= 1) {
        throw new BadRequestError('Cannot remove the last admin from a project');
      }
    }

    await removeUserFromProject(projectId, userId);
  } catch (error) {
    contextLogger.error(`Error removing user from project`, {
      projectId,
      userId,
      action: 'REMOVE_USER_FROM_PROJECT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const updateUserRoleService = async (projectId: number, userId: number, role: 'admin' | 'member') => {
  try {
    contextLogger.warn(`Updating user role`, {
      projectId,
      userId,
      newRole: role,
      action: 'UPDATE_USER_ROLE'
    });

    const currentRole = await getUserRoleInProject(projectId, userId);
    if (!currentRole) {
      throw new NotFoundError('User is not a member of this project');
    }

    if (currentRole === 'admin' && role === 'member') {
      const adminCount = await countProjectAdmins(projectId);
      if (adminCount <= 1) {
        throw new BadRequestError('Cannot demote the last admin from a project');
      }
    }

    const result = await updateUserRoleInProject(projectId, userId, role);

    contextLogger.info(`User role updated successfully`, {
      projectId,
      userId,
      previousRole: currentRole,
      newRole: role,
      action: 'UPDATE_USER_ROLE_SUCCESS'
    });

    return result;
  } catch (error) {
    contextLogger.error(`Failed to update user role`, {
      projectId,
      userId,
      role,
      action: 'UPDATE_USER_ROLE_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getProjectsByUserService = async (userId: number, businessId: number) => {
  try {
    contextLogger.debug(`Getting projects for user`, {
      userId,
      businessId,
      action: 'GET_PROJECTS_FOR_USER'
    });
    return await getProjectsByUser(userId, businessId);
  } catch (error) {
    contextLogger.error(`Error getting user projects`, {
      userId,
      businessId,
      action: 'GET_PROJECTS_FOR_USER_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const isProjectAdminService = async (projectId: number, userId: number): Promise<boolean> => {
  try {
    return await isProjectAdmin(projectId, userId);
  } catch (error) {
    contextLogger.error(`Error checking if user is admin`, {
      projectId,
      userId,
      action: 'CHECK_ADMIN_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

const countProjectAdmins = async (projectId: number): Promise<number> => {
  const users = await getProjectUsers(projectId);
  return users.filter(u => u.role === 'admin').length;
};
