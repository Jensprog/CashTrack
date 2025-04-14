/**
 * The RegisterPage component is a Next.js page that renders a registration 
 * form.
 */

import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
    title: "Registrera - CashTrack",
    description: "Skapa ett konto hos CashTrack och kontrollera din ekonomi.",
};

export default function RegisterPage() {
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
            
            <RegisterForm />
          </div>
        </div>
      );
}