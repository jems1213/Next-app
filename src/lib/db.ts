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

  // Disable TLS certificate verification to avoid "self-signed certificate" errors with managed Postgres providers.
  // Caution: this weakens TLS verification. For production, consider a proper CA or provide a cert bundle.
  try {
    // eslint-disable-next-line no-process-env
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  } catch (e) {}

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
