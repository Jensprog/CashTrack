/**
 * @file Responsible for the reset password form.
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validatePassword, validatePasswordMatch } from '@/utils/validators';
import api from '@/lib/axiosConfig';
import PasswordInput from '@/components/ui/PasswordInput';

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Ogiltig eller saknad återställningstoken.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('Ogiltig återställningstoken.');
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setLoading(false);
      return;
    }

    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.isValid) {
      setError(matchValidation.message);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('auth/reset-password', { 
        token, 
        newPassword 
      });
      setSuccessMessage(response.data.message);
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Ett fel inträffade. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Återställ lösenord
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="newPassword">
              Nytt lösenord
            </label>
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ange ditt nya lösenord"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Måste vara minst 8 tecken långt</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Bekräfta lösenord
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Bekräfta ditt nya lösenord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
            type="submit"
            disabled={loading || !token}
          >
            {loading ? 'Uppdaterar...' : 'Uppdatera lösenord'}
          </button>
        </form>
      </div>
    </div>
  );
}
