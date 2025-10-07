import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
  try {
    // Update orders where user_id is NULL but shipping->>'email' or raw->'customer'->>'email' matches a user
    const updateSql = `
      UPDATE orders o
      SET user_id = u.id
      FROM users u
      WHERE o.user_id IS NULL
        AND (
          (o.shipping->>'email') IS NOT NULL AND LOWER(o.shipping->>'email') = LOWER(u.email)
          OR ((o.raw->'customer'->>'email') IS NOT NULL AND LOWER(o.raw->'customer'->>'email') = LOWER(u.email))
        )
      RETURNING o.id, o.user_id, o.shipping, o.raw;
    `;

    const { rows } = await query(updateSql);

    return NextResponse.json({ updated: rows.length, rows });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 });
  }
}
