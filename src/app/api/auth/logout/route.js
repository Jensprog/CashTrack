/**
 * @file Backend API route for user logout.
 *
 * This route handles user logout by clearing the authentication cookies.
 */

import { cookies } from 'next/headers';
import { successResponse, errorResponse } from '@/helpers/api';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear the authentication cookies
    cookieStore.delete('token');
    cookieStore.delete('csrf_secret');

    return successResponse(null, 'Utloggning lyckades', 200);
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse(error);
  }
}
