const { PrismaClient } = jest.createMockFromModule('@prisma/client');

const prisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    category: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
    transaction: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
};

PrismaClient.mockImplementation(() => prisma);
module.exports = { PrismaClient };