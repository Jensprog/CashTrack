/**
 * Authentication utilities
 * 
 * This file contains helper functions for user authentication:
 * - Password hashing and verification
 * - JWT token generation and verification
 * - User retrieval functions
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

// JWT secret key for signing tokens
const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

//Verify JWT token
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

// Hash password
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Compare password with hashed password
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

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

  // Create new user
  export const createUser = async (email, password) => {
    try {
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
        console.error('Error creating user:', error);
        throw error;
    }
  };
