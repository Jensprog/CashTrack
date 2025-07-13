/**
 * @file Client component for the savings accounts page.
 *
 * This component contains the savings account form and savings account list.
 */
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axiosConfig';
import SavingsAccountForm from '@/components/savingsaccount/SavingsAccountForm';
import SavingsAccountList from '@/components/savingsaccount/SavingsAccountList';

export default function SavingsAccountPage() {
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchSavingsAccounts();
  }, []);

  const fetchSavingsAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/savingsaccount');
      setSavingsAccounts(response.data.data.savingsAccounts);
      setError(null);
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
      setError('Kunde inte hämta sparkonton. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  const addSavingsAccount = async (savingsAccountData) => {
    try {
      const response = await api.post('/savingsaccount', savingsAccountData);
      setSavingsAccounts([...savingsAccounts, response.data.data.savingsAccount]);
      return response.data;
    } catch (error) {
      console.error('Error adding savings account:', error);
      throw error;
    }
  };

  const updateSavingsAccount = async (id, savingsAccountData) => {
    try {
      const response = await api.put(`/savingsaccount/${id}`, savingsAccountData);
      setSavingsAccounts(
        savingsAccounts.map((account) =>
          account.id === id ? response.data.data.savingsAccount : account,
        ),
      );

      return response.data;
    } catch (error) {
      console.error('Error updating savings account:', error);
      throw error;
    }
  };

  const deleteSavingsAccount = async (id) => {
    try {
      await api.delete(`/savingsaccount/${id}`);
      setSavingsAccounts(savingsAccounts.filter((account) => account.id !== id));
    } catch (error) {
      console.error('Error deleting savings account:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mina Sparkonton</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Savings Account Form (left column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Lägg till sparkonto
                </h2>
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 lg:hidden"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? 'Dölj' : 'Visa'}
                </button>
              </div>

              <div className={`${showAddForm ? 'block' : 'hidden lg:block'}`}>
                <SavingsAccountForm onSubmit={addSavingsAccount} />
              </div>
            </div>

            {/* Information om sparkonton */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Om sparkonton
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Sparkonton hjälper dig att spara till specifika mål. Sätt upp sparmål och följ dina
                framsteg.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                <li>Skapa sparkonton för olika mål (semester, bil, buffert)</li>
                <li>Sätt sparmål för att hålla dig motiverad</li>
                <li>Koppla transaktioner till dina sparkonton</li>
                <li>Följ dina framsteg mot målen</li>
              </ul>
            </div>
          </div>

          {/* Savings Account List (right column) */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Sparkonton
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded">
                  {error}
                </div>
              )}
              <SavingsAccountList
                savingsAccounts={savingsAccounts}
                loading={loading}
                onUpdate={updateSavingsAccount}
                onDelete={deleteSavingsAccount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
