import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { cookies as nextCookies } from 'next/headers';

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

  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS wishlist JSONB`);
}

function parseUserIdFromHeader(request: Request): string | null {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/(?:^|; )user_id=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  // This handler tries to be resilient: it will return a 200 JSON response with safe defaults
  // even when DB queries fail, so client can render sensible fallbacks instead of breaking.
  try {
    await ensureUsersTable();

    // Try server cookie helper first, fall back to parsing header (some runtime environments differ)
    let userId: string | null = null;
    try {
      const cs = await nextCookies();
      userId = cs.get('user_id')?.value ?? null;
    } catch (e) {
      userId = null;
    }
    if (!userId) userId = parseUserIdFromHeader(request);

    if (!userId) {
      return NextResponse.json({ user: null, ordersCount: 0, wishlistCount: 0 });
    }

    // Fetch user and orders count, but guard each DB call so a partial failure doesn't return a 5xx
    let user: any = null;
    try {
      const { rows } = await query<{ id: string; email: string; name: string; wishlist: any; created_at: string }>(
        `SELECT id, email, name, wishlist, created_at FROM users WHERE id = $1 LIMIT 1`,
        [userId]
      );
      user = rows[0] || null;
    } catch (e) {
      user = null;
    }

    let ordersCount = 0;
    try {
      const { rows: orows } = await query<{ count: string }>(`SELECT COUNT(*)::text as count FROM orders WHERE user_id = $1`, [userId]);
      ordersCount = Number(orows[0]?.count || 0);
    } catch (e) {
      ordersCount = 0;
    }

    let wishlistCount = 0;
    try {
      wishlistCount = Array.isArray(user?.wishlist) ? user.wishlist.length : 0;
    } catch (e) {
      wishlistCount = 0;
    }

    return NextResponse.json({ user, ordersCount, wishlistCount });
  } catch (err: any) {
    return NextResponse.json({ user: null, ordersCount: 0, wishlistCount: 0, error: String(err?.message ?? err) });
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureUsersTable();

    // read cookie robustly
    let userId: string | null = null;
    try {
      const cs = await nextCookies();
      userId = cs.get('user_id')?.value ?? null;
    } catch (e) {
      userId = parseUserIdFromHeader(request);
    }

    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const name = body && typeof body.name === 'string' ? body.name.trim() : null;
    const email = body && typeof body.email === 'string' ? body.email.trim().toLowerCase() : null;
    if (!name && !email) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    if (email) {
      const { rows: existing } = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [email]);
      if (existing.length > 0 && existing[0].id !== userId) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
      await query(`UPDATE users SET email = $1 WHERE id = $2`, [email, userId]);
    }

    if (name) {
      await query(`UPDATE users SET name = $1 WHERE id = $2`, [name, userId]);
    }

    const { rows } = await query<{ id: string; email: string; name: string; created_at: string }>(`SELECT id, email, name, created_at FROM users WHERE id = $1 LIMIT 1`, [userId]);
    return NextResponse.json({ user: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
