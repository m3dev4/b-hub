import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("jwt");
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname === "/";

  // Si l'utilisateur est sur une page d'auth alors qu'il est déjà connecté
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/pages/dashboard", request.url));
  }

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page protégée
  if (!isAuthenticated && !isAuthPage) {
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
