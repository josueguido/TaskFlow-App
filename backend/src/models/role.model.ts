import { pool } from "../config/DB";
import { IRole } from "../interfaces/role.interface";

export const getAllRoles = async () => {
  const result = await pool.query(`SELECT * FROM roles`);
  return result.rows as IRole[];
}

export const getRoleById = async (id: number) => {
  const result = await pool.query(`SELECT * FROM roles WHERE id = $1`, [id]);
  return result.rows[0] as IRole;
}

export const createRole = async (name: string) => {
  const result = await pool.query(`INSERT INTO roles (name) VALUES ($1) RETURNING *`, [name]);
  return result.rows[0] as IRole;
}

export const updateRole = async (id: number, name: string) => {
  const result = await pool.query(`UPDATE roles SET name = $1 WHERE id = $2 RETURNING *`, [name, id]);
  return result.rows[0] as IRole;
}

export const deleteRole = async (id: number) => {
  await pool.query(`DELETE FROM roles WHERE id = $1`, [id]);
  return { message: "Role deleted successfully" };
}
