/**
 * Route that handles avatar upload.
 */

import { authMiddleware } from '@/middlewares/authMiddleware';
import { successResponse, errorResponse } from '@/helpers/api';
import { ValidationError } from '@/utils/errorClasses';
import { prisma } from '@/lib/db';

export async function PUT(request) {
  try {
    const userId = await authMiddleware(request);

    const { avatar } = await request.json();

    if (!avatar) {
      throw new ValidationError('Avatar data is required');
    }

    // Validate that it's a base64 image
    if (!avatar.startsWith('data:image/')) {
      throw new ValidationError('Invalid image format');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: { id: true, email: true, username: true, avatar: true },
    });

    return successResponse(updatedUser, 'Avatar updated successfully', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
