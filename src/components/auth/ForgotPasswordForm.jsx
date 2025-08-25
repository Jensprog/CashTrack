/**
 * @file Responsible for sending the reset password link to the user.
 */
'use client';

import { useState } from 'react';
import api from '@/lib/axiosConfig';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('auth/forgot-password', { email });

      if (!response.ok) {
        throw new Error('Failed to send reset link');
      }

      setSuccessMessage('Återställnings länk skickad!');
    } catch (error) {
      setError(error.message || 'Ett fel inträffade. Försök igen senare');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6
   pb-8 mb-4"
      >
        <h2
          className="text-2xl font-bold mb-6 text-center text-gray-800 
  dark:text-white"
        >
          Återställ lösenord
        </h2>

        {error && (
          <div
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 
  text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 
  rounded"
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 
  text-green-700 dark:text-green-300 border border-green-200 
  dark:border-green-800 rounded"
          >
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm 
  font-bold mb-2"
              htmlFor="email"
            >
              E-postadress
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 
  px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight 
  focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Ange din e-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold 
  py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full 
  transition-colors duration-200"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Skickar...' : 'Skicka återställningslänk'}
          </button>
        </form>
      </div>
    </div>
  );
}
