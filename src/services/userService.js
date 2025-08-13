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
import { ValidationError, ConflictError, AppError } from '@/errors/classes';

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
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
    return null;
  }
};

// Create new user
export const createUser = async (email, password) => {
  try {
    // Validate the input
    if (!email || !password) {
      throw new ValidationError('E-post och lösenord krävs');
    }

    // Check if the email is already in use
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError('E-postadressen används redan');
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      throw new ConflictError('E-postadressen används redan');
    }

    if (error instanceof AppError) {
      throw error;
    }

    console.error('Error creating user:', error);
    throw error;
  }
};
