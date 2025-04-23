/**
 * Manual test file for user service functions
 * Testing through Postman to see if the user is stored in the db or not.
 * 
 */
import { getUserByEmail } from '@/services/userService';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: 'Email parameter required' }, { status: 400});
    }

    try {
        const user = await getUserByEmail(email);
        return NextResponse.json({
            user: user ? { ...user, password: 'HIDDEN' } : null,
            found: !!user
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}