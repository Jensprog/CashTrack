/**
 * Client component for the transaction page.
 *
 * This component contains the transaction form and transaction list.
 */
'use client';

import { TransactionProvider } from '@/context/TransactionContext';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TransactionPage() {
  const searchParams = useSearchParams();
  const [showAddForm, setShowAddForm] = useState(false);

  // Check if action is to add a transaction
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setShowAddForm(true);
    }
  }, [searchParams]);

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Mina Transaktioner
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transaction Form (Left Column) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Lägg till transaktion
                  </h2>
                  <button
                    className="text-sm text-blue-600 dark:text-blue-400 lg:hidden"
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    {showAddForm ? 'Dölj' : 'Visa'}
                  </button>
                </div>

                <div className={`${showAddForm ? 'block' : 'hidden lg:block'}`}>
                  <TransactionForm />
                </div>
              </div>
            </div>

            {/* Transactions List (Right Column) */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Transaktioner
                </h2>
                <TransactionList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
}
