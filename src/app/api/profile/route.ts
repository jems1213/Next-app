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
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS addresses JSONB`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_methods JSONB`);
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

    // allow client to pass ?email= when cookie isn't available (useful in some hosting/dev setups)
    const url = new URL(request.url);
    const emailParam = url.searchParams.get('email');

    // Fetch user and orders count, but guard each DB call so a partial failure doesn't return a 5xx
    let user: any = null;

    try {
      if (!userId && emailParam) {
        try {
          const { rows: urows } = await query<{ id: string; email: string; name: string; wishlist: any; created_at: string }>(
            `SELECT id, email, name, wishlist, created_at FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
            [String(emailParam).toLowerCase()]
          );
          if (urows && urows[0]) {
            user = urows[0];
            userId = urows[0].id;
          }
        } catch (e) {
          // ignore and continue
        }
      }

      if (!userId) {
        return NextResponse.json({ user: null, ordersCount: 0, wishlistCount: 0 });
      }

      const { rows } = await query<{
        id: string;
        email: string;
        name: string;
        wishlist: any;
        created_at: string;
        wishlist_count: number;
        addresses: any;
        payment_methods: any;
      }>(
        `SELECT id, email, name, wishlist, addresses, payment_methods, created_at, CASE WHEN jsonb_typeof(wishlist) = 'array' THEN jsonb_array_length(wishlist) ELSE 0 END AS wishlist_count FROM users WHERE id = $1 LIMIT 1`,
        [userId]
      );
      user = user || rows[0] || null;
      const wishlistCountFromDb = Number(rows[0]?.wishlist_count ?? 0);
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

    // prefer DB-derived wishlist count, fall back to client-side stored savedItems if needed
    let wishlistCount = 0;
    try {
      wishlistCount = Number(typeof wishlistCountFromDb !== 'undefined' ? wishlistCountFromDb : 0);
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
    const addresses = body && (Array.isArray(body.addresses) ? body.addresses : null);
    const payment_methods = body && (Array.isArray(body.payment_methods) ? body.payment_methods : null);

    if (!name && !email && addresses === null && payment_methods === null) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

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

    if (addresses !== null) {
      await query(`UPDATE users SET addresses = $1 WHERE id = $2`, [JSON.stringify(addresses), userId]);
    }

    if (payment_methods !== null) {
      await query(`UPDATE users SET payment_methods = $1 WHERE id = $2`, [JSON.stringify(payment_methods), userId]);
    }

    const { rows } = await query<{ id: string; email: string; name: string; created_at: string; addresses: any; payment_methods: any }>(`SELECT id, email, name, created_at, addresses, payment_methods FROM users WHERE id = $1 LIMIT 1`, [userId]);
    return NextResponse.json({ user: rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
