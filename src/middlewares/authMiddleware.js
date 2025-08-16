/**
 * @file Authentication middleware using HttpOnly cookies
 *
 * This middleware verifies the JWT token from cookies and
 * throws errors instead of returning Response objects, allowing
 * the calling route to handle errors in its catch block.
 */

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { AuthenticationError } from '@/utils/errorClasses';
import { csrfMiddleware } from './csrfMiddleware';

/**
 * Authentication middleware for Next.js API routes
 *
 * @param {Request} request - The incoming request.
 * @returns {Promise<string>} - The user ID if authentication succeeds
 * @throws {AuthenticationError} - If authentication fails
 */
export async function authMiddleware(request) {
  // Check CSRF protection for non-GET requests
  const csrfResponse = await csrfMiddleware(request);
  if (csrfResponse) {
    throw new AuthenticationError('CSRF verifiering misslyckades');
  }

  // Get token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new AuthenticationError('Inte autentiserad');
  }

  // Verify the token
  const decoded = verifyToken(token);

  if (!decoded) {
    throw new AuthenticationError('Ogiltig eller utgången token');
  }

  // Return the user ID
  return decoded.userId;
}
