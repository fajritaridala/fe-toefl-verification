import { getToken } from 'next-auth/jwt';
import { type NextRequest, NextResponse } from 'next/server';
import { AUTH_SECRET } from './utils/config/env';
import { JwtExt } from './utils/interfaces/Auth';

export async function middleware(request: NextRequest) {
  const token: JwtExt | null = await getToken({
    req: request,
    secret: AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    if (token?.user?.accessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
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

  if (pathname.startsWith('/peserta')) {
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (pathname === '/peserta') {
      return NextResponse.redirect(new URL('/peserta/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/admin/:path*'],
};
