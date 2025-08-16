/**
 * @file API-route to create standard categories.
 */

import { createDefaultCategories } from '@/services/categoryService';
import { successResponse } from '@/helpers/api';
import { handlePrismaError } from '@/utils/prismaErrorHandler';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { prisma } from '@/lib/db';

export async function POST(request) {
  if (request.url.includes('/api/categories/defaults')) {
    try {
      const userId = await authMiddleware(request);

      const existingCategories = await prisma.category.findMany({
        where: {
          userId,
          name: {
            in: ['Lön', 'Hyra/Boende'], // Check a few standard categories
          },
        },
        take: 1, // Only need to check if 1 exists already
      });

      if (existingCategories.length > 0) {
        return successResponse(
          { message: 'Standardkategorier finns redan' },
          'Inga nya kategorier skapades',
          200,
        );
      }

      const categories = await createDefaultCategories(userId);

      return successResponse({ categories }, 'Standardkategorier skapade', 201);
    } catch (error) {
      handlePrismaError(error, 'Create default categories');
    }
  }
}
