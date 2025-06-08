/**
 * @file Backend API route for user registration.
 *
 * This route handles user registration by accepting an email and password,
 * validating the input, creating a new user in the database,
 * and returning a JWT token for authentication.
 *
 */
import { createUser } from '@/services/userService';
import { createDefaultCategories } from '@/services/categoryService';
import { generateToken } from '@/lib/auth';
import { ValidationError } from '@/errors/classes';
import { successResponse, errorResponse } from '@/helpers/api';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Ogiltig e-postadress');
    }

    if (password.length < 8) {
      throw new ValidationError('Lösenordet måste vara minst 8 tecken långt');
    }

    const newUser = await createUser(email, password);

    await createDefaultCategories(newUser.id);

    const token = generateToken(newUser.id);

    return successResponse(
      { user: newUser, token },
      'Registreringen lyckades! Du kan nu logga in.',
      201,
    );
  } catch (error) {
    return errorResponse(error);
  }
}
