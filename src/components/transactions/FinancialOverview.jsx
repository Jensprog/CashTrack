/**
 * The FinancialOverview component displays summary information
 * about the user's financial transactions.
 */
'use client';

import { useState } from 'react';
import { useTransactions } from '@/context/TransactionContext';

export default function FinancialOverview() {
  // Get financial data from TransactionContext
  const { financialData, loading, error } = useTransactions();

  // Period selection
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Format amount with separator and currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get display data based on selected period
  const getDisplayData = () => {
    switch (selectedPeriod) {
      case 'week':
        return {
          balance: financialData.weekly.balance,
          income: financialData.weekly.income,
          expenses: financialData.weekly.expenses,
          label: 'Senaste veckan',
        };
      case 'month':
        return {
          balance: financialData.monthly.balance,
          income: financialData.monthly.income,
          expenses: financialData.monthly.expenses,
          label: 'Senaste månaden',
        };
      default:
        return {
          balance: financialData.balance,
          income: financialData.income,
          expenses: financialData.expenses,
          label: 'Alla transaktioner',
        };
    }
  };

  // Get the current display data
  const displayData = getDisplayData();

  return (
    <div>
      {/* Period selector */}
      <div className="mb-4">
        <div className="flex space-x-1 rounded-md bg-gray-100 dark:bg-gray-800 p-1">
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`flex-1 py-1 px-3 text-sm font-medium rounded-md transition-colors ${
              selectedPeriod === 'all'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Alla
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`flex-1 py-1 px-3 text-sm font-medium rounded-md transition-colors ${
              selectedPeriod === 'month'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Månad
          </button>
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`flex-1 py-1 px-3 text-sm font-medium rounded-md transition-colors ${
              selectedPeriod === 'week'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Vecka
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded text-sm">
          {error}
        </div>
      )}

      {/* Financial overview */}
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Laddar ekonomisk data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
              Balans ({displayData.label})
            </h3>
            <p
              className={`text-2xl font-semibold ${
                displayData.balance >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatAmount(displayData.balance)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                Inkomster
              </h3>
              <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                {formatAmount(displayData.income)}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Utgifter</h3>
              <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                {formatAmount(displayData.expenses)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
