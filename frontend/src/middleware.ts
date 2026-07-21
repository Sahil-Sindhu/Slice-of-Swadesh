import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Protected routes ─────────────────────────────────────────────────────────
// These patterns require a valid token cookie. Any request to these paths
// without a `swadesh-token` cookie is redirected to the login page.
const PROTECTED_PATTERNS = [
  /^\/profile(\/.*)?$/,
  /^\/cart$/,
  /^\/track(\/.*)?$/,
  /^\/dashboard(\/.*)?$/,
];

// ─── Auth-only routes ─────────────────────────────────────────────────────────
// Logged-in users visiting /login or /register are sent home.
const AUTH_ONLY_PATTERNS = [/^\/login$/, /^\/register$/];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('swadesh-token')?.value;
  const isLoggedIn = Boolean(token);

  // Redirect logged-out users away from protected pages
  if (!isLoggedIn && PROTECTED_PATTERNS.some((p) => p.test(pathname))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login / register
  if (isLoggedIn && AUTH_ONLY_PATTERNS.some((p) => p.test(pathname))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
