/**
 * This is a test API route to verify the database connection and
 * to unit test different functions seperately.
 * 
 */
import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/auth';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email parameter required' }, { status: 400});
    }

    try {
        const user = await getUserByEmail(email);
        return NextResponse.json({
            user: user ? { ...user, password: 'HIDDEN' } : null,
            found: !!user
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}