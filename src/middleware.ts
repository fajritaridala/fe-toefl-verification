import { NextResponse, type NextRequest } from 'next/server';
import { JwtExt } from './utils/interfaces/Auth';
import { getToken } from 'next-auth/jwt';
import { AUTH_SECRET } from './utils/config/env';

export async function middleware(request: NextRequest) {
  const token: JwtExt | null = await getToken({
    req: request,
    secret: AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  if (pathname === 'auth/login' || pathname === 'auth.register') {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (token?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/participant')) {
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (pathname === '/participant') {
      return NextResponse.redirect(new URL('/participant/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*'],
};
