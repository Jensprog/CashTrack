/**
 * Authentication middleware using HttpOnly cookies
 * 
 * This middleware verifies the JWT token from cookies and
 * attaches the user ID to the request context for protected routes.
 */

import { NextResponse } from 'next/server';
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
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            throw new AuthenticationError('Inte autentiserad');
        }
        
        // Verify the token
        const decoded = verifyToken(token);

        if (!decoded) {
            throw new AuthenticationError('Ogiltig eller utgången token');
        }
        
        // Create new headers object
        const requestHeaders = new Headers(request.headers);
        
        // Attach the user ID to the request headers
        requestHeaders.set('X-User-ID', decoded.userId);
        
        // Clone the request with the new headers
        const newRequest = new Request(request.url, {
            method: request.method,
            headers: requestHeaders,
            body: request.body,
            cache: request.cache,
            credentials: request.credentials,
            integrity: request.integrity,
            keepalive: request.keepalive,
            mode: request.mode,
            redirect: request.redirect,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            signal: request.signal,
        });
        
        // Continue to the API route with the modified request
        return NextResponse.next({
            request: newRequest,
        });
    } catch (error) {
        console.error('Authentication error:', error);
        return errorResponse(error);
    }
}