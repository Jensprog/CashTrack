/**
 * @file Handles the API route for forgotten password requests and generates a token for secure password reset.
 */

import { validateEmail } from '@/utils/validators';
import { ValidationError } from '@/utils/errorClasses';
import { successResponse, errorResponse } from '@/helpers/api';
import { prisma } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();
    const resetToken = crypto.randomBytes(32).toString('hex'); // Generate a random token
    const tokenExpire = new Date(Date.now() + 15 * 60 * 1000); // Token expires after 15 minutes

    // Validate email format
    const validation = validateEmail(email);

    if (!validation.isValid) {
      throw new ValidationError(validation.message);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Send a success response for security reasons
    if (!user) {
      return successResponse('Återställningslänk har skickats till din e-postadress');
    }

    await prisma.passwordReset.deleteMany({ where: { userId: user.id } });

    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        expiresAt: tokenExpire,
        userId: user.id,
      },
    });
    await sendPasswordResetEmail(user.email, resetToken);

    return successResponse('Återställningslänk har skickats till din e-postadress');
  } catch (error) {
    console.error('Error processing password reset:', error);
    return errorResponse(error);
  }
}
