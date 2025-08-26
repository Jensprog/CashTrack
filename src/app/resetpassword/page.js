/**
 * @file Renders the ResetPasswordForm component.
 */

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Återställ lösenord - CashTrack',
  description: 'Återställ ditt lösenord för att komma åt ditt CashTrack-konto.',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            CashTrack
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Återställ ditt lösenord
          </p>
        </div>

        <Suspense fallback={
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Laddar...</p>
              </div>
            </div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
