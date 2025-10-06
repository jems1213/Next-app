import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import bcrypt from 'bcryptjs';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    await ensureUsersTable();

    const { rows } = await query<{ id: string; password_hash: string; name: string }>(`SELECT id, password_hash, name FROM users WHERE email = $1 LIMIT 1`, [email]);
    const user = rows[0];
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const res = NextResponse.json({ id: user.id, email, name: user.name });
    res.cookies.set('user_id', user.id, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
