/**
 * CSRF protection middleware
 * This middleware verifies that incoming non-GET requests have a valid CSRF token.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Csrf } from 'csrf';
import { ForbiddenError } from '@/errors/classes';
import csrf from 'csrf';

const tokens = new csrf();

/**
 * Middleware to validate CSRF tokens
 * 
 * @param {Request} request - The incoming request.
 * @returns {Promise<NextResponse>} - The response or null to continue
 */
export async function csrfMiddleware(request) {
    // Only check non-GET methods
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
        try {
            // Get CSRF secret from cookies
            const cookieStore = cookies();
            const csrfSecret = cookieStore.get('csrf_secret')?.value;

            if (!csrfSecret) {
             throw new ForbiddenError('CSRF verifiering misslyckades');
            }
            
            // Get CSRF token from headers
            const csrfToken = request.headers.get('X-CSRF-Token');

            if (!csrfToken) {
                throw new ForbiddenError('CSRF-token saknas');
            }
            
            // Verify the CSRF token
            const isValid = tokens.verify(csrfSecret, csrfToken);

            if (!isValid) {
               throw new ForbiddenError('Ogiltig CSRF-token');
            }
        } catch (error) {
            console.error('CSRF validation error:', error);
            return errorResponse(error);
        }
    }
    
    // Continue to the next middleware or route handler
    return null;
}
