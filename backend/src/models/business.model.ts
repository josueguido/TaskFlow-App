import { pool } from "../config/DB";
import { IBusiness, ICreateBusiness } from '../interfaces/business.interface';
import { NotFoundError } from '../errors/NotFoundError';

export const createBusiness = async (businessData: ICreateBusiness) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const query = `
      INSERT INTO businesses (name)
      VALUES ($1)
      RETURNING *
    `;

    const result = await client.query(query, [
      businessData.name
    ]);

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const getBusinessById = async (businessId: string): Promise<IBusiness> => {
  const result = await pool.query(`
    SELECT * FROM businesses WHERE id = $1
  `, [businessId]);

  if (result.rows.length === 0) {
    throw new NotFoundError(`Business with ID ${businessId} not found`);
  }

  return result.rows[0];
}

export const updateBusinessOwner = async (businessId: string, ownerId: string) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const businessCheck = await client.query('SELECT id FROM businesses WHERE id = $1', [businessId]);
    if (businessCheck.rows.length === 0) throw new NotFoundError('Business not found');

    const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [ownerId]);
    if (userCheck.rows.length === 0) throw new NotFoundError('User not found');

    const query = `
      UPDATE businesses
      SET owner_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await client.query(query, [ownerId, businessId]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const getAllBusinesses = async (): Promise<IBusiness[]> => {
  const result = await pool.query(`
    SELECT
      b.*,
      u.name as owner_name,
      u.email as owner_email
    FROM businesses b
    LEFT JOIN users u ON b.owner_id = u.id
    ORDER BY b.created_at DESC
  `);
  return result.rows;
}
