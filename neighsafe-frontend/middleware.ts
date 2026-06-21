import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access");

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // usuário não logado tentando acessar páginas protegidas
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // usuário logado tentando ir pro login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// aplicar middleware em todas as rotas, exceto /login
export const config = {
  matcher: ["/((?!login).*)"],
};