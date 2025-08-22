/**
 * @file Backend API route for user registration.
 *
 * This route handles user registration by accepting a username, email and password,
 * validating the input, creating a new user in the database,
 * and returning a JWT token for authentication.
 *
 */
import { createUser } from '@/services/userService';
import { createDefaultCategories } from '@/services/categoryService';
import { generateToken } from '@/lib/auth';
import { ValidationError } from '@/utils/errorClasses';
import { validateRegistrationForm } from '@/utils/validators';
import { successResponse, errorResponse } from '@/helpers/api';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    const validation = validateRegistrationForm({
      username,
      email,
      password,
      confirmPassword: password,
    });

    if (!validation.isValid) {
      throw new ValidationError(validation.message);
    }

    const newUser = await createUser(username, email, password);

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
