/**
 * @file This file contains functions to handle category related operations:
 * - Category creation
 * - Category fetching
 * - Category update
 * - Category deletion
 */

import { prisma } from '@/lib/db';
import { ValidationError, NotFoundError } from '@/utils/errorClasses';
import { handlePrismaError } from '@/utils/prismaErrorHandler';

/**
 * Create a new category
 *
 * @param {object} categoryData - category data to create
 * @returns {Promise<object>} - The created category
 */
export const createCategory = async (categoryData) => {
  try {
    const { name, isIncome, userId } = categoryData;

    if (!name || !userId) {
      throw new ValidationError('Namn och användar-ID krävs');
    }

    const category = await prisma.category.create({
      data: {
        name,
        isIncome: isIncome || false,
        userId,
      },
    });

    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    handlePrismaError(error, 'Category creation');
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
    handlePrismaError(error, 'User categories fetching');
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
    handlePrismaError(error, 'Category ID fetching');
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

    const { name, isIncome } = categoryData;

    const existingCategory = await getCategoryById(categoryId);
    if (!existingCategory) {
      throw new ValidationError('Kategorin hittades inte');
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name !== undefined ? name : existingCategory.name,
        isIncome: isIncome !== undefined ? isIncome : existingCategory.isIncome,
      },
    });

    return updatedCategory;
  } catch (error) {
    console.error('Error updating the category:', error);
    handlePrismaError(error, 'Category updating');
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
    handlePrismaError(error, 'Category deletion');
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
            userId,
          },
        }),
      ),
    );

    return createdCategories;
  } catch (error) {
    console.error('Error creating default categories:', error);
    handlePrismaError(error, 'Default categories creation');
  }
};
