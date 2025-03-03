import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("jwt");
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname === "/";
  const isVerifyEmailPage = request.nextUrl.pathname === "/auth/verify-email";

  // Si l'utilisateur est sur une page d'auth alors qu'il est déjà connecté
  // mais permettre l'accès à la page de vérification email
  if (isAuthenticated && isAuthPage && !isVerifyEmailPage) {
    return NextResponse.redirect(new URL("/pages/dashboard", request.url));
  }

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page protégée
  // Permettre l'accès à la page de vérification email même sans authentification
  if (!isAuthenticated && !isAuthPage && !isVerifyEmailPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configurer les chemins qui déclenchent le middleware
export const config = {
  matcher: [
    // Pages protégées
    "/pages/:path*",
    // Pages d'authentification
    "/auth/:path*",
    // Page racine
    "/",
  ],
};
