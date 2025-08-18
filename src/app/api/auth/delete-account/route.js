/**
 * @file Route that handles deletion of user data.
 */

import { authMiddleware } from '@/middlewares/authMiddleware';
import { prisma } from '@/lib/db';
import { successResponse } from '@/helpers/api';
import { handlePrismaError } from '@/utils/prismaErrorHandler';

export async function DELETE(request) {
  try {
    const userId = await authMiddleware(request);

    await prisma.transaction.deleteMany({
      where: { userId },
    });

    await prisma.category.deleteMany({
      where: { userId },
    });

    await prisma.transfer.deleteMany({
      where: { userId },
    });

    await prisma.savingsAccount.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    return successResponse(null, 'Kontot har raderats permanent', 200);
  } catch (error) {
    handlePrismaError(error, 'Account deletion');
  }
}
