import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return new NextResponse(
      "Server misconfigured: AUTH_SECRET not set",
      { status: 500 }
    );
  }
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifySessionToken(token, secret);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Protect everything under /admin except /admin/login
export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
