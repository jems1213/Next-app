import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";

async function ensureUsersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function GET(request: Request) {
  try {
    await ensureUsersTable();
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )user_id=([^;]+)/);
    const userId = match ? decodeURIComponent(match[1]) : null;
    if (!userId) return NextResponse.json({ user: null });

    const { rows } = await query<{ id: string; email: string; name: string }>(`SELECT id, email, name FROM users WHERE id = $1 LIMIT 1`, [userId]);
    const u = rows[0] || null;
    return NextResponse.json({ user: u });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
