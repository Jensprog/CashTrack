/**
 * @file User service
 *
 * This file contains functions for handling user-related operations:
 * - User retrieval
 * - User creation
 * - User operations (update, delete)
 */

import { hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ValidationError, ConflictError } from '@/utils/errorClasses';
import { handlePrismaError } from '@/utils/prismaErrorHandler';

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    handlePrismaError(error, 'User fetching by email');
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    handlePrismaError(error, 'User fetching by ID');
  }
};

// Create new user
export const createUser = async (username, email, password) => {
  try {
    // Validate the input
    if (!username || !email || !password) {
      throw new ValidationError('Användarnamn, e-post och lösenord krävs');
    }

    // Check if the email is already in use
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('E-postadressen används redan');
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    handlePrismaError(error, 'User creation');
  }
};
