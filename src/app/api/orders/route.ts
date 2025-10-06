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

export async function GET() {
  try {
    await ensureOrdersTable();
    const { rows } = await query<{ id: string; items: any; total: string; created_at: string }>(
      `SELECT id, items, total, created_at FROM orders ORDER BY created_at DESC LIMIT 50`
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
    const userId = match ? decodeURIComponent(match[1]) : null;

    const id = genId();
    const items = body.items;
    const total = Number(body.total ?? computeTotal(items));
    const customer = body.customer ? body.customer : null;

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
