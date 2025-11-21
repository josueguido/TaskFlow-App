import { Request, Response, NextFunction } from 'express';
import * as projectUsersService from '../../services/projects/projectUsers.service';
import { logger } from '../../utils/logger';
import { BadRequestError } from '../../errors/BadRequestError';

export const addUserToProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const { userId, role = 'member' } = req.body;
    const currentUserId = (req as any).user?.id;

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    logger.info(`[PROJECT_USERS_CTRL] Adding user ${userId} to project ${projectId}`);

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

    logger.info(`[PROJECT_USERS_CTRL] Getting users for project ${projectId}`);

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
      throw new BadRequestError('User ID not found in request');
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

export const removeUserFromProject = async (req: Request, res: Response, next: NextFunction) => {
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

    if (!role || !['admin', 'member'].includes(role)) {
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

export const getUserProjects = async (req: Request, res: Response, next: NextFunction) => {
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
