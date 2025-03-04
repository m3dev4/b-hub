import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Définir les routes publiques
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password'
];

// Définir les routes protégées
const protectedRoutes = [
  '/pages/dashboard',
  '/pages/profile',
  '/pages/settings'
];

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("jwt");
  const path = request.nextUrl.pathname;

  // Vérifier si c'est une route publique
  const isPublicRoute = publicRoutes.includes(path);
  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  // Si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    // Bloquer l'accès aux routes protégées
    if (isProtectedRoute) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('redirect', path);
      loginUrl.searchParams.set('hl', 'fr');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Si l'utilisateur est authentifié
  if (isAuthenticated && isPublicRoute) {
    const dashboardUrl = new URL('/pages/dashboard', request.url);
    dashboardUrl.searchParams.set('hl', 'fr');
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};