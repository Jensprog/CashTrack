/**
 * @file Prisma error handler.
 *
 * This file contains functions for handling errors from the Prisma client.
 */
import { AppError, ValidationError, NotFoundError, ConflictError } from '@/utils/errorClasses';

export const handlePrismaError = (error, context = 'Operation') => {
  if (error instanceof AppError) {
    throw error;
  }
  switch (error.code) {
    case 'P2002':
      throw new ConflictError(`${context} already exists`);
    case 'P2003':
      throw new ValidationError(`Invalid references in ${context}`);
    case 'P2025':
      throw new NotFoundError(`Resource not found in ${context}`);
    default:
      throw new AppError(`${context} failed`);
  }
};
