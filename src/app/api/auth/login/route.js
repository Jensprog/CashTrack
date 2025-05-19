/**
 * Backend API route for user login with enhanced security.
 *
 * This route handles user login and sets HttpOnly cookies for authentication
 * instead of returning the token in the response body.
 * It also implements CSRF protection.
 */
import { getUserByEmail } from '@/services/userService';
import { comparePassword, generateToken } from '@/lib/auth';
import { AuthenticationError } from '@/errors/classes';
import { successResponse, errorResponse } from '@/helpers/api';
import { cookies } from 'next/headers';
import csrf from 'csrf';

const tokens = new csrf();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Check if email exists
    const user = await getUserByEmail(email);
    if (!user) {
      throw new AuthenticationError('Ogiltig e-postadress eller lösenord');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Ogiltig e-postadress eller lösenord');
    }

    // Generate JWT token
    const token = generateToken(user.id);

    const csrfSecret = tokens.secretSync();
    const csrfToken = tokens.create(csrfSecret);

    const cookieStore = await cookies();

    // Set Httponly cookie with the JWT token
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      mageAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    cookieStore.set('csrf_secret', csrfSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Return success response with token and user (excluding password)
    // eslint-disable-next-line no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
        csrfToken,
      },
      'Inloggning lyckades!',
      200,
    );
  } catch (error) {
    return errorResponse(error);
  }
}
