/**
 * Authentication middleware using HttpOnly cookies
 * 
 * This middleware verifies the JWT token from cookies and
 * attaches the user ID to the request context for protected routes.
 */

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { AuthenticationError } from '@/errors/classes';
import { csrfMiddleware } from './csrfMiddleware';

/**
 * Authentication middleware for Next.js API routes
 * 
 * @param {Request} request - The incoming request.
 * @returns {Promise<NextResponse>} - The response or null to continue
 */
export async function authMiddleware(request) {
    try {
        // Check CSRF protection for non-GET requests
        const csrfResponse = await csrfMiddleware(request);
        if (csrfResponse) {
            return csrfResponse;
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
    } catch (error) {
        console.error('Authentication error:', error);
        return errorResponse(error);
    }
}