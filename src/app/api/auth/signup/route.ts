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

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = String(body.password || '');
    const name = body.name ? String(body.name) : null;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    await ensureUsersTable();

    // check existing
    const { rows: existing } = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const id = genId();

    await query(`INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)`, [id, email, hash, name]);

    const res = NextResponse.json({ id, email, name });
    // set session cookie (httpOnly)
    res.cookies.set('user_id', id, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
