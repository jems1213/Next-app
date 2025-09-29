import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname === '/checkout') {
    const cart = req.cookies.get('cart')?.value ?? '';
    try {
      const parsed = cart ? JSON.parse(decodeURIComponent(cart)) : [];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout'],
};
