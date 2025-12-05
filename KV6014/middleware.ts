// middleware.ts
// Purpose:
// - Protect certain routes so only logged-in users can see them
// - Leave API routes and public pages alone
// - Use NextAuth JWT token to detect login state

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Routes that anyone can visit (no login required)
const PUBLIC_ROUTES = new Set<string>([
    "/",        // landing or home page
    "/login",
    "/signup",
    "/legal",
    "/faq"
]);

// Helper to decide if a path needs authentication
function requiresAuth(pathname: string) {
    // Everything under these prefixes is protected
    if (pathname.startsWith("/profile")) return true;
    if (pathname.startsWith("/training")) return true;
    if (pathname.startsWith("/messaging")) return true;
    // Add more as you build the app
    return false;
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // 1) Let API routes through untouched (we handle auth inside API if needed)
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    // 2) Allow Next.js internals and static assets
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/static") ||
        pathname.startsWith("/images") ||
        pathname === "/favicon.ico"
    ) {
        return NextResponse.next();
    }

    // 3) Always allow NextAuth internal routes
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // 4) Read JWT token from cookie using NextAuth secret
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    // 5) If route is public, just let it through
    if (PUBLIC_ROUTES.has(pathname)) {
        return NextResponse.next();
    }

    // 6) If route requires auth and user is NOT logged in -> redirect to /login
    if (requiresAuth(pathname) && !token) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 7) Default: allow
    return NextResponse.next();
}

// Tell Next.js to run this middleware on all routes;
// we filter inside the function.
export const config = {
    matcher: ["/:path*"]
};
