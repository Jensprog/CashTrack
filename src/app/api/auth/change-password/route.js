/**
 * Route that handles password change.
 */

import { authMiddleware } from '@/middlewares/authMiddleware';
import { comparePassword, hashPassword } from '@/lib/auth';
import { AuthenticationError } from '@/errors/classes';
import { successResponse, errorResponse } from '@/helpers/api';
import { getUserById } from '@/services/userService';
import { prisma } from '@/lib/db';

export async function PUT(request) {
  try {
    const userId = await authMiddleware(request);
    if (userId instanceof Response) {
      return userId;
    }

    const { currentPassword, newPassword } = await request.json();

    const user = await getUserById(userId);

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AuthenticationError('Nuvarande lösenord är felaktigt.');
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return successResponse(null, 'Lösenordet har ändrats', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
