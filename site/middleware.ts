import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UI = new Set(["studio", "spatial", "editorial"]);

export function middleware(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("ui");
  const requestHeaders = new Headers(req.headers);
  if (q && UI.has(q)) requestHeaders.set("x-jefe-ui", q);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (q && UI.has(q)) {
    res.cookies.set("jefe-ui", q, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
