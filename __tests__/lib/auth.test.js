import { generateToken, verifyToken, comparePassword, hashPassword } from '@/lib/auth';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn(() => Promise.resolve('salt')),
  hash: jest.fn(() => Promise.resolve('hashedPassword')),
  compare: jest.fn(),
}));

describe('Auth Functions', () => {
  test('generateToken should return a valid JWT', () => {
    const userId = 'user123';
    const token = generateToken(userId);

    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  test('verifyToken should return decoded userId for valid token', () => {
    const userId = 'user123';
    const token = generateToken(userId);

    const decoded = verifyToken(token);

    expect(decoded).toBeTruthy();
    expect(decoded.userId).toBe(userId);
  });

  test('verifyToken should return null for invalid token', () => {
    const invalidToken = 'invalid.token.here';

    const decoded = verifyToken(invalidToken);

    expect(decoded).toBeNull();
  });

  test('comparePassword should return true for matching password', async () => {
    bcrypt.compare.mockResolvedValue(true);

    const result = await comparePassword('password123', 'hashedPassword');

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
  });

  test('comparePassword should return false for non-matching password', async () => {
    bcrypt.compare.mockResolvedValue(false);

    const result = await comparePassword('wrongPassword', 'hashedPassword');

    expect(result).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
  });

  test('hashPassword should return a hashed password', async () => {
    const password = 'password123';
    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).toBe('hashedPassword');
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 'salt');
  });
});
