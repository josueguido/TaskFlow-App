import { Request, Response, NextFunction } from 'express';
import * as projectUsersService from '../../services/projects/projectUsers.service';
import { contextLogger } from '../../utils/contextLogger';
import { BadRequestError } from '../../errors/BadRequestError';

export const addUserToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { userId, role = 'member' } = req.body;
    const currentUserId = (req as any).user?.id;

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    contextLogger.info(`Adding user to project`, {
      projectId,
      userId,
      role,
      action: 'ADD_USER_TO_PROJECT'
    });

    const result = await projectUsersService.addUserToProjectService(
      Number(projectId),
      Number(userId),
      role
    );

    res.status(201).json({
      success: true,
      message: 'User added to project successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;

    contextLogger.debug(`Getting project users`, {
      projectId,
      action: 'GET_PROJECT_USERS'
    });

    const users = await projectUsersService.getProjectUsersService(Number(projectId));

    res.json({
      success: true,
      message: 'Project users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
    contextLogger.debug(`Getting user role in project`, {
      projectId,
      userId,
      action: 'GET_USER_ROLE'
    }
    }

    logger.info(`[PROJECT_USERS_CTRL] Getting role for user ${userId} in project ${projectId}`);

    const result = await projectUsersService.getUserRoleService(Number(projectId), userId);

    res.json({
      success: true,
      message: 'User role retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

expocontextLogger.info(`Removing user from project`, {
      projectId,
      userId,
      action: 'REMOVE_USER_FROM_PROJECT'
    }ion) => {
  try {
    const { projectId, userId } = req.params;

    logger.info(`[PROJECT_USERS_CTRL] Removing user ${userId} from project ${projectId}`);

    await projectUsersService.removeUserFromProjectService(
      Number(projectId),
      Number(userId)
    );

    res.json({
      success: true,
      message: 'User removed from project successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId, userId } = req.params;
    const { role } = req.body;

    contextLogger.warn(`Updating user role`, {
      projectId,
      userId,
      newRole: role,
      action: 'UPDATE_USER_ROLE'
    }
      throw new BadRequestError('Role must be either "admin" or "member"');
    }

    logger.info(`[PROJECT_USERS_CTRL] Updating user ${userId} role to ${role} in project ${projectId}`);

    const result = await projectUsersService.updateUserRoleService(
      Number(projectId),
      Number(userId),
      role
    );

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

expocontextLogger.debug(`Getting user projects`, {
      userId,
      businessId,
      action: 'GET_USER_PROJECTS'
    }
  try {
    const userId = (req as any).user?.id;
    const businessId = (req as any).user?.business_id;

    if (!userId || !businessId) {
      throw new BadRequestError('User ID or Business ID not found in request');
    }

    logger.info(`[PROJECT_USERS_CTRL] Getting projects for user ${userId} in business ${businessId}`);

    const projects = await projectUsersService.getProjectsByUserService(userId, businessId);

    res.json({
      success: true,
      message: 'User projects retrieved successfully',
      data: projects
    });
  } catch (error) {
    next(error);
  }
};
