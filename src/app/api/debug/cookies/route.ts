import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '../../../lib/db';

export async function GET(request: Request) {
  try {
    // server-side cookieStore
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value ?? null;

    // raw cookie header
    const cookieHeader = request.headers.get('cookie') || null;

    // db ping and user lookup
    let db = 'unknown';
    let user = null;
    try {
      const { rows } = await query('SELECT NOW() as now');
      db = rows && rows.length ? 'ok' : 'no_rows';
    } catch (e) {
      db = 'error';
    }

    if (userId) {
      try {
        const { rows } = await query(`SELECT id, email, name, created_at FROM users WHERE id = $1 LIMIT 1`, [userId]);
        user = rows[0] || null;
      } catch (e) {
        user = null;
      }
    }

    return NextResponse.json({ userId, cookieHeader, db, user });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
