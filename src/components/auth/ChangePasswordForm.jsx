/**
 * This component is responsible for changing an existing password to a new one.
 * Only works if the user knows the old password they want to change from.
 */
'use client';

import { useState } from 'react';
import api from '@/lib/axiosConfig';
import { useRouter } from 'next/navigation';
import { validatePassword, validatePasswordMatch } from '@/utils/validators';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Alla fält behöver vara ifyllda');
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    const matchValidation = validatePasswordMatch(newPassword, confirmNewPassword);
    if (!matchValidation.isValid) {
      setError(matchValidation.message);
      return;
    }

    setLoading(true);

    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setSuccessMessage('Ditt lösenord har nu ändrats!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      setTimeout(() => {
        router.push('/useraccount');
      }, 2000);
    } catch (error) {
      console.error('Change of password error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Ett fel inträffade vid ändring av lösenord. Försök igen senare.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ändra lösenord</h2>

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

      <form onSubmit={handlePasswordChange} noValidate>
        {/* Current Password */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="currentPassword"
          >
            Nuvarande lösenord *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Ange ditt nuvarande lösenord"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label
            className="block text-blue-700 dark:text-blue-300 text-sm font-bold mb-2"
            htmlFor="newPassword"
          >
            Nytt lösenord *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Ange ditt nya lösenord"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Måste vara minst 8 tecken långt
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="confirmNewPassword"
          >
            Bekräfta nytt lösenord *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            placeholder="Bekräfta ditt nya lösenord"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            disabled={loading}
          >
            {loading ? 'Ändrar lösenord...' : 'Ändra lösenord'}
          </button>
        </div>
      </form>
    </div>
  );
}
