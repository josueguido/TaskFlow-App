import { pool } from "../config/DB";
import { User } from "../interfaces/user.interface";

export const createUser = async (name: string, email: string, passwordHash: string, business_id: number, roleId = 3, status = 'active') => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, business_id, role_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, email, passwordHash, business_id, roleId, status]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1 AND status = 'active'`, [email]);
  return result.rows[0];
};

export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query(`SELECT id, name, email, role_id, business_id, created_at FROM users`);
  return result.rows;
};

export const getUsersByBusinessId = async (businessId: number): Promise<User[]> => {
  const result = await pool.query(
    `SELECT id, name, email, role_id, business_id, status, invited_at, activated_at, created_at FROM users WHERE business_id = $1`,
    [businessId]
  );
  return result.rows;
};

export const createUserInvite = async (email: string, business_id: number, role_id = 2) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verificar que el email no esté ya registrado
    const existingUser = await client.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Generar token único
    const inviteToken = await client.query('SELECT gen_random_uuid()::text as token');
    const token = inviteToken.rows[0].token;

    const query = `
      INSERT INTO users (email, business_id, role_id, status, invite_token, invited_at)
      VALUES ($1, $2, $3, 'pending', $4, NOW())
      RETURNING *
    `;

    const result = await client.query(query, [email, business_id, role_id, token]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findUserByInviteToken = async (inviteToken: string) => {
  const result = await pool.query(`
    SELECT * FROM users
    WHERE invite_token = $1 AND status = 'pending'
  `, [inviteToken]);

  return result.rows[0] || null;
};

export const completeUserSignup = async (inviteToken: string, name: string, passwordHash: string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verificar que el token existe y el usuario está pendiente
    const user = await client.query(
      'SELECT * FROM users WHERE invite_token = $1 AND status = $2',
      [inviteToken, 'pending']
    );

    if (user.rows.length === 0) {
      throw new Error('Invalid or expired invite token');
    }

    const query = `
      UPDATE users
      SET name = $1,
          password_hash = $2,
          status = 'active',
          activated_at = NOW(),
          invite_token = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE invite_token = $3
      RETURNING id, name, email, business_id, role_id, status, activated_at
    `;

    const result = await client.query(query, [name, passwordHash, inviteToken]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
