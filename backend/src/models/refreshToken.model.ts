import { pool } from "../config/DB";

export const saveRefreshToken = (userId: number, token: string) =>
  pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
    [userId, token]
  );

export const findRefreshToken = (token: string) =>
  pool.query("SELECT * FROM refresh_tokens WHERE token = $1", [token]);

export const deleteRefreshToken = (token: string) =>
  pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
