import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Routes configuration
const protectedRoutes = ["/admin"];
const publicRoutes = ["/login"];
const apiRoutes = ["/api"];

// Secret key for JWT verification
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);
  const isApiRoute = apiRoutes.some((route) => path.startsWith(route));

  // Get the session token from cookies
  const sessionCookie = req.cookies.get("session");

  // Initialize with no session
  let isValidSession = false;
  let sessionData = null;

  // Verify the session token if it exists
  if (sessionCookie?.value) {
    try {
      // Verify JWT signature and decode payload
      const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET, {
        algorithms: ["HS256"],
      });

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp > currentTime) {
        isValidSession = true;
        sessionData = payload;
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      // Invalid token, proceed as if no session exists
    }
  }

  // Handle protected routes
  if (isProtectedRoute && !isValidSession) {
    // Redirect to login page with return URL
    const returnUrl = encodeURIComponent(req.nextUrl.pathname);
    const loginUrl = new URL(`/login?returnUrl=${returnUrl}`, req.nextUrl);

    const res = NextResponse.redirect(loginUrl);

    // Clear any invalid cookies
    res.cookies.delete("session");
    res.cookies.delete("accessToken");
    res.cookies.delete("user");

    return res;
  }

  // Handle API routes that require authentication
  if (isApiRoute && path.includes("/admin") && !isValidSession) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // Redirect logged-in users away from public routes
  if (isPublicRoute && isValidSession) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  // Add user info to request headers for server components
  if (isValidSession && sessionData) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", sessionData.userId as string);
    requestHeaders.set("x-user-role", sessionData.role as string);

    // Continue with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    "/admin/:path*",
    // Match public routes
    "/login",
    // Match API routes that need protection
    "/api/admin/:path*",
  ],
};
