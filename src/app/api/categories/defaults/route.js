/**
 * @file API-route to create standard categories.
 */

import { createDefaultCategories } from '@/services/categoryService';
import { successResponse, errorResponse } from '@/helpers/api';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { prisma } from '@/lib/db';

export async function POST(request) {
  if (request.url.includes('/api/categories/defaults')) {
    try {
      const userId = await authMiddleware(request);

      if (userId instanceof Response) {
        return userId;
      }

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
      return errorResponse(error);
    }
  }
}
