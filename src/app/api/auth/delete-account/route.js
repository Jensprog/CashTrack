/**
 * Route that handles deletion of user data.
 */

import { authMiddleware } from '@/middlewares/authMiddleware';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/helpers/api';

export async function DELETE(request) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    await prisma.transaction.deleteMany({
      where: { userId },
    });

    await prisma.category.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    return successResponse(null, 'Kontot har raderats permanent', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
