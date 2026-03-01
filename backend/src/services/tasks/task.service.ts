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
import { contextLogger } from "../../utils/contextLogger";

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
    contextLogger.info(`Changing task status`, {
      taskId,
      statusId,
      userId,
      action: 'CHANGE_TASK_STATUS'
    });

    const task = await findTaskById(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const updated = await updateStatus(taskId, statusId, userId);

    contextLogger.info(`Task status changed successfully`, {
      taskId,
      newStatusId: statusId,
      userId,
      action: 'CHANGE_TASK_STATUS_SUCCESS'
    });
    return updated;
  } catch (error) {
    contextLogger.error(`Failed to change task status`, {
      taskId,
      statusId,
      action: 'CHANGE_TASK_STATUS_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
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
    contextLogger.debug(`Getting calendar events`, {
      businessId,
      projectId,
      action: 'GET_CALENDAR_EVENTS'
    });

    const events = await getCalendarEvents(businessId, projectId);

    contextLogger.debug(`Calendar events retrieved`, {
      businessId,
      projectId,
      eventCount: events.length,
      action: 'GET_CALENDAR_EVENTS_SUCCESS'
    });
    return events;
  } catch (error) {
    contextLogger.error('Failed to get calendar events', {
      businessId,
      projectId,
      action: 'GET_CALENDAR_EVENTS_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};
