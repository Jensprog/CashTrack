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
import { ValidationError, NotFoundError } from '@/utils/errorClasses';
import { handlePrismaError } from '@/utils/prismaErrorHandler';

export const createSavingsAccount = async (savingsData) => {
  try {
    const { name, description, targetAmount, initialBalance, userId } = savingsData;

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
        initialBalance: initialBalance ? parseFloat(initialBalance) : 0,
        currentAmount: initialBalance ? parseFloat(initialBalance) : 0,
        userId,
      },
    });

    return savingsAccount;
  } catch (error) {
    console.error('Error creating savings account:', error);
    handlePrismaError(error, 'Savings account creation');
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
        transfers: {
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
    handlePrismaError(error, 'Savings account fetching');
  }
};

export const getSavingsAccountById = async (savingsAccountId) => {
  try {
    if (!savingsAccountId) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const savingsAccount = await prisma.savingsAccount.findUnique({
      where: { id: savingsAccountId },
      include: {
        transfers: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return savingsAccount;
  } catch (error) {
    console.error('Error fetching savings account by ID:', error);
    handlePrismaError(error, 'Savings account ID fetching');
  }
};

export const updateSavingsAccount = async (savingsAccountId, savingsData) => {
  try {
    if (!savingsAccountId) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const { name, description, targetAmount } = savingsData;

    const existingSavingsAccount = await getSavingsAccountById(savingsAccountId);
    if (!existingSavingsAccount) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    if (targetAmount !== undefined && targetAmount !== null) {
      if (isNaN(targetAmount) || parseFloat(targetAmount) <= 0) {
        throw new ValidationError('Sparmål måste vara ett positivt nummer');
      }
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (targetAmount !== undefined) {
      updateData.targetAmount = targetAmount !== null ? parseFloat(targetAmount) : null;
    }

    const updatedSavingsAccount = await prisma.savingsAccount.update({
      where: { id: savingsAccountId },
      data: updateData,
      include: {
        transfers: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    return updatedSavingsAccount;
  } catch (error) {
    console.error('Error updating savings account:', error);
    handlePrismaError(error, 'Savings account updating');
  }
};

export const deleteSavingsAccount = async (savingsAccountId, force = false) => {
  try {
    if (!savingsAccountId) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const existingSavingsAccount = await getSavingsAccountById(savingsAccountId);
    if (!existingSavingsAccount) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    // Calculate current balance to check if there's money left (including initial balance)
    const currentBalance = existingSavingsAccount.initialBalance || 0;

    const transfers = await prisma.transfer.findMany({
      where: { savingsAccountId: savingsAccountId },
    });

    let transferBalance = 0;
    transfers.forEach((transfer) => {
      if (transfer.type === 'TO_SAVINGS') {
        transferBalance += transfer.amount;
      } else if (transfer.type === 'FROM_SAVINGS') {
        transferBalance -= transfer.amount;
      }
    });

    const totalBalance = currentBalance + transferBalance;

    // Only prevent deletion if force is false and balance is positive
    if (!force && totalBalance > 0) {
      throw new ValidationError(
        `Kan inte radera sparkontot eftersom det innehåller ${totalBalance.toFixed(2)} kr. Överför pengarna till ett aktivt konto först.`,
      );
    }

    // Delete associated transfers first to be able to delete the account
    await prisma.transfer.deleteMany({
      where: { savingsAccountId: savingsAccountId },
    });

    await prisma.savingsAccount.delete({
      where: { id: savingsAccountId },
    });
  } catch (error) {
    console.error('Error deleting savings account:', error);
    handlePrismaError(error, 'Savings account deletion');
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
    handlePrismaError(error, 'Savings account current amount calculation');
  }
};
