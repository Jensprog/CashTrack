/**
 * API-route to create standard categories.
 */

import { createDefaultCategories } from '@/services/categoryService';
import { successResponse, errorResponse } from '@/helpers/api';
import { authMiddleware } from '@/middlewares/authMiddleware';

export async function POST(request) {
  if (request.url.includes('/api/categories/defaults')) {
    try {
      const userId = await authMiddleware(request);

      if (userId instanceof Response) {
        return userId;
      }

      const categories = await createDefaultCategories(userId);

      return successResponse({ categories }, 'Standardkategorier skapade', 201);
    } catch (error) {
      return errorResponse(error);
    }
  }
}
