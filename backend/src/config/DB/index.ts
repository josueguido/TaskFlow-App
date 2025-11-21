import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? './config/DB/.env.production'
    : './config/DB/.env.dev',
});

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined, // Fixed this!!!!
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
