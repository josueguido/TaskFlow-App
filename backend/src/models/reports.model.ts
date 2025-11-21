import { pool } from "../config/DB";

export const getOverviewReport = async (businessId: number) => {
  const result = await pool.query(`
    SELECT
      COUNT(t.id) AS total_tasks,
      SUM(CASE WHEN s.name = 'Done' THEN 1 ELSE 0 END) AS completed_tasks,
      COUNT(t.id) - SUM(CASE WHEN s.name = 'Done' THEN 1 ELSE 0 END) AS pending_tasks,
      ROUND(SUM(CASE WHEN s.name = 'Done' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(t.id), 0), 2) AS completion_rate
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    LEFT JOIN statuses s ON s.id = t.status_id
    WHERE p.business_id = $1
  `, [businessId]);

  return result.rows[0] || {
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    completion_rate: 0
  };
};

export const getProjectProgressReport = async (businessId: number) => {
  const result = await pool.query(`
    SELECT
      p.id AS project_id,
      p.name AS project_name,
      COUNT(t.id) AS total_tasks,
      SUM(CASE WHEN s.name = 'Done' THEN 1 ELSE 0 END) AS completed_tasks,
      ROUND(SUM(CASE WHEN s.name = 'Done' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(t.id), 0), 2) AS completion_rate
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    LEFT JOIN statuses s ON s.id = t.status_id
    WHERE p.business_id = $1
    GROUP BY p.id, p.name
    ORDER BY completion_rate DESC
  `, [businessId]);

  return result.rows;
};

export const getActivityReport = async (businessId: number, limit: number = 20) => {
  const result = await pool.query(`
    SELECT
      th.id,
      th.task_id,
      t.title AS task_title,
      th.field_changed,
      th.old_value,
      th.new_value,
      u.name AS changed_by,
      th.changed_at
    FROM task_history th
    JOIN tasks t ON t.id = th.task_id
    JOIN projects p ON p.id = t.project_id
    JOIN users u ON u.id = th.user_id
    WHERE p.business_id = $1
    ORDER BY th.changed_at DESC
    LIMIT $2
  `, [businessId, limit]);

  return result.rows;
};

export const getUserWorkloadReport = async (businessId: number) => {
  const result = await pool.query(`
    SELECT
      u.id AS user_id,
      u.name AS user_name,
      u.email,
      COUNT(DISTINCT ta.task_id) AS assigned_tasks,
      SUM(CASE WHEN s.name = 'Done' THEN 1 ELSE 0 END) AS completed_tasks,
      COUNT(DISTINCT ta.task_id) - SUM(CASE WHEN s.name = 'Done' THEN 1 ELSE 0 END) AS pending_tasks
    FROM users u
    LEFT JOIN task_assignments ta ON ta.user_id = u.id
    LEFT JOIN tasks t ON t.id = ta.task_id
    LEFT JOIN projects p ON p.id = t.project_id
    LEFT JOIN statuses s ON s.id = t.status_id
    WHERE u.business_id = $1
    GROUP BY u.id, u.name, u.email
    ORDER BY assigned_tasks DESC
  `, [businessId]);

  return result.rows;
};

export const getStatusDistributionReport = async (businessId: number) => {
  const result = await pool.query(`
    SELECT
      s.id AS status_id,
      s.name AS status_name,
      COUNT(t.id) AS total_tasks,
      s."order"
    FROM statuses s
    LEFT JOIN tasks t ON t.status_id = s.id
    LEFT JOIN projects p ON p.id = t.project_id
    WHERE p.business_id = $1 OR p.business_id IS NULL
    GROUP BY s.id, s.name, s."order"
    ORDER BY s."order" ASC
  `, [businessId]);

  return result.rows;
};

export const getCombinedReport = async (businessId: number) => {
  const [overview, projects, statuses, users, activity] = await Promise.all([
    getOverviewReport(businessId),
    getProjectProgressReport(businessId),
    getStatusDistributionReport(businessId),
    getUserWorkloadReport(businessId),
    getActivityReport(businessId, 10)
  ]);

  return {
    overview,
    projects,
    statuses,
    users,
    activity
  };
};
