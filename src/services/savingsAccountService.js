/**
 * SavingsAccount service.
 *
 * This file contains functions for handling savings account operations:
 * - Create savings account
 * - Get user savings account
 * - Update savings account
 * - Delete savings account
 */

import { prisma } from '@/lib/db';
import { ValidationError, /*NotFoundError*/ AppError } from '@/errors/classes';

export const createSavingsAccount = async (savingsData) => {
  try {
    const { name, description, targetAmount, userId, categoryId } = savingsData;

    if (!name || !userId) {
      throw new ValidationError('Namn och användar-ID krävs');
    }

    if (targetAmount && (isNaN(targetAmount) || parseFloat(targetAmount) <= 0)) {
      throw new ValidationError('Sparmål måste vara ett positivt nummer');
    }

    const savingsAccount = await prisma.savingsAccount.create({
      data: {
        name,
        description: description || null,
        targetAmount: targetAmount ? parseFloat(targetAmount) : null,
        userId,
        categoryId: categoryId || null,
      },
    });

    return savingsAccount;
  } catch (error) {
    console.error('Error creating savings account:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};
