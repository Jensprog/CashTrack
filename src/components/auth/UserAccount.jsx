/**
 * @file This component is responsible for handling a logged on users account.
 * - Deleting user account and all related data.
 * - Exporting user data (future implementation).
 * - Change username (future implemenation).
 * - Profile picture (future implementation).
 */
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axiosConfig';
import ChangePassword from '@/components/auth/ChangePasswordForm';

export default function UserAccount() {
  // Get user data and logout function from AuthContext.
  const { user, logout } = useAuth();
  const router = useRouter();

  // State for different sections in the component.
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State for account deletion.
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Calls the logout function from AuthContext.
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'RADERA') {
      setError('Du måste skriva RADERA för att bekräfta borttagning av konto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.delete('/auth/delete-account');

      await logout();
      router.push('/');

      alert('Ditt konto och all data har raderats permanent');
    } catch (error) {
      console.error('Delete account error:', error);
      setError(error.response?.data?.message || 'Ett fel inträffade vid borttagning av konto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mitt konto</h1>

        {/* Navigation */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveSection('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'profile'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Profil
              </button>
              <button
                onClick={() => setActiveSection('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'security'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Säkerhet
              </button>
            </nav>
          </div>
        </div>

        {/* Error and success messages */}
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

        {/* Profile section */}
        {activeSection === 'profile' && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Profilinformation
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Användarnamn
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-gray-900 dark:text-white">{user?.username}</p>
                </div>
              </div>
              </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-postadress
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Medlemskap sedan
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <p className="text-gray-900 dark:text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('sv-SE')
                      : 'Okänt'}
                  </p>
                </div>
              </div>

              {/* Future possible functions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Framtida funktioner: Användarnamn, profilbild
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security section */}
        {activeSection === 'security' && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Säkerhet</h2>

            <div className="space-y-6">
              {/* Logga ut */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Logga ut</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Logga ut från CashTrack på denna enhet.
                </p>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logga ut
                </button>
              </div>

              {/* Ändra lösenord */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-7">
                <ChangePassword />
              </div>

              {/* Radera konto */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Radera ditt konto permanent. Denna åtgärd kan inte ångras och all din data kommer
                  att raderas.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Radera konto
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for account deletion */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                  Radera konto permanent
                </h3>
                <div className="mb-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Denna åtgärd kommer att:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                    <li>• Radera ditt konto permanent</li>
                    <li>• Ta bort alla dina transaktioner</li>
                    <li>• Ta bort alla dina kategorier</li>
                    <li>• Denna åtgärd kan INTE ångras</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    För att bekräfta, skriv <strong>RADERA</strong> i fältet nedan:
                  </p>
                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Skriv RADERA"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation('');
                      setError('');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmation !== 'RADERA'}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    {loading ? 'Raderar...' : 'Radera konto'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
