import { pool } from "../config/DB";
import { IStatus } from "../interfaces/status.interface";

export const getAllStatuses = async (businessId: number) => {
  const result = await pool.query(
    `SELECT * FROM statuses WHERE business_id = $1 ORDER BY "order" ASC`,
    [businessId]
  );
  return result.rows;
}

export const getStatusById = async (id: string, businessId: number): Promise<IStatus> => {
  const result = await pool.query(
    `SELECT * FROM statuses WHERE id = $1 AND business_id = $2`,
    [id, businessId]
  );
  if (result.rows.length === 0) {
    throw new Error(`Status with id ${id} not found`);
  }
  return result.rows[0];
}

export const createStatus = async (name: string, order: number, businessId: number): Promise<IStatus> => {
  const result = await pool.query(
    `INSERT INTO statuses (name, "order", business_id) VALUES ($1, $2, $3) RETURNING *`,
    [name, order, businessId]
  );
  return result.rows[0];
}

export const updateStatus = async (id: number, name: string, order: number, businessId: number): Promise<IStatus> => {
  const result = await pool.query(
    `UPDATE statuses SET name = $1, "order" = $2 WHERE id = $3 AND business_id = $4 RETURNING *`,
    [name, order, id, businessId]
  );
  if (result.rows.length === 0) {
    throw new Error(`Status with id ${id} not found`);
  }
  return result.rows[0];
}

export const deleteStatus = async (id: number, businessId: number): Promise<IStatus> => {
  const result = await pool.query(
    `DELETE FROM statuses WHERE id = $1 AND business_id = $2 RETURNING *`,
    [id, businessId]
  );
  if (result.rows.length === 0) {
    throw new Error(`Status with id ${id} not found`);
  }
  return result.rows[0];
}

