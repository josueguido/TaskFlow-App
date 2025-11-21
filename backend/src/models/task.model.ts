import { pool } from "../config/DB";
import { ITask } from "../interfaces/task.interface";

export const getTasks = async () => {
  const result = await pool.query(`
    SELECT * FROM tasks
  `);
  return result.rows;
};

export const getTaskById = async (id: string) => {
  const result = await pool.query(`
    SELECT * FROM tasks WHERE id = $1
  `, [id]);
  if (result.rows.length === 0) {
    throw new Error(`Task with id ${id} not found`);
  }
  return result.rows[0];
};

export const createTask = async (task: ITask) => {
  const result = await pool.query(`
    INSERT INTO tasks (title, description, status_id, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [task.title, task.description, task.status_id, task.created_at]
  );
  return result.rows[0];
};

export const updateTask = async (id: string, task: ITask) => {
  const result = await pool.query(`
    UPDATE tasks
    SET title = $1, description = $2, status_id = $3
    WHERE id = $4
    RETURNING *
  `, [task.title, task.description, task.status_id, id],
  );

  if (result.rows.length === 0) {
    throw new Error(`Tasks with id ${id} not found`);
  }
  return result.rows[0];
};

export const deleteTask = async (id: string) => {
  const result = await pool.query(`
    DELETE FROM tasks WHERE id = $1
  RETURNING *`, [id]);
  if (result.rows.length === 0) {
    throw new Error(`Task with id ${id} not found`);
  }
  return result.rows[0];
};

export const changeTaskStatus = async (taskId: string, newStatusId: string, userId?: number) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const oldTaskResult = await client.query(
      'SELECT status_id FROM tasks WHERE id = $1',
      [taskId]
    );

    if (oldTaskResult.rows.length === 0) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const oldStatusId = oldTaskResult.rows[0].status_id;

    const updateResult = await client.query(
      `UPDATE tasks
       SET status_id = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [newStatusId, taskId]
    );

    const updatedTask = updateResult.rows[0];

    if (userId) {
      await client.query(
        `INSERT INTO task_history (task_id, user_id, field_changed, old_value, new_value, changed_at)
         VALUES ($1, $2, 'status_id', $3, $4, CURRENT_TIMESTAMP)`,
        [taskId, userId, oldStatusId, newStatusId]
      );
    }

    await client.query('COMMIT');
    return updatedTask;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const assignUsers = async (taskId: string, userIds: string[]) => {
  const taskCheck = await pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);
  if (taskCheck.rows.length === 0) {
    throw new Error(`Task with id ${taskId} not found`);
  }

  const results = [];
  for (const userId of userIds) {
    const result = await pool.query(`
      INSERT INTO task_assignments (task_id, user_id, assigned_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING task_id, user_id, assigned_at
    `, [taskId, userId]);

    if (result.rows.length > 0) {
      results.push(result.rows[0]);
    }
  }

  return results;
};

export const getHistoryByTaskId = async (taskId: string) => {
  const result = await pool.query(`
    SELECT * FROM task_history
    WHERE task_id = $1
    ORDER BY created_at DESC
  `, [taskId]);
  if (result.rows.length === 0) {
    throw new Error(`No history found for task with id ${taskId}`);
  }
  return result.rows;
}

export const getCalendarEvents = async (businessId: number, projectId?: number) => {
  let query = `
    SELECT
      t.id,
      t.title,
      t.description,
      t.due_date,
      t.project_id,
      s.name AS status_name,
      p.name AS project_name,
      COALESCE(array_agg(DISTINCT u.name) FILTER (WHERE u.id IS NOT NULL), ARRAY[]::text[]) AS assigned_users,
      COALESCE(array_agg(DISTINCT u.id) FILTER (WHERE u.id IS NOT NULL), ARRAY[]::integer[]) AS assigned_user_ids,
      t.created_at,
      t.updated_at
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    JOIN statuses s ON s.id = t.status_id
    LEFT JOIN task_assignments ta ON ta.task_id = t.id
    LEFT JOIN users u ON u.id = ta.user_id
    WHERE p.business_id = $1
      AND t.due_date IS NOT NULL
  `;

  const params: any[] = [businessId];

  if (projectId) {
    query += ` AND t.project_id = $2`;
    params.push(projectId);
  }

  query += `
    GROUP BY t.id, t.title, t.description, t.due_date, t.project_id, s.name, p.name, t.created_at, t.updated_at
    ORDER BY t.due_date ASC
  `;

  const result = await pool.query(query, params);
  return result.rows;
};

