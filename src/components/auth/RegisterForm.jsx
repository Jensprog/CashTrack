/**
 * @file The RegisterForm component is a React functional component that
 * provides a registration form for users.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateRegistrationForm } from '@/utils/validators';
import Link from 'next/link';
import axios from 'axios';
import PasswordInput from '@/components/ui/PasswordInput';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const validation = validateRegistrationForm({
      username,
      email,
      password,
      confirmPassword,
    });

    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      setSuccessMessage(response.data.message);

      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Ett fel inträffade vid registreringen. Försök igen senare.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Skapa ditt CashTrack konto
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-200 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-200 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Användarnamn
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Ange ditt användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-postadress
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Lösenord
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ange ditt lösenord"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Måste vara minst 8 tecken långt</p>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Bekräfta lösenord
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registrering...' : 'Registrera'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Har du redan ett konto?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-700 font-medium">
              Logga in
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded">
          <p>
            Genom att registrera dig godkänner du att vi lagrar dina uppgifter enligt vår
            integritetspolicy. Vi samlar bara in nödvändig data för att denna applikationen ska
            fungera.
          </p>
        </div>
      </div>
    </div>
  );
}
