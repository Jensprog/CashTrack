/**
 * @file Handles the API route for password reset requests using a valid token.
 */

import { validatePassword } from '@/utils/validators';
import { ValidationError } from '@/utils/errorClasses';
import { successResponse, errorResponse } from '@/helpers/api';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      throw new ValidationError('Token och nytt lösenord krävs.');
    }

    // Validate password format
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new ValidationError(passwordValidation.message);
    }

    // Find the password reset record
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetRecord) {
      throw new ValidationError('Ogiltig eller utgången återställningstoken.');
    }

    // Check if token has expired
    if (new Date() > resetRecord.expiresAt) {
      // Delete expired token
      await prisma.passwordReset.delete({ where: { id: resetRecord.id } });
      throw new ValidationError('Återställningstoken har gått ut. Begär en ny återställningslänk.');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user's password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword }
    });

    // Delete the used token
    await prisma.passwordReset.delete({ where: { id: resetRecord.id } });

    return successResponse(
      {},
      'Lösenordet har uppdaterats framgångsrikt. Du omdirigeras till inloggningssidan.',
      200
    );
  } catch (error) {
    console.error('Error processing password reset:', error);
    return errorResponse(error);
  }
}