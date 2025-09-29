import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie') || '';
    return NextResponse.json({ cookie });
  } catch (err) {
    return NextResponse.json({ error: 'error' }, { status: 500 });
  }
}
