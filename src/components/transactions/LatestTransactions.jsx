/**
 * LatestTransactions component
 *
 * Displays the 5 most recent transactions from TransactionList.
 */
'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { getLatestTransactions } from '@/utils/transactionSorter';
import Link from 'next/link';

export default function LatestTransactions() {
  const { transactions, loading, error } = useTransactions();
  const [latestTransactions, setLatestTransactions] = useState([]);

  useEffect(() => {
    // Get the 5 most recent transactions
    if (transactions && transactions.length > 0) {
      setLatestTransactions(getLatestTransactions(transactions, 5));
    }
  }, [transactions]);

  // Format amount with separator and currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  if (loading) {
    return <p className="text-gray-600 dark:text-gray-400 text-sm">Laddar transaktioner...</p>;
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400 text-sm">Kunde inte ladda transaktioner</p>;
  }

  if (latestTransactions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600 dark:text-gray-400 mb-3">Inga transaktioner än</p>
        <Link
          href="/transactions?action=add"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
        >
          Lägg till din första transaktion
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {latestTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex justify-between items-center p-3 rounded bg-gray-50 dark:bg-gray-800"
        >
          <div>
            <div className="font-medium">{transaction.description || 'Ingen beskrivning'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(transaction.date)}
            </div>
          </div>
          <div
            className={`font-medium ${
              transaction.amount > 0
                ? 'text-green-600 dark:text-green-400'
                : transaction.category?.isSaving
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {formatAmount(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
