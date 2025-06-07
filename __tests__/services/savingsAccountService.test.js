import { createSavingsAccount, getUserSavingsAccounts } from '@/services/savingsAccountService';

jest.mock('@/lib/db', () => ({
  prisma: {
    savingsAccount: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/db';

describe('SavingsAccount Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSavingsAccount', () => {
    it('should create a savings account with all fields', async () => {
      const mockSavingsAccount = {
        id: 'savings-123',
        name: 'Semesterresan',
        description: 'Resa till Japan',
        targetAmount: 50000,
        userId: 'test@example.com',
        categoryId: 'cat-123',
        currentAmount: 0,
      };

      prisma.savingsAccount.create.mockResolvedValue(mockSavingsAccount);

      const testData = {
        name: 'Semesterresan',
        description: 'Resa till Japan',
        targetAmount: 50000,
        userId: 'test@example.com',
        categoryId: 'cat-123',
      };

      const result = await createSavingsAccount(testData);

      expect(result).toEqual(mockSavingsAccount);
      expect(prisma.savingsAccount.create).toHaveBeenCalledWith({
        data: {
          name: 'Semesterresan',
          description: 'Resa till Japan',
          targetAmount: 50000,
          userId: 'test@example.com',
          categoryId: 'cat-123',
        },
      });
    });

    it('should create savings account with only required fields', async () => {
      const mockSavingsAccount = {
        id: 'savings-456',
        name: 'Buffert',
        description: 'Buffertsparande',
        targetAmount: null,
        userId: 'test@example.com',
        categoryId: null,
        currentAmount: 0,
      };

      prisma.savingsAccount.create.mockResolvedValue(mockSavingsAccount);

      const testData = {
        name: 'Buffert',
        userId: 'test@example.com',
      };

      const result = await createSavingsAccount(testData);

      expect(result).toEqual(mockSavingsAccount);
    });

    it('should throw ValidationError when name is missing', async () => {
      const testData = {
        userId: 'test@example.com',
      };

      await expect(createSavingsAccount(testData)).rejects.toThrow('Namn och användar-ID krävs');
    });

    it('should throw ValidationError when targetAmount is invalid', async () => {
      const testData = {
        name: 'Test',
        userId: 'test@example.com',
        targetAmount: -100,
      };

      await expect(createSavingsAccount(testData)).rejects.toThrow(
        'Sparmål måste vara ett positivt nummer',
      );
    });
  });

  describe('getUserSavingsAccounts', () => {
    it('should return user savings accounts with transactions', async () => {
      const mockSavingsAccounts = [
        {
          id: 'savings-789',
          name: 'Semesterresa',
          description: 'Spara till semester',
          userId: 'test@example.com',
          category: {
            id: 'cat-456',
            name: 'Resa',
          },
          transactions: [],
          createdAt: new Date(),
        },
      ];

      prisma.savingsAccount.findMany.mockResolvedValue(mockSavingsAccounts);

      const result = await getUserSavingsAccounts('test@example.com');

      expect(result).toEqual(mockSavingsAccounts);
      expect(prisma.savingsAccount.findMany).toHaveBeenCalledWith({
        where: { userId: 'test@example.com' },
        include: {
          category: true,
          transactions: {
            include: {
              category: true,
            },
            orderBy: {
              date: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return empty array when user has no savings accounts', async () => {
      prisma.savingsAccount.findMany.mockResolvedValue([]);

      const result = await getUserSavingsAccounts('test@example.com');

      expect(result).toEqual([]);
    });

    it('should throw ValidationError when userId is missing', async () => {
      await expect(getUserSavingsAccounts()).rejects.toThrow('Användar-ID krävs');
    });
  });
});
