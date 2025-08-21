/**
 * Route that handles username change.
 */

import { authMiddleware } from '@/middlewares/authMiddleware';
import { successResponse } from '@/helpers/api';
import { handlePrismaError } from '@/utils/prismaErrorHandler';
import { prisma } from '@/lib/db';

export async function PUT(request) {
  try {
    const userId = await authMiddleware(request);

    const { newUsername } = await request.json();

    await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });

    return successResponse(null, 'Användarnamnet har ändrats', 200);
  } catch (error) {
    handlePrismaError(error, 'Username change');
  }
}
