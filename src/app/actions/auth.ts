'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });

    redirect('/');
}
