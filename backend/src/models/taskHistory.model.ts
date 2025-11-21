import { pool } from "../config/DB";
import { ITaskHistory, ICreateTaskHistory } from "../interfaces/taskHistory.interface";

export const getTaskHistoryByTaskId = async (taskId: number) => {
  const result = await pool.query(
    `SELECT * FROM task_history WHERE task_id = $1 ORDER BY changed_at DESC`,
    [taskId]
  );
  return result.rows as ITaskHistory[];
}

export const inserTaskHistory = async (history: ICreateTaskHistory) => {
  const result = await pool.query(`
    INSERT INTO task_history (task_id, user_id, field_changed, old_value, new_value)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [history.task_id, history.user_id, history.field_changed, history.old_value, history.new_value]
  );
  return result.rows[0] as ITaskHistory;
}
