import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // simple validation
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // mock create order
    const id = Math.random().toString(36).slice(2, 10);
    const order = {
      id,
      items: body.items,
      total: body.total,
      createdAt: new Date().toISOString(),
    };

    // in a real app you'd persist the order. We'll just return it.
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
