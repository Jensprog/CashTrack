/**
 * Backend API route for user logout.
 *
 * This route handles user logout by clearing the authentication cookies.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { successResponse } from '@/helpers/api';

export async function POST() {
  try {
    const cookieStore = await cookies();

    const cookiePath = process.env.NODE_ENV === 'production' ? '/cashtrack' : '/';
    console.log('Deleting cookies with path:', cookiePath);

    // Clear the authentication cookies
    cookieStore.delete('token', { path: cookiePath });
    cookieStore.delete('csrf_secret', { path: cookiePath });

    return successResponse(null, 'Utloggning lyckades', 200);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ett fel inträffade vid utloggning',
      },
      { status: 500 },
    );
  }
}
