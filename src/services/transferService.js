/**
 * @file Transfer service.
 *
 * This file contains functions for handling transfer operations between
 * main account and savings accounts:
 * - Create transfer (to/from savings)
 * - Get user transfers
 * - Update transfer
 * - Delete transfer
 * - Calculate account balances
 */

import { prisma } from '@/lib/db';
import { ValidationError, NotFoundError, AppError } from '@/errors/classes';

export const createTransfer = async (transferData) => {
  try {
    const { amount, description, date, type, userId, savingsAccountId } = transferData;

    if (!userId || !amount || !date || !type || !savingsAccountId) {
      throw new ValidationError('Användar-ID, belopp, datum, typ och sparkonto krävs');
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      throw new ValidationError('Belopp måste vara ett positivt nummer');
    }

    if (!['TO_SAVINGS', 'FROM_SAVINGS'].includes(type)) {
      throw new ValidationError('Överföringstyp måste vara TO_SAVINGS eller FROM_SAVINGS');
    }

    const savingsAccount = await prisma.savingsAccount.findUnique({
      where: { id: savingsAccountId },
    });

    if (!savingsAccount) {
      throw new NotFoundError('Sparande konto hittades inte');
    }

    if (savingsAccount.userId !== userId) {
      throw new ValidationError('Du har inte behörighet till detta sparkonto');
    }

    if (type === 'FROM_SAVINGS') {
      const currentBalance = await calculateSavingsAccountBalance(savingsAccountId);
      if (currentBalance < parseFloat(amount)) {
        throw new ValidationError(
          `Otillräckligt saldo. Tillgängligt: ${currentBalance.toFixed(2)} kr`,
        );
      }
    }

    const transfer = await prisma.transfer.create({
      data: {
        amount: parseFloat(amount),
        description: description || null,
        date: new Date(date),
        type,
        userId,
        savingsAccountId,
      },
      include: {
        savingsAccount: {
          include: {
            category: true,
          },
        },
      },
    });

    await updateSavingsAccountBalance(savingsAccountId);

    return transfer;
  } catch (error) {
    console.error('Error creating transfer:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const getUserTransfers = async (userId, filters = {}) => {
  try {
    if (!userId) {
      throw new ValidationError('Användar-ID krävs');
    }

    const { startDate, endDate, savingsAccountId, type } = filters;

    const where = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (savingsAccountId) {
      where.savingsAccountId = savingsAccountId;
    }

    if (type) {
      where.type = type;
    }

    const transfers = await prisma.transfer.findMany({
      where,
      include: {
        savingsAccount: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return transfers;
  } catch (error) {
    console.error('Error fetching user transfers:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const getTransferById = async (transferId) => {
  try {
    if (!transferId) {
      throw new ValidationError('Överförings-ID krävs');
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id: transferId },
      include: {
        savingsAccount: {
          include: {
            category: true,
          },
        },
      },
    });

    return transfer;
  } catch (error) {
    console.error('Error fetching transfer by ID:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const updateTransfer = async (transferId, transferData) => {
  try {
    if (!transferId) {
      throw new ValidationError('Överförings-ID krävs');
    }

    const { amount, description, date, type } = transferData;

    const existingTransfer = await getTransferById(transferId);
    if (!existingTransfer) {
      throw new NotFoundError('Överföringen hittades inte');
    }

    if (amount !== undefined && (isNaN(amount) || parseFloat(amount) <= 0)) {
      throw new ValidationError('Belopp måste vara ett positivt nummer');
    }

    if (type !== undefined && !['TO_SAVINGS', 'FROM_SAVINGS'].includes(type)) {
      throw new ValidationError('Överföringstyp måste vara TO_SAVINGS eller FROM_SAVINGS');
    }

    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (type !== undefined) updateData.type = type;

    const updatedTransfer = await prisma.transfer.update({
      where: { id: transferId },
      data: updateData,
      include: {
        savingsAccount: {
          include: {
            category: true,
          },
        },
      },
    });

    await updateSavingsAccountBalance(existingTransfer.savingsAccountId);

    return updatedTransfer;
  } catch (error) {
    console.error('Error updating transfer:', error);
    if (error instanceof AppError) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new NotFoundError('Överföringen hittades inte');
    }
    throw error;
  }
};

export const deleteTransfer = async (transferId) => {
  try {
    if (!transferId) {
      throw new ValidationError('Överförings-ID krävs');
    }

    const existingTransfer = await getTransferById(transferId);
    if (!existingTransfer) {
      throw new NotFoundError('Överföringen hittades inte');
    }

    await prisma.transfer.delete({
      where: { id: transferId },
    });

    await updateSavingsAccountBalance(existingTransfer.savingsAccountId);
  } catch (error) {
    console.error('Error deleting transfer:', error);
    if (error instanceof AppError) {
      throw error;
    }
    if (error.code === 'P2025') {
      throw new NotFoundError('Överföringen hittades inte');
    }
    throw error;
  }
};

export const calculateSavingsAccountBalance = async (savingsAccountId) => {
  try {
    if (!savingsAccountId) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const savingsAccount = await prisma.savingsAccount.findUnique({
      where: { id: savingsAccountId },
    });

    if (!savingsAccount) {
      throw new NotFoundError('Sparkonto hittades inte');
    }

    const transfers = await prisma.transfer.findMany({
      where: { savingsAccountId },
    });

    // Start with the initial balance from initialBalance field
    let balance = savingsAccount.initialBalance || 0;
    
    // Add/subtract transfers
    transfers.forEach((transfer) => {
      if (transfer.type === 'TO_SAVINGS') {
        balance += transfer.amount;
      } else if (transfer.type === 'FROM_SAVINGS') {
        balance -= transfer.amount;
      }
    });

    return Math.max(0, balance);
  } catch (error) {
    console.error('Error calculating savings account balance:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const updateSavingsAccountBalance = async (savingsAccountId) => {
  try {
    const currentAmount = await calculateSavingsAccountBalance(savingsAccountId);

    await prisma.savingsAccount.update({
      where: { id: savingsAccountId },
      data: { currentAmount },
    });
  } catch (error) {
    console.error('Error updating savings account balance:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const calculateMainAccountBalance = async (userId) => {
  try {
    if (!userId) {
      throw new ValidationError('Användar-ID krävs');
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    const transfers = await prisma.transfer.findMany({
      where: { userId },
    });

    let balance = 0;
    transactions.forEach((transaction) => {
      balance += transaction.amount;
    });

    transfers.forEach((transfer) => {
      if (transfer.type === 'TO_SAVINGS') {
        balance -= transfer.amount;
      } else if (transfer.type === 'FROM_SAVINGS') {
        balance += transfer.amount;
      }
    });

    return balance;
  } catch (error) {
    console.error('Error calculating main account balance:', error);
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};
