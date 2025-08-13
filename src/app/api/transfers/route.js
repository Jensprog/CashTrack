/**
 * @file API route for managing transfers between main account and savings accounts.
 */

import { createTransfer, getUserTransfers } from '@/services/transferService';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { ValidationError } from '@/errors/classes';
import { successResponse, errorResponse } from '@/helpers/api';

export async function GET(request) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const savingsAccountId = searchParams.get('savingsAccountId');
    const type = searchParams.get('type');

    const transfers = await getUserTransfers(userId, {
      startDate,
      endDate,
      savingsAccountId,
      type,
    });

    return successResponse({ transfers }, 'Överföringar hämtade', 200);
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

    const { amount, description, date, type, savingsAccountId } = await request.json();

    if (!amount || !date || !type || !savingsAccountId) {
      throw new ValidationError('Belopp, datum, typ och sparkonto krävs');
    }

    if (isNaN(parseFloat(amount))) {
      throw new ValidationError('Belopp måste vara ett giltigt nummer');
    }

    if (!['TO_SAVINGS', 'FROM_SAVINGS'].includes(type)) {
      throw new ValidationError('Överföringstyp måste vara TO_SAVINGS eller FROM_SAVINGS');
    }

    const newTransfer = await createTransfer({
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      type,
      userId,
      savingsAccountId,
    });

    return successResponse({ transfer: newTransfer }, 'Överföring skapad', 201);
  } catch (error) {
    return errorResponse(error);
  }
}
