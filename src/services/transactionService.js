/**
 * @file Transaction service.
 *
 * This file contains functions for handling transaction-related operations:
 * - Transaction creation
 * - Transaction retrieval
 * - Transaction updates
 * - Transaction deletion
 */

import { prisma } from '@/lib/db';
import { ValidationError, NotFoundError, AppError } from '@/errors/classes';

/**
 * Create a new transaction
 *
 * @param {object} transactionData - The transaction data to create
 * @returns {Promise<object>} - The created transaction
 */
export const createTransaction = async (transactionData) => {
  try {
    const { amount, description, date, userId, categoryId } = transactionData;

    // Validate required fields
    if (!userId || amount === undefined || !date) {
      throw new ValidationError('Användare, belopp och datum krävs');
    }

    // Create transaction in database
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description: description || null,
        date,
        userId,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
      },
    });

    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);

    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

/**
 * Get transaction for a specific user with optinal filtering
 *
 * @param {string} userId - The ID of the user
 * @param {object} filters - Optional filters (startDate, endDate, categoryId)
 * @returns {Promise<Array>} - The list of transactions
 */
export const getUserTransactions = async (userId, filters = {}) => {
  try {
    if (!userId) {
      throw new ValidationError('Användar-ID krävs');
    }

    const { startDate, endDate, categoryId } = filters;

    // Build where-clause for filtering
    const where = { userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      where.date = {};

      if (startDate) {
        where.date.gte = new Date(startDate);
      }

      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Add category filter if provided
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Get transactions from database
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return transactions;
  } catch (error) {
    console.error('Error getting user transactions:', error);

    if (error instanceof AppError) {
      throw error;
    }

    throw error;
  }
};

/**
 * Get a transaction by ID
 *
 * @param {string} transactionId - The ID of the transaction to retrieve
 * @returns {Promise<object|null>} - The transaction or null if not found
 */
export const getTransactionById = async (transactionId) => {
  try {
    if (!transactionId) {
      throw new ValidationError('Transaktions-ID krävs');
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        category: true,
      },
    });

    return transaction;
  } catch (error) {
    console.error('Error getting transaction by ID:', error);

    if (error instanceof AppError) {
      throw error;
    }

    throw error;
  }
};

/**
 * Update an existing transaction
 *
 * @param {string} transactionId - The ID of the transaction to update
 * @param {object} transactionData - The updated transaction data
 * @returns {Promise<object>} - The updated transaction
 */
export const updateTransaction = async (transactionId, transactionData) => {
  try {
    if (!transactionId) {
      throw new ValidationError('Transaktions-ID krävs');
    }

    const { amount, description, date, categoryId } = transactionData;

    // Verify transaction existence
    const existingTransaction = await getTransactionById(transactionId);
    if (!existingTransaction) {
      throw new ValidationError('Transaktionen hittades inte');
    }

    // Update transaction in database
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount: amount !== undefined ? amount : existingTransaction.amount,
        description: description !== undefined ? description : existingTransaction.description,
        date: date ? new Date(date) : existingTransaction.date,
        categoryId: categoryId !== undefined ? categoryId : existingTransaction.categoryId,
      },
      include: {
        category: true,
      },
    });

    return updatedTransaction;
  } catch (error) {
    console.error('Error updating transaction:', error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error.code === 'P2025') {
      throw new NotFoundError('Transaktionen hittades inte');
    }

    throw error;
  }
};

/**
 * Delete a transaction
 *
 * @param {string} id - Transaction ID
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (transactionId) => {
  try {
    if (!transactionId) {
      throw new ValidationError('Transaktions-ID krävs');
    }

    // Verify transaction existence
    const existingTransaction = await getTransactionById(transactionId);
    if (!existingTransaction) {
      throw new NotFoundError('Transaktionen hittades inte');
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);

    if (error instanceof AppError) {
      throw error;
    }

    if (error.code === 'P2025') {
      throw new NotFoundError('Transaktionen hittades inte');
    }

    throw error;
  }
};
