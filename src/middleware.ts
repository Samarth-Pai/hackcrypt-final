import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const publicRoutes = new Set(['/', '/login', '/signup']);
    const isPublicRoute = publicRoutes.has(pathname);
    const isAssetRoute = pathname.startsWith('/_next') || pathname.startsWith('/assets') || pathname === '/favicon.ico';
    const isApiRoute = pathname.startsWith('/api');

    if (isPublicRoute || isAssetRoute || isApiRoute) {
        return NextResponse.next();
    }

    const token = request.cookies.get('session')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);

    if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
