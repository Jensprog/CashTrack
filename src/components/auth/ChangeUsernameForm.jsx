/**
 * @file This component is responsible for handling the username change.
 */
'use client';

import { useState } from 'react';
import api from '@/lib/axiosConfig';
import { validateUsername } from '@/utils/validators';
import { useAuth } from '@/context/AuthContext';

export default function ChangeUsername({ currentUsername }) {
  const { updateUser } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUsernameChange = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!newUsername) {
      setError('Användarnamnet kan inte vara tomt');
      return;
    }

    const validation = validateUsername(newUsername);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setLoading(true);

    try {
      await api.put('/auth/change-username', { currentUsername, newUsername });

      setSuccessMessage('Ditt användarnamn har nu ändrats!');
      setNewUsername('');
      setIsEditing(false);
      updateUser({ username: newUsername });
      
    } catch (error) {
      console.error('Change of username error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Ett fel inträffade vid ändring av användarnamn. Försök igen senare.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setNewUsername(currentUsername || '');
    setError('');
    setSuccessMessage('');
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewUsername('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div>
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

      <div className="flex items-center justify-between">
        {!isEditing ? (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex-grow mr-4">
            <p className="text-gray-900 dark:text-white">{currentUsername}</p>
          </div>
        ) : (
          <form onSubmit={handleUsernameChange} className="flex-grow mr-4">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
              placeholder="Ange nytt användarnamn"
              required
              disabled={loading}
              autoFocus
            />
          </form>
        )}

        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Ändra användarnamn
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelClick}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                disabled={loading}
              >
                Avbryt
              </button>
              <button
                onClick={handleUsernameChange}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                disabled={loading}
              >
                {loading ? 'Sparar...' : 'Spara'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
