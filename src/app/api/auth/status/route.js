/**
 * @file Backend API route for checking authentication status.
 *
 * This route verifies if the user is logged in and returns the user information.
 */

import { getUserById } from '@/services/userService';
import { ValidationError } from '@/utils/errorClasses';
import { successResponse, errorResponse } from '@/helpers/api';
import { authMiddleware } from '@/middlewares/authMiddleware';

export async function GET(request) {
  try {
    const userId = await authMiddleware(request);

    // Fetch user information
    const user = await getUserById(userId);

    if (!user) {
      throw new ValidationError('Användaren hittades inte');
    }
    // eslint-disable-next-line no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return successResponse({ user: userWithoutPassword }, 'Användarinformation hämtad', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
