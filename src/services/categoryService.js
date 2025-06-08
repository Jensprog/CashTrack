/**
 * @file This file contains functions to handle category related operations:
 * - Category creation
 * - Category fetching
 * - Category update
 * - Category deletion
 */

import { prisma } from '@/lib/db';
import { ValidationError, NotFoundError, AppError } from '@/errors/classes';

/**
 * Create a new category
 *
 * @param {object} categoryData - category data to create
 * @returns {Promise<object>} - The created category
 */
export const createCategory = async (categoryData) => {
  try {
    const { name, isIncome, isSaving, userId } = categoryData;

    if (!name || !userId) {
      throw new ValidationError('Namn och användar-ID krävs');
    }

    const category = await prisma.category.create({
      data: {
        name,
        isIncome: isIncome || false,
        isSaving: isSaving || false,
        userId,
      },
    });

    return category;
  } catch (error) {
    console.error('Error creating category:', error);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

/**
 * Fetch categories for a specific user
 *
 * @param {string} userId - ID for the user
 * @returns {Promise<Array>} - An array of user categories
 */
export const getUserCategories = async (userId) => {
  try {
    if (!userId) {
      throw new ValidationError('Användar-ID krävs');
    }

    const userCategories = await prisma.category.findMany({
      where: { userId },
    });

    const defaultCategories = await prisma.category.findMany({
      where: { userId: null },
    });

    return [...userCategories, ...defaultCategories];
  } catch (error) {
    console.error('Error getting user categories:', error);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

/**
 * Fetch a category based on ID
 *
 * @param {string} categoryId - The ID for the category to fetch
 * @returns {Promise<object|null>} - The category or null if not found
 */
export const getCategoryById = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new ValidationError('Kategori-ID krävs');
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    return category;
  } catch (error) {
    console.error('Error getting category by ID:', error);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

/**
 * Update an existing category
 *
 * @param {string} categoryId - The ID for the category to update
 * @param {object} categoryData - The updated category data
 * @returns {Promise<object>} - The updated category
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    if (!categoryId) {
      throw new ValidationError('Kategori-ID krävs');
    }

    const { name, isIncome, isSaving } = categoryData;

    const existingCategory = await getCategoryById(categoryId);
    if (!existingCategory) {
      throw new ValidationError('Kategorin hittades inte');
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name !== undefined ? name : existingCategory.name,
        isIncome: isIncome !== undefined ? isIncome : existingCategory.isIncome,
        isSaving: isSaving !== undefined ? isSaving : existingCategory.isSaving,
      },
    });

    return updatedCategory;
  } catch (error) {
    console.error('Error updating the category:', error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error.code === 'P2025') {
      throw new NotFoundError('Kategorin hittades inte');
    }
    throw error;
  }
};

/**
 * Delete a category
 *
 * @param {string} categoryId - The category ID
 * @returns {Promise<void>}
 */
export const deleteCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      throw new ValidationError('Kategori-ID krävs');
    }

    const existingCategory = await getCategoryById(categoryId);
    if (!existingCategory) {
      throw new NotFoundError('Kategorin hittades inte');
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });
  } catch (error) {
    console.error('Error deleting category:', error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error.code === 'P2025') {
      throw new NotFoundError('Kategorin hittades inte');
    }

    throw error;
  }
};

/**
 * Create default categories for all users
 *
 * @param {string} userId - Användar-ID
 * @returns {Promise<Array>} - The array of default categories
 */
export const createDefaultCategories = async (userId) => {
  try {
    if (!userId) {
      throw new ValidationError('Användar-ID krävs');
    }

    const existingCategories = await prisma.category.findMany({
      where: {
        userId,
        name: {
          in: ['Lön', 'Hyra/Boende'],
        },
      },
      take: 1,
    });

    if (existingCategories.length > 0) {
      return [];
    }

    const defaultCategories = [
      { name: 'Lön', isIncome: true },
      { name: 'Bidrag', isIncome: true },
      { name: 'Gåvor', isIncome: true },
      { name: 'Återbetalning', isIncome: true },

      { name: 'Sparkonto', isIncome: false, isSaving: true },
      { name: 'Aktieinvesteringar', isIncome: false, isSaving: true },
      { name: 'Fondsparande', isIncome: false, isSaving: true },
      { name: 'Pension', isIncome: false, isSaving: true },

      { name: 'Hyra/Boende', isIncome: false },
      { name: 'Mat och hushåll', isIncome: false },
      { name: 'Transport', isIncome: false },
      { name: 'Nöje', isIncome: false },
      { name: 'Räkningar', isIncome: false },
      { name: 'Hälsa', isIncome: false },
      { name: 'Kläder', isIncome: false },
      { name: 'Övrigt', isIncome: false },
    ];

    const createdCategories = await Promise.all(
      defaultCategories.map((category) =>
        prisma.category.create({
          data: {
            name: category.name,
            isIncome: category.isIncome,
            isSaving: category.isSaving,
            userId,
          },
        }),
      ),
    );

    return createdCategories;
  } catch (error) {
    console.error('Error creating default categories:', error);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};
