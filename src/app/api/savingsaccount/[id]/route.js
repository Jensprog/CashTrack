import { getSavingsAccountById } from '@/services/savingsAccountService';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { NotFoundError } from '@/errors/classes';
import { successResponse, errorResponse } from '@/helpers/api';

export async function GET(request, { params }) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { id } = params;
    const savingsAccount = await getSavingsAccountById(id, userId);

    if (!savingsAccount) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    return successResponse({ savingsAccount }, 'Sparkontot hämtat', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
