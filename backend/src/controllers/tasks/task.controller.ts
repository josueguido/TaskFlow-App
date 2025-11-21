import { RequestHandler } from "express";
import * as taskService from "../../services/tasks/task.service";
import { BadRequestError } from "../../errors/BadRequestError";
import { logger } from "../../utils/logger";

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

export const getTaskById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Task ID is required");
    }

    const task = await taskService.getTaskById(id);
    res.json(task);
  } catch (error) {
    next(error);
  }
}

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, status_id } = req.body;
    const task = await taskService.createTask({ title, description, status_id, created_at: new Date() });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export const updateTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status_id, assignedTo } = req.body;
    const task = await taskService.updateTask(id, { title, description, status_id });
    res.json(task);
  } catch (error) {
    next(error);
  }
}

export const deleteTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const changeTaskStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statusId } = req.body;
    const userId = (req as any).user?.id;

    logger.info(`[CHANGE_STATUS_CTRL] Changing task ${id} status to ${statusId} by user ${userId}`);

    const task = await taskService.changeTaskStatus(id, statusId.toString(), userId);

    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
}

export const assignUsersToTask: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    logger.info(`[ASSIGN_USER] Assigning user ${user_id} to task ${id}`);

    const result = await taskService.assignUsersToTask(id, [user_id.toString()]);

    res.status(201).json({
      success: true,
      message: 'User assigned to task successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export const getTaskHistory: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await taskService.getTaskHistory(id);
    res.json(history);
  } catch (error) {
    next(error);
  }
}

export const getCalendarEvents: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;
    const { projectId } = req.query;

    if (!businessId) {
      throw new BadRequestError("Business ID not found in request");
    }

    logger.info(`[CALENDAR_CTRL] Getting calendar events for business ${businessId}${projectId ? `, project ${projectId}` : ''}`);

    const events = await taskService.getCalendarEventsService(
      businessId,
      projectId ? Number(projectId) : undefined
    );

    res.json({
      success: true,
      message: 'Calendar events retrieved successfully',
      data: events
    });
  } catch (error) {
    next(error);
  }
}
