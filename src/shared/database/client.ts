import { Pool } from 'pg';
import { env } from '../config/env.validator.js';

let pool: Pool | undefined;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
    });
  }

  return pool;
}
