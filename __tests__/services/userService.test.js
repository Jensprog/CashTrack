import { getUserByEmail, createUser, getUserById } from '@/services/userService';
import { hashPassword } from '@/lib/auth';

jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn(() => Promise.resolve('hashedPassword')),
}));

import { prisma } from '@/lib/db';

describe('User Service Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('getUserByEmail should return user when valid email is provided', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    
    const user = await getUserByEmail('test@example.com');
    
    expect(user).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });
  
  test('getUserByEmail should return null when invalid email is provided', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    
    const user = await getUserByEmail('nonexistent@example.com');
    
    expect(user).toBeNull();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'nonexistent@example.com' },
    });
  });
  
  test('createUser should create and return a new user with hashed password', async () => {
    const mockUser = { 
      id: 'user123', 
      email: 'new@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(mockUser);
    
    const user = await createUser('new@example.com', 'password123');
    
    expect(user).toEqual(mockUser);
    expect(hashPassword).toHaveBeenCalledWith('password123');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'new@example.com',
        password: 'hashedPassword',
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
});