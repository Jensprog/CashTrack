/**
 * The TransactionList component is a React functional component that
 * - Lists and displays transactions with sorting capabilities.
 * - Filtering transactions by date range and category.
 * - Editing existing transactions.
 * - Deleting transactions with confirmation.
 */
'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import { sortTransactions } from '@/utils/transactionSorter';
import TransactionForm from './TransactionForm';
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import api from '@/lib/axiosConfig';

export default function TransactionList({ initialFilters = {} }) {
  // Use the TransactionContext
  const {
    transactions,
    loading,
    error,
    filters,
    setFilters,
    fetchTransactions,
    deleteTransaction,
  } = useTransactions();

  // Categories
  const [categories, setCategories] = useState([]);

  // Edit modal state
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Delete confirmation state
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  // Sorting state, default to "sort by date"
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'descending',
  });

  // Fetch transactions and categories on component mount
  useEffect(() => {
    fetchCategories();
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
      fetchTransactions(initialFilters);
    }
  }, []);

  // Sort transactions based on the current sort configuration
  const sortedTransactions = sortTransactions(transactions, sortConfig.key, sortConfig.direction);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Apply filters
  const handleApplyFilters = (newFilters) => {
    fetchTransactions(newFilters);
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      categoryId: '',
    };
    setFilters(resetFilters);
    fetchTransactions(resetFilters);
  };

  // Handle transaction update
  const handleTransactionUpdated = (updatedTransaction) => {
    setEditingTransaction(null);
  };

  // Handle transaction deletion
  const handleDeleteTransaction = async () => {
    if (!deletingTransaction) return;

    try {
      await deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Kunde inte ta bort transaktionen. Försök igen senare.');
    }
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  // Format amount with separator and currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Ingen kategori';

    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Okänd kategori';
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6">
        <DateRangeFilter
          initialFilters={filters}
          onFilterApply={handleApplyFilters}
          onFilterReset={handleResetFilters}
          includeCategory={true}
          categories={categories}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Laddar transaktioner...</p>
        </div>
      ) : (
        <>
          {/* Transaction list */}
          {sortedTransactions.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-gray-900 shadow-md rounded">
              <p className="text-gray-600 dark:text-gray-400">Inga transaktioner hittades.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 shadow-md rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('date')}
                    >
                      Datum {getSortIndicator('date')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('description')}
                    >
                      Beskrivning {getSortIndicator('description')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('categoryId')}
                    >
                      Kategori {getSortIndicator('categoryId')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('amount')}
                    >
                      Belopp {getSortIndicator('amount')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Åtgärder
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {transaction.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {getCategoryName(transaction.categoryId)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          transaction.amount > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {formatAmount(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingTransaction(transaction)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                        >
                          Redigera
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(transaction)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Ta bort
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Edit transaction module */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Redigera transaktion
                </h3>
                <button
                  onClick={() => setEditingTransaction(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              <TransactionForm
                transaction={editingTransaction}
                onSuccess={handleTransactionUpdated}
                onCancel={() => setEditingTransaction(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation module */}
      {deletingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Bekräfta borttagning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Är du säker på att du vill ta bort denna transaktion? Detta kan inte ångras.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeletingTransaction(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteTransaction}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Ta bort
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
