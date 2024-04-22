import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();

  response.headers.set("x-pathname", request.nextUrl.pathname);

  if (!request.nextUrl.pathname.includes("sign-in" || "sign-up"))
    response.cookies.set({
      name: "callback_url",
      value: request.nextUrl.href,
      path: "/",
    });

  if (request.method === "GET") {
    return response;
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
