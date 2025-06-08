/**
 * @file The login page, renders LoginForm component.
 */

import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Logga in - CashTrack',
  description: 'Logga in på ditt CashTrack-konto för att hantera din ekonomi.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            CashTrack
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Din personliga ekonomihanterare
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
