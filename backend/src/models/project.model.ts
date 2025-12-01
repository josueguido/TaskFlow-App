import { pool } from "../config/DB";
import { IProject } from '../interfaces/project.interface';
import { NotFoundError } from '../errors/NotFoundError';

export const getProjects = async () => {
  const result = await pool.query(`
    SELECT
      id,
      business_id,
      name,
      description,
      created_at,
      updated_at
    FROM projects
    ORDER BY created_at DESC
  `);
  return result.rows;
}

export const getProjectsByBusinessId = async (businessId: string) => {
  const result = await pool.query(`
    SELECT
      id,
      business_id,
      name,
      description,
      created_at,
      updated_at
    FROM projects
    WHERE business_id = $1
    ORDER BY created_at DESC
  `, [businessId]);

  return result.rows;
}

export const getProjectById = async (projectId: string) => {
  const result = await pool.query(`
    SELECT
      id,
      business_id,
      name,
      description,
      created_at,
      updated_at
    FROM projects
    WHERE id = $1
  `, [projectId]);

  if (result.rows.length === 0) {
    throw new NotFoundError(`Project with ID ${projectId} not found`);
  }

  return result.rows[0];
}

export const createProject = async (projectData: { business_id: string, name: string, description?: string, creatorUserId?: number }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const query = `
      INSERT INTO projects (business_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        business_id,
        name,
        description,
        created_at,
        updated_at
    `;

    const result = await client.query(query, [
      parseInt(projectData.business_id, 10),
      projectData.name,
      projectData.description || null
    ]);

    const projectId = result.rows[0].id;

    // Agregar automáticamente al creador como admin si se proporciona
    if (projectData.creatorUserId) {
      await client.query(
        `INSERT INTO project_users (project_id, user_id, role) VALUES ($1, $2, 'admin')`,
        [projectId, projectData.creatorUserId]
      );
    }

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const updateProject = async (projectId: string, updateData: { name?: string, description?: string }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const projectCheck = await client.query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) throw new NotFoundError('Project not found');

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      values.push(updateData.name);
    }

    if (updateData.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      values.push(updateData.description);
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(projectId);

    const query = `
      UPDATE projects
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING
        id,
        business_id,
        name,
        description,
        created_at,
        updated_at
    `;

    const result = await client.query(query, values);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const deleteProject = async (projectId: string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const projectCheck = await client.query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (projectCheck.rows.length === 0) throw new NotFoundError('Project not found');

    const result = await client.query(`
      DELETE FROM projects WHERE id = $1 RETURNING *
    `, [projectId]);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const getProjectStats = async (businessId: string) => {
  const result = await pool.query(`
    SELECT
      COUNT(*) as total_projects,
      COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_projects
    FROM projects
    WHERE business_id = $1
  `, [businessId]);

  return result.rows[0];
}
