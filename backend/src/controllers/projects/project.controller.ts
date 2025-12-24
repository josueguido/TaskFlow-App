import { Request, Response, NextFunction } from 'express';
import {
  getProjectsByBusiness,
  getProject,
  createNewProject,
  updateExistingProject,
  removeProject,
  getBusinessProjectStats
} from '../../services/projects/project.service';
import { BadRequestError } from '../../errors/BadRequestError';
import { contextLogger } from '../../utils/contextLogger';

export const getProjectsByBusinessId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.params.businessId;
    if (!businessId) {
      throw new BadRequestError("Business ID is required");
    }

    const projects = await getProjectsByBusiness(businessId);

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects
    });
  } catch (error) {
    next(error);
  }
}

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      throw new BadRequestError("Project ID is required");
    }

    const project = await getProject(projectId);

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
}

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    contextLogger.debug(`Creating project`, {
      body: req.body,
      action: 'CREATE_PROJECT_START'
    });

    const { businessId, name, description } = req.body;
    const currentUserId = (req as any).user?.id;

    if (!businessId || !name) {
      throw new BadRequestError("Business ID and project name are required");
    }

    contextLogger.info(`Creating project`, {
      businessId,
      projectName: name,
      createdBy: currentUserId,
      action: 'CREATE_PROJECT'
    });
    const newProject = await createNewProject(
      { business_id: businessId, name, description },
      currentUserId
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
  } catch (error) {
    next(error);
  }
}

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const { name, description } = req.body;

    if (!projectId) {
      throw new BadRequestError("Project ID is required");
    }

    if (!name && !description) {
      throw new BadRequestError("At least one field (name or description) is required for update");
    }

    const updatedProject = await updateExistingProject(projectId, { name, description });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
}

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      throw new BadRequestError("Project ID is required");
    }

    await removeProject(projectId);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

export const getProjectStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const businessId = req.params.businessId;

    if (!businessId) {
      throw new BadRequestError("Business ID is required");
    }

    const stats = await getBusinessProjectStats(businessId);

    res.status(200).json({
      success: true,
      message: 'Project statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
}
