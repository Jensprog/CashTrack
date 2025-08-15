/**
 * @file Backend API route for category management.
 *
 * This route handles CRUD operations for transactions:
 * - Creating new categories
 * - Getting a category for a user
 * - Updating existing categories
 * - Deleting categories
 */

import {
  createCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from '@/services/categoryService';
import { successResponse, errorResponse } from '@/helpers/api';
import { ValidationError, NotFoundError } from '@/utils/errorClasses';
import { authMiddleware } from '@/middlewares/authMiddleware';

export async function GET(request) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const categories = await getUserCategories(userId);

    return successResponse({ categories }, 'Kategorier hämtade', 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { name, isIncome = false } = await request.json();

    if (!name) {
      throw new ValidationError('Kategorinamn krävs');
    }

    const newCategory = await createCategory({
      name,
      isIncome,
      userId,
    });

    return successResponse({ category: newCategory }, 'Kategori skapad', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { id, name, isIncome } = await request.json();

    if (!id) {
      throw new ValidationError('Kategori-ID krävs');
    }

    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      throw new NotFoundError('Kategori hittades inte');
    }

    if (existingCategory.userId !== userId) {
      throw new ValidationError('Du har inte behörighet att ändra denna kategori');
    }

    const updatedCategory = await updateCategory(id, {
      name,
      isIncome,
    });

    return successResponse({ category: updatedCategory }, 'Kategori uppdaterad', 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ValidationError('Kategori-ID krävs');
    }

    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      throw new NotFoundError('Kategorin hittades inte');
    }

    if (existingCategory.userId !== userId) {
      throw new ValidationError('Du har inte behörighet att ta bort denna kategori');
    }

    await deleteCategory(id);

    return successResponse(null, 'Kategori raderad', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
