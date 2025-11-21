import { pool } from "../config/DB";
import { IProjectUser, IProjectUserWithUser } from "../interfaces/projectUsers.interface";
import { NotFoundError } from '../errors/NotFoundError';

// Agregar usuario a proyecto
export const addUserToProject = async (projectId: number, userId: number, role: 'admin' | 'member' = 'member'): Promise<IProjectUser> => {
  const result = await pool.query(
    `INSERT INTO project_users (project_id, user_id, role)
     VALUES ($1, $2, $3)
     RETURNING id, project_id, user_id, role, created_at, updated_at`,
    [projectId, userId, role]
  );

  if (result.rows.length === 0) {
    throw new Error('Failed to add user to project');
  }

  return result.rows[0];
};

// Obtener usuarios de un proyecto
export const getProjectUsers = async (projectId: number): Promise<IProjectUserWithUser[]> => {
  const result = await pool.query(
    `SELECT
       pu.id,
       pu.project_id,
       pu.user_id,
       pu.role,
       pu.created_at,
       pu.updated_at,
       u.id as user_id_obj,
       u.name,
       u.email
     FROM project_users pu
     JOIN users u ON pu.user_id = u.id
     WHERE pu.project_id = $1
     ORDER BY pu.created_at ASC`,
    [projectId]
  );

  return result.rows.map(row => ({
    id: row.id,
    project_id: row.project_id,
    user_id: row.user_id,
    role: row.role,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: {
      id: row.user_id_obj,
      name: row.name,
      email: row.email
    }
  }));
};

// Obtener rol del usuario en un proyecto
export const getUserRoleInProject = async (projectId: number, userId: number): Promise<'admin' | 'member' | null> => {
  const result = await pool.query(
    `SELECT role FROM project_users WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].role;
};

// Quitar usuario de proyecto
export const removeUserFromProject = async (projectId: number, userId: number): Promise<void> => {
  const result = await pool.query(
    `DELETE FROM project_users WHERE project_id = $1 AND user_id = $2 RETURNING id`,
    [projectId, userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found in project');
  }
};

// Cambiar rol del usuario en proyecto
export const updateUserRoleInProject = async (projectId: number, userId: number, role: 'admin' | 'member'): Promise<IProjectUser> => {
  const result = await pool.query(
    `UPDATE project_users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE project_id = $2 AND user_id = $3 RETURNING id, project_id, user_id, role, created_at, updated_at`,
    [role, projectId, userId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found in project');
  }

  return result.rows[0];
};

// Obtener proyectos del usuario actual
export const getProjectsByUser = async (userId: number, businessId: number) => {
  const result = await pool.query(
    `SELECT
       p.id,
       p.business_id,
       p.name,
       p.description,
       p.created_at,
       p.updated_at,
       pu.role
     FROM projects p
     JOIN project_users pu ON pu.project_id = p.id
     WHERE pu.user_id = $1 AND p.business_id = $2
     ORDER BY p.created_at DESC`,
    [userId, businessId]
  );

  return result.rows;
};

// Verificar si usuario es admin en el proyecto
export const isProjectAdmin = async (projectId: number, userId: number): Promise<boolean> => {
  const role = await getUserRoleInProject(projectId, userId);
  return role === 'admin';
};

// Contar usuarios en un proyecto
export const countProjectUsers = async (projectId: number): Promise<number> => {
  const result = await pool.query(
    `SELECT COUNT(*) as count FROM project_users WHERE project_id = $1`,
    [projectId]
  );

  return parseInt(result.rows[0].count, 10);
};
