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
// Logged-in users visiting /register are redirected away.
const AUTH_ONLY_PATTERNS = [/^\/register$/];

// JWT decoder helper for Next.js Edge Runtime
function decodeJwt(token: string): { id: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

// Map roles to their target landing dashboards
function getRoleDashboardRoute(role: string): string {
  switch (role) {
    case 'admin':
    case 'superadmin':
      return '/dashboard/admin';
    case 'chef':
      return '/dashboard/kitchen';
    case 'manager':
    case 'cashier':
    case 'delivery':
      return '/dashboard/employee';
    default:
      return '/unauthorized';
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('swadesh-token')?.value;
  const isLoggedIn = Boolean(token);
  const user = token ? decodeJwt(token) : null;
  const role = user?.role || '';

  // Redirect logged-out users away from protected pages
  if (!isLoggedIn && PROTECTED_PATTERNS.some((p) => p.test(pathname))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login / register
  if (isLoggedIn && AUTH_ONLY_PATTERNS.some((p) => p.test(pathname))) {
    const defaultRoute = getRoleDashboardRoute(role);
    return NextResponse.redirect(new URL(defaultRoute === '/unauthorized' ? '/' : defaultRoute, request.url));
  }

  // Strict role verification for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Direct requests to root /dashboard or /dashboard/
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      const targetRoute = getRoleDashboardRoute(role);
      return NextResponse.redirect(new URL(targetRoute, request.url));
    }

    // Kitchen dashboard authorization check
    if (pathname.startsWith('/dashboard/kitchen')) {
      const allowed = ['chef', 'admin', 'superadmin'];
      if (!allowed.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    // Employee dashboard authorization check
    else if (pathname.startsWith('/dashboard/employee')) {
      const allowed = ['manager', 'cashier', 'delivery', 'admin', 'superadmin'];
      if (!allowed.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
    // All other dashboards (admin, analytics, ai, crm, communication, inventory, franchise)
    else {
      const allowed = ['admin', 'superadmin'];
      if (!allowed.includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
