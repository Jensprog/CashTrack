/**
 * Backend API route for transaction management.
 *
 * This route handles CRUD operations for transactions:
 * - Creating new transactions
 * - Getting transactions for a user
 * - Updating existing transactions
 * - Deleting transactions
 */

import { NextResponse } from 'next/server';
import {
    createTransaction,
    getUserTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionById
} from '@/services/transactionService';
import { ValidationError, NotFoundError } from '@/errors/classes';
import { successResponse, errorResponse } from '@/helpers/api';
import { authMiddleware } from '@/middlewares/authMiddleware';

// GET - Fetch all transactions for the logged-in user
export async function GET(request) {
    try {
        const middlewareResponse = await authMiddleware(request);
        if (middlewareResponse) {
            return middlewareResponse;
        }

        // Get user ID from headers (set by authMiddleware)
        const userId = request.headers.get('X-User-ID');
        if (!userId) {
            throw new ValidationError('Användare kunde inte identifieras');
        }

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const categoryId = searchParams.get('categoryId');

        // Get transactions for user with optinal filters
        const transactions = await getUserTransactions(userId, {
            startDate,
            endDate,
            categoryId
        });

        return successResponse(
            { transactions },
            'Transaktioner hämtade',
            200
        );
    } catch (error) {
        return errorResponse(error);
    }
}

// POST - Create a new transaction
export async function POST(request) {
    try {
        const middlewareResponse = await authMiddleware(request);
        if (middlewareResponse) {
            return middlewareResponse;
        }

        // Get user ID from headers (set by authMiddleware)
        const userId = request.headers.get('X-User-ID');
        if (!userId) {
            throw new ValidationError('Användare kunde inte identifieras');
        }

        // Parse request body
        const { amount, description, date, categoryId } = await request.json();

        // Validate required fields
        if (amount === undefined || !date) {
            throw new ValidationError('Belopp och datum krävs');
        }

        // Validate amount is a number
        if (isNaN(parseFloat(amount))) {
            throw new ValidationError('Belopp måste vara ett nummer');
        }

        // Create transaction
        const newTransaction = await createTransaction({
            amount: parseFloat(amount),
            description,
            date: new Date(date),
            userId,
            categoryId
        });

        return successResponse(
            { transaction: newTransaction },
            'Transaktion skapad',
            201
        );
    } catch (error) {
        return errorResponse(error);
    }
}

// PUT - Update an existing transaction
export async function PUT(request) {
    try {
        const middlewareResponse = await authMiddleware(request);
        if (middlewareResponse) {
            return middlewareResponse;
        }

        // Get user ID from headers (set by authMiddleware)
        const userId = request.headers.get('X-User-ID');
        if (!userId) {
            throw new ValidationError('Användare kunde inte identifieras');
        }

        // Parse request body
        const { id, amount, description, date, categoryId } = await request.json();

        // Validate required fields
        if (!id) {
            throw new ValidationError('Transaktions-ID krävs');
        }

        // Check if transaction exists and belongs to the user
        const existingTransaction = await getTransactionById(id);
        if (!existingTransaction) {
            throw new NotFoundError('Transaktion hittades inte');
        }

        if (existingTransaction.userId !== userId) {
            throw new ValidationError('Du har inte behörighet att ändra denna transaktion');
        }

        // Update transaction
        const updatedTransaction = await updateTransaction(id, {
            amount: amount !== undefined ? parseFloat(amount) : undefined,
            description,
            date,
            categoryId
        });

        return successResponse(
            { transaction: updatedTransaction },
            'Transaktion uppdaterad',
            200
        );
    } catch (error) {
        return errorResponse(error);
    }
}

// DELETE - Delete a transaction
export async function DELETE(request) {
    try {
        const middlewareResponse = await authMiddleware(request);
        if (middlewareResponse) {
            return middlewareResponse;
        }

        // Get user ID from headers (set by authMiddleware)
        if (!userId) {
            throw new ValidationError('Användare kunde inte identifieras');
        }

        // Get transaction ID from URL
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            throw new ValidationError('Transaktions-ID krävs');
        }

        // Check if transaction exists and belongs to user
        const existingTransaction = await getTransactionById(id);
        if (!existingTransaction) {
            throw new NotFoundError('Transaktion hittades inte');
        }

        if (existingTransaction.userId !== userId) {
            throw new ValidationError('Du har inte behörighet att ta bort denna transaktion');
        }

        // Delete transaction
        await deleteTransaction(id);

        return successResponse(
            null,
            'Transaktion raderad',
            200
        );
    } catch (error) {
        return errorResponse(error);
    }
}