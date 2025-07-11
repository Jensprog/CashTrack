/**
 * @file SavingsAccount service.
 *
 * This file contains functions for handling savings account operations:
 * - Create savings account
 * - Get user savings account
 * - Update savings account
 * - Delete savings account
 */

import { prisma } from '@/lib/db';
import { ValidationError, NotFoundError, AppError } from '@/errors/classes';

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

export const getUserSavingsAccounts = async (userId) => {
  try {
    if (!userId) {
      throw new ValidationError('Användar-ID krävs');
    }

    const savingsAccounts = await prisma.savingsAccount.findMany({
      where: { userId: userId },
      include: {
        category: true,
        transactions: {
          include: {
            category: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return savingsAccounts;
  } catch (error) {
    console.error('Error fetching savings account:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const getSavingsAccountById = async (savingsAccountId) => {
  try {
    if (!savingsAccountId) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    const savingsAccount = await prisma.savingsAccount.findUnique({
      where: { id: savingsAccountId },
      include: {
        category: true,
        transactions: {
          include: {
            category: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return savingsAccount;
  } catch (error) {
    console.error('Error fetching savings account by ID:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const updateSavingsAccount = async (savingsAccountId, savingsData) => {
  try {
    if (!savingsAccountId) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const { name, description, targetAmount, categoryId } = savingsData;

    const existingSavingsAccount = await getSavingsAccountById(savingsAccountId);
    if (!existingSavingsAccount) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    if (targetAmount !== undefined && targetAmount !== null) {
      if (isNaN(targetAmount) || parseFloat(targetAmount) <= 0) {
        throw new ValidationError('Sparmål måste vara ett positivt nummer');
      }
    }

    const updatedSavingsAccount = await prisma.savingsAccount.update({
      where: { id: savingsAccountId },
      data: {
        name: name !== undefined ? name : existingSavingsAccount.name,
        description: description !== undefined ? description : existingSavingsAccount.description,
        targetAmount:
          targetAmount !== undefined
            ? targetAmount !== null
              ? parseFloat(targetAmount)
              : null
            : existingSavingsAccount.targetAmount,
        categoryId: categoryId !== undefined ? categoryId : existingSavingsAccount.categoryId,
      },
      include: {
        category: true,
        transactions: {
          include: {
            category: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return updatedSavingsAccount;
  } catch (error) {
    console.error('Error updating savings account:', error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error.code === 'P2025') {
      throw new NotFoundError('Sparkontot hittades inte');
    }
    throw error;
  }
};

export const deleteSavingsAccount = async (savingsAccountId) => {
  try {
    if (!savingsAccountId) {
      throw new ValidationError('Sparkonto-Id krävs');
    }

    const existingSavingsAccount = await getSavingsAccountById(savingsAccountId);

    if (!existingSavingsAccount) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    const linkedTransactions = await prisma.transaction.count({
      where: { savingsAccountId: savingsAccountId },
    });

    if (linkedTransactions > 0) {
      throw new ValidationError(
        `Kan inte radera sparkontot eftersom det har ${linkedTransactions} kopplade transaktioner. Flytta transaktionerna till ett annat konto först.`,
      );
    }

    await prisma.savingsAccount.delete({
      where: { id: savingsAccountId },
    });
  } catch (error) {
    console.error('Error deleting savings account:', error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error.code === 'P2025') {
      throw new NotFoundError('Sparkontot hittades inte');
    }
    throw error;
  }
};

export const calculateCurrentAmount = async (savingsAccountId) => {
  try {
    if (!savingsAccountId) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const transactions = await prisma.transaction.findMany({
      where: { savingsAccountId: savingsAccountId },
    });

    const currentAmount = transactions.reduce((total, transaction) => {
      return total + Math.abs(transaction.amount);
    }, 0);

    return currentAmount;
  } catch (error) {
    console.error('Error calculating current amount:', error);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};
