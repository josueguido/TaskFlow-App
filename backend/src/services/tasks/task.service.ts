import { ICreateTaskInput, IUpdateTaskInput, ICalendarEvent } from "../../interfaces/task.interface";
import {
  getTasks,
  getTaskById as findTaskById,
  createTask as insertTask,
  updateTask as modifyTask,
  deleteTask as removeTask,
  changeTaskStatus as updateStatus,
  assignUsers,
  getHistoryByTaskId,
  getCalendarEvents,
} from "../../models/task.model";
import { NotFoundError } from "../../errors/NotFoundError";
import { logger } from "../../utils/logger";

export const getAllTasks = async () => {
  const tasks = await getTasks();
  return tasks;
};

export const getTaskById = async (id: string) => {
  const task = await findTaskById(id);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  return task;
};

export const createTask = async (data: ICreateTaskInput) => {
  const now = new Date();
  const task = await insertTask({ ...data, created_at: now });
  return task;
};

export const updateTask = async (id: string, data: IUpdateTaskInput) => {
  const existingTask = await findTaskById(id);
  if (!existingTask) {
    throw new NotFoundError('Task not found');
  }

  const updated = await modifyTask(id, {
    ...existingTask,
    ...data,
  });

  return updated;
};

export const deleteTask = async (id: string) => {
  const deleted = await removeTask(id);
  if (!deleted) {
    throw new NotFoundError('Task not found');
  }
  return deleted;
};

export const changeTaskStatus = async (taskId: string, statusId: string, userId?: number) => {
  try {
    logger.info(`[CHANGE_STATUS] Changing task ${taskId} status to ${statusId}${userId ? ` by user ${userId}` : ''}`);

    const task = await findTaskById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const updated = await updateStatus(taskId, statusId, userId);

    logger.info(`[CHANGE_STATUS] Status changed successfully for task ${taskId}`);
    return updated;
  } catch (error) {
    logger.error(`[CHANGE_STATUS] Error changing task status:`, error);
    throw error;
  }
};

export const assignUsersToTask = async (taskId: string, userIds: string[]) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const result = await assignUsers(taskId, userIds);
  return result;
};

export const getTaskHistory = async (taskId: string) => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new NotFoundError('Task not found');
  }

  const history = await getHistoryByTaskId(taskId);
  return history;
};

export const getCalendarEventsService = async (businessId: number, projectId?: number): Promise<ICalendarEvent[]> => {
  try {
    logger.info(`[CALENDAR] Getting calendar events for business ${businessId}${projectId ? `, project ${projectId}` : ''}`);

    const events = await getCalendarEvents(businessId, projectId);

    logger.info(`[CALENDAR] Found ${events.length} calendar events`);
    return events;
  } catch (error) {
    logger.error('[CALENDAR] Error getting calendar events:', error);
    throw error;
  }
};
