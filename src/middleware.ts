import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect dashboard and quiz routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/quiz')) {
        const token = request.cookies.get('session')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyJWT(token);

        if (!payload) {
            // Token is invalid
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Allowed
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/quiz/:path*'],
};
