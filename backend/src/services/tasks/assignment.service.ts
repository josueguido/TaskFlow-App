import { IAssignment, ICreateAssignment, IUpdateAssignment } from '../../interfaces/assignment.interface';
import { NotFoundError } from '../../errors/NotFoundError';
import {
  getAssignments,
  getAssignmentsByTaskId,
  assignUsersToTask,
  removeAssignment,
  removeAllAssignments,
  isUserAssignedToTask
} from '../../models/assignment.model';


export const getAllAssignments = async () => {
  return await getAssignments();
}

export const getAssignmentsByTaskIdService = async (taskId: string): Promise<IAssignment[]> => {
  const assignments = await getAssignmentsByTaskId(taskId);
  if (!assignments || assignments.length === 0) {
    throw new NotFoundError(`No assignments found for task_id ${taskId}`);
  }
  return assignments;
};

export const assignUsersToTaskService = async (
  taskId: string,
  userIds: string[]
): Promise<IAssignment[]> => {
  if (userIds.length === 0) {
    throw new Error('No user IDs provided for assignment');
  }
  return await assignUsersToTask(taskId, userIds);
};

export const removeAssignmentService = async (
  taskId: string,
  userId: string
): Promise<IAssignment> => {
  const assignment = await removeAssignment(taskId, userId);
  if (!assignment) {
    throw new NotFoundError(`Assignment for task_id ${taskId} and user_id ${userId} not found`);
  }
  return assignment;
};

export const removeAllAssignmentsService = async (taskId: string): Promise<IAssignment[]> => {
  const assignments = await removeAllAssignments(taskId);
  if (assignments.length === 0) {
    throw new NotFoundError(`No assignments found for task_id ${taskId}`);
  }
  return assignments;
};

export const isUserAssignedToTaskService = async (
  taskId: string,
  userId: string
): Promise<boolean> => {
  return await isUserAssignedToTask(taskId, userId);
}
