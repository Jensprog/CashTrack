/**
 * @file Utility function for sending emails to users.
 */

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendPasswordResetEmail(email, token) {
  const resetLink = `${process.env.APP_URL}/resetpassword?token=${token}`;

  try {
    console.log('Attempting to send password reset email via SendGrid to:', email);
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Återställ ditt lösenord - CashTrack',
      html: `
        <h2>Återställ ditt lösenord</h2>
        <p>Du har begärt att återställa ditt lösenord för CashTrack.</p>
        <p><a href="${resetLink}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Återställ lösenord</a></p>
        <p>Denna länk är giltig i 15 minuter.</p>
        <p>Om du inte begärde denna återställning, ignorera detta e-postmeddelande.</p>
      `,
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully via SendGrid:', result[0].statusCode);
    return result;
  } catch (error) {
    console.error('SendGrid email sending failed:', error.message, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
