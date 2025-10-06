import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

async function ensureOrdersTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      items JSONB NOT NULL,
      total NUMERIC NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function GET(request: Request) {
  try {
    await ensureOrdersTable();
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )user_id=([^;]+)/);
    const userId = match ? decodeURIComponent(match[1]) : null;

    if (!userId) {
      // unauthenticated: return empty list
      return NextResponse.json([]);
    }

    const { rows } = await query<{ id: string; items: any; total: string; created_at: string }>(
      `SELECT id, items, total, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    return NextResponse.json(rows);
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

    // try to read user_id from cookies
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )user_id=([^;]+)/);
    let userId = match ? decodeURIComponent(match[1]) : null;

    const id = genId();
    const items = body.items;
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

    await query(
      `INSERT INTO orders (id, user_id, items, total) VALUES ($1, $2, $3, $4)`,
      [id, userId, JSON.stringify({ items, customer }), total]
    );

    const order = { id, items, total, createdAt: new Date().toISOString(), userId };
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureOrdersTable();
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/(?:^|; )user_id=([^;]+)/);
    const userId = match ? decodeURIComponent(match[1]) : null;

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
