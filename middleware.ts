import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const publicRoutes = ["/"]

  // Allow all requests to pass through
  // Auth will be handled client-side via localStorage
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customize/:path*",
    "/objectives/:path*",
    "/rewards/:path*",
    "/transactions/:path*",
    "/admin/:path*",
  ],
}
