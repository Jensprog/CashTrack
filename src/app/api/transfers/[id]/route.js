/**
 * @file API route for managing specific transfers by ID.
 */

import { getTransferById, updateTransfer, deleteTransfer } from '@/services/transferService';
import { authMiddleware } from '@/middlewares/authMiddleware';
import { ValidationError, NotFoundError } from '@/utils/errorClasses';
import { successResponse, errorResponse } from '@/helpers/api';

export async function GET(request, { params }) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { id } = await params;

    if (!id) {
      throw new ValidationError('Överförings-ID krävs');
    }

    const transfer = await getTransferById(id);

    if (!transfer) {
      throw new NotFoundError('Överföringen hittades inte');
    }

    if (transfer.userId !== userId) {
      throw new ValidationError('Du har inte behörighet att visa denna överföring');
    }

    return successResponse({ transfer }, 'Överföringen hämtad', 200);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = await authMiddleware(request);

    if (userId instanceof Response) {
      return userId;
    }

    const { id } = await params;

    if (!id) {
      throw new ValidationError('Överförings-ID krävs');
    }

    const { amount, description, date, type } = await request.json();

    const existingTransfer = await getTransferById(id);
    if (!existingTransfer) {
      throw new NotFoundError('Överföringen hittades inte');
    }

    if (existingTransfer.userId !== userId) {
      throw new ValidationError('Du har inte behörighet att ändra denna överföring');
    }

    const updatedTransfer = await updateTransfer(id, {
      amount: amount !== undefined ? parseFloat(amount) : undefined,
      description,
      date,
      type,
    });

    return successResponse({ transfer: updatedTransfer }, 'Överföringen uppdaterad', 200);
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
      throw new ValidationError('Överförings-ID krävs');
    }

    const existingTransfer = await getTransferById(id);
    if (!existingTransfer) {
      throw new NotFoundError('Överföringen hittades inte');
    }

    if (existingTransfer.userId !== userId) {
      throw new ValidationError('Du har inte behörighet att ta bort denna överföring');
    }

    await deleteTransfer(id);

    return successResponse(null, 'Överföringen borttagen', 200);
  } catch (error) {
    return errorResponse(error);
  }
}
