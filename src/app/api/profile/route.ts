import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { cookies } from 'next/headers';

async function ensureUsersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      wishlist JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // ensure wishlist column exists for older tables
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS wishlist JSONB`);
}

export async function GET(request: Request) {
  try {
    await ensureUsersTable();
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value ?? null;
    if (!userId) return NextResponse.json({ user: null, ordersCount: 0 });

    const { rows } = await query<{ id: string; email: string; name: string; wishlist: any; created_at: string }>(`SELECT id, email, name, wishlist, created_at FROM users WHERE id = $1 LIMIT 1`, [userId]);
    const user = rows[0] || null;
    const { rows: orows } = await query<{ count: string }>(`SELECT COUNT(*)::text as count FROM orders WHERE user_id = $1`, [userId]);
    const ordersCount = Number(orows[0]?.count || 0);
    let wishlistCount = 0;
    try {
      wishlistCount = Array.isArray(user?.wishlist) ? user.wishlist.length : 0;
    } catch (e) { wishlistCount = 0; }
    return NextResponse.json({ user, ordersCount, wishlistCount });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureUsersTable();
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value ?? null;
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const name = body && typeof body.name === 'string' ? body.name.trim() : null;
    if (!name) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    await query(`UPDATE users SET name = $1 WHERE id = $2`, [name, userId]);
    const { rows } = await query<{ id: string; email: string; name: string; created_at: string }>(`SELECT id, email, name, created_at FROM users WHERE id = $1 LIMIT 1`, [userId]);
    return NextResponse.json({ user: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
