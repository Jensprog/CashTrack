/**
 * Dashboard component.
 *
 * This client component is the main container for the dashboard overview page.
 * It shows summary financial information and recent transactions.
 */
'use client';

import { TransactionProvider } from '@/context/TransactionContext';
import FinancialOverview from '@/components/transactions/FinancialOverview';
import LatestTransactions from '@/components/transactions/LatestTransactions';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <TransactionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Min Översikt</h1>

          {/* Financial Overview Widget */}
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Ekonomisk översikt
            </h2>
            <FinancialOverview />
          </div>

          {/* Dashboard Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Latest Transactions Widget */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Senaste transaktioner
                </h2>
                <Link
                  href="/transactions"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Visa alla
                </Link>
              </div>
              <LatestTransactions />
            </div>

            {/* Quick Actions Widget */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Snabbåtgärder
              </h2>
              <div className="space-y-3">
                <Link
                  href="/transactions"
                  className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded transition-colors w-full"
                >
                  <span>Hantera transaktioner</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransactionProvider>
  );
}
