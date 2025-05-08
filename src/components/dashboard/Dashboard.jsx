/**
 * Dashboard component.
 *
 * This client component is the main container for the dashboard overview page.
 * It shows a summary of all transactions, monthly or weekly with a custom
 * filter to choose a specific date range. Also shows the 5 latest transactions.
 */
'use client';

import { useState, useEffect } from 'react';
import { TransactionProvider, useTransactions } from '@/context/TransactionContext';
import FinancialOverview from '@/components/transactions/FinancialOverview';
import LatestTransactions from '@/components/transactions/LatestTransactions';
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import Link from 'next/link';
import api from '@/lib/axiosConfig';

function DashboardContent() {
  const { fetchTransactions, customFilters, setCustomFilters, loading } = useTransactions();

  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data.categories || []);
      } catch (error) {
        console.erreor('Error fetching categories:', error);
      }
    };

    getCategories();
  }, []);

  const handleFilterApply = (newFilters) => {
    fetchTransactions(newFilters);
  };

  const handleFilterReset = () => {
    fetchTransactions({
      startDate: '',
      endDate: '',
      categoryId: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Min Översikt</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            {showFilters ? 'Dölj filter' : 'Visa filter'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ml-1 transform ${showFilters ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Anpassat datumfilter */}
        {showFilters && (
          <div className="mb-6">
            <DateRangeFilter
              initialFilters={customFilters}
              onFilterApply={handleFilterApply}
              onFilterReset={handleFilterReset}
              includeCategory={true}
              categories={categories}
              compact={true}
            />
          </div>
        )}

        {/* Financial Overview Widget */}
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Ekonomisk översikt
          </h2>
          <FinancialOverview customFilters={customFilters} />
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

              <Link
                href="/categories"
                className="flex items-center justify-between bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded transition-colors w-full"
              >
                <span>Hantera kategorier</span>
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
  );
}

export default function DashBoard() {
  return (
    <TransactionProvider>
      <DashboardContent />
    </TransactionProvider>
  );
}
