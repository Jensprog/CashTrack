/**
 * @file Renders the ForgotPasswordForm component.
 */

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-800 flex 
  items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <ForgotPasswordForm />
    </div>
  );
}
