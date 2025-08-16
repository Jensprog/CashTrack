/**
 * @file API route for managing savings accounts.
 */

import { createSavingsAccount, getUserSavingsAccounts } from '@/services/savingsAccountService';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { ValidationError } from '@/utils/errorClasses';
import { successResponse, errorResponse } from '@/helpers/api';

export async function GET(request) {
  try {
    const userId = await authMiddleware(request);

    const savingsAccounts = await getUserSavingsAccounts(userId);

    return successResponse({ savingsAccounts }, 'Sparkonton hämtade', 200);
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

    const { name, description, targetAmount, initialBalance } = await request.json();

    if (!name) {
      throw new ValidationError('Kontonamn krävs');
    }

    const newSavingsAccount = await createSavingsAccount({
      name,
      description,
      targetAmount,
      initialBalance,
      userId,
    });

    return successResponse({ savingsAccount: newSavingsAccount }, 'Sparkonto skapat', 201);
  } catch (error) {
    return errorResponse(error);
  }
}
