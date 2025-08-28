/**
 * @file Component for setting initial balance as a transaction
 */
'use client';

import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';

export default function SetInitialBalance() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { createTransaction } = useTransactions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const numericAmount = parseFloat(amount);
      
      if (isNaN(numericAmount) || numericAmount === 0) {
        setError('Ange ett giltigt belopp');
        return;
      }

      // Create initial balance transaction
      await createTransaction({
        amount: numericAmount,
        description: 'Startsaldo',
        date: new Date().toISOString().split('T')[0],
        categoryId: null, // No category needed for initial balance
      });

      setSuccess('Startsaldo har lagts till!');
      setAmount('');
    } catch (error) {
      console.error('Error setting initial balance:', error);
      setError(error.response?.data?.message || 'Kunde inte sätta startsaldo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Sätt startsaldo
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Lägg till ditt nuvarande kontosaldo som startpunkt för att börja spåra dina finanser från idag.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ange belopp (kr)"
          step="0.01"
          className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !amount}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
        >
          {loading ? 'Lägger till...' : 'Lägg till'}
        </button>
      </form>
    </div>
  );
}