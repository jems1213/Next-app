import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    let db = 'unknown';
    try {
      const { rows } = await query<{ now: string }>(`SELECT NOW() as now`);
      db = rows[0]?.now ? 'ok' : 'no_rows';
    } catch (e: any) {
      db = `error`;
    }
    return NextResponse.json({ cookie, db });
  } catch (err) {
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
