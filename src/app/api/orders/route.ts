import { NextResponse } from 'next/server';
import { query } from "../../../lib/db";
import { cookies as cookieStore } from 'next/headers';

async function ensureOrdersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      items JSONB,
      shipping JSONB,
      raw JSONB,
      total NUMERIC NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // for existing tables, ensure columns exist
  await query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping JSONB`);
  await query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS raw JSONB`);
  await query(`ALTER TABLE orders ALTER COLUMN items TYPE JSONB USING items::jsonb`);
}

export async function GET(request: Request) {
  try {
    await ensureOrdersTable();
    const url = new URL(request.url);
    let userId = cookieStore().get('user_id')?.value ?? null;
    const emailParam = url.searchParams.get('email');

    // If no cookie userId but email query param is provided, try to resolve user id by email
    if (!userId && emailParam) {
      try {
        const { rows: urows } = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [String(emailParam).toLowerCase()]);
        if (urows && urows[0] && urows[0].id) userId = urows[0].id;
      } catch (e) {}
    }

    if (!userId) {
      // unauthenticated: return empty list
      return NextResponse.json([]);
    }

    const { rows } = await query<{ id: string; items: any; shipping: any; total: string; created_at: string }>(
      `SELECT id, items, shipping, total, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    // normalize rows
    const out = rows.map((r: any) => ({ id: r.id, items: r.items || (r.raw && r.raw.items) || [], customer: r.shipping || (r.raw && r.raw.customer) || null, total: Number(r.total || 0), created_at: r.created_at }));
    return NextResponse.json(out);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function computeTotal(items: any[]): number {
  try {
    return items.reduce((s, it) => s + Number(it.price) * Number(it.quantity || 1), 0);
  } catch {
    return 0;
  }
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await ensureOrdersTable();

    // try to read user_id from the Next cookie store
    let userId = cookieStore().get('user_id')?.value ?? null;
    // fallback: parse cookie header (some environments may not populate next/headers)
    if (!userId) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/(?:^|; )user_id=([^;]+)/);
      userId = match ? decodeURIComponent(match[1]) : null;
    }

    const id = genId();
    const items = body.items || [];
    const total = Number(body.total ?? computeTotal(items));
    const customer = body.customer ? body.customer : null;

    // Fallback: if no user_id cookie, but customer email matches a user, associate order to that user
    if (!userId && customer && customer.email) {
      try {
        const { rows: urows } = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1 LIMIT 1`, [String(customer.email).toLowerCase()]);
        if (urows && urows[0] && urows[0].id) userId = urows[0].id;
      } catch (e) {
        // ignore
      }
    }

    // store items separately and shipping/customer info separately, and keep raw payload
    await query(
      `INSERT INTO orders (id, user_id, items, shipping, raw, total) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, userId, JSON.stringify(items), JSON.stringify(customer), JSON.stringify(body), total]
    );

    const order = { id, items, customer, total, createdAt: new Date().toISOString(), userId };
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureOrdersTable();
    const userId = cookieStore().get('user_id')?.value ?? null;

    const body = await request.json().catch(() => ({}));
    const id = body && typeof body.id === 'string' ? body.id : null;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (id) {
      await query(`DELETE FROM orders WHERE id = $1 AND user_id = $2`, [id, userId]);
      return NextResponse.json({ ok: true });
    }

    // delete all orders for this user
    await query(`DELETE FROM orders WHERE user_id = $1`, [userId]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
