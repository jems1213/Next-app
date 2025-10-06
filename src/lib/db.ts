import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  // Some hosted Postgres providers use certificates that may not be verifiable in dev.
  // For development, disable TLS certificate verification to avoid "self-signed certificate" errors.
  // NOTE: Keep this restricted to non-production environments.
  if (process.env.NODE_ENV !== 'production') {
    try {
      // eslint-disable-next-line no-process-env
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    } catch (e) {}
  }

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
}

export const pool: Pool = global.pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") global.pgPool = pool;

export async function query<T = any>(text: string, params?: any[]): Promise<{ rows: T[] }> {
  return pool.query(text, params);
}
