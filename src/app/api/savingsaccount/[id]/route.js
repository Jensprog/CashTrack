import { getSavingsAccountById, updateSavingsAccount, deleteSavingsAccount } from '@/services/savingsAccountService';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { NotFoundError, ValidationError } from '@/errors/classes';
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

export async function PUT(request) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { id, name, description, targetAmount, categoryId } = await request.json();
    if (!id) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const existingSavingsAccount = await getSavingsAccountById(id);
    if (!existingSavingsAccount) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    if (existingSavingsAccount.userId !== userId) {
      throw new ValidationError('Du har inte behörighet att ändra detta sparkontot');
    }

    const updatedSavingsAccount = await updateSavingsAccount(id, {
      name,
      description,
      targetAmount,
      categoryId,
    });

    return successResponse({ savingsAccount: updatedSavingsAccount }, 'Sparkonto uppdaterat', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { id } = await params;
    if (!id) {
      throw new ValidationError('Sparkonto-ID krävs');
    }

    const existingSavingsAccount = await getSavingsAccountById(id);
    if (!existingSavingsAccount) {
      throw new NotFoundError('Sparkontot hittades inte');
    }

    if (existingSavingsAccount.userId !== userId) {
      throw new ValidationError('Du har inte behörighet att ta bort detta sparkontot');
    }

    await deleteSavingsAccount(id);

    return successResponse(null, 'Sparkonto borttaget', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
