import { ICreateTaskHistory, ITaskHistory } from "../../interfaces/taskHistory.interface";
import { getTaskHistoryByTaskId, inserTaskHistory } from "../../models/taskHistory.model";
import { NotFoundError } from "../../errors/NotFoundError";

export const getTaskHistoryService = async (taskId: string) => {
  const history = await getTaskHistoryByTaskId(Number(taskId));
  if (!history || history.length === 0) {
    throw new NotFoundError(`No history found for task_id ${taskId}`);
  }
  return history;
}

export const createTaskHistoryService = async (data: ICreateTaskHistory): Promise<ITaskHistory> => {
  const { task_id, user_id, field_changed, old_value, new_value } = data;
  if (!task_id || !user_id || !field_changed) {
    throw new Error('Missing required fields for task history creation');
  }

  const history = await inserTaskHistory({
    task_id,
    user_id,
    field_changed,
    old_value: old_value ?? null,
    new_value: new_value ?? null
  });

  return history;
}
