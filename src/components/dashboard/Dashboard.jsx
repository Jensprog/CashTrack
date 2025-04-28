/**
 * Dashboard component.
 *
 * This client component is the main container for the dashboard page.
 * It wraps all transaction-related components with the TransactionProvider
 * to enable communication between them.
 */
'use client';

import { TransactionProvider } from '@/context/TransactionContext';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import FinancialOverview from '@/components/transactions/FinancialOverview';

export default function Dashboard() {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Min Ekonomi</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Summary and Transaction Form (Left Column) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Lägg till transaktion
                </h2>
                <TransactionForm />
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Ekonomisk översikt
                </h2>
                <FinancialOverview />
              </div>
            </div>

            {/* Transactions (Right Column) */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Mina transaktioner
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
