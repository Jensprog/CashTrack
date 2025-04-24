/**
 * The TransactionList component is a React functional component that
 * displays a list of transactions and provides functionality to edit/delete them.
 */
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axiosConfig";
import TransactionForm from "./TransactionForm";

export default function TransactionList({ initialFilters = {} }) {
    // State for transactions
    const [transactions, setTransactions] = useState([]);

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    // Error state
    const [error, setError] = useState('');

    // Filter state
    const [filters, setFilters] = useState(initialFilters);

    // Categories
    const [categories, setCategories] = useState([]);

    // Edit modal state
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Delete confirmation state
    const [deletingTransaction, setDeletingTransaction] = useState(null);

    // Fetch transactions and categories on component mount
    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    // Fetch transactions with filters
    const fetchTransactions = async () => {
        setIsLoading(true);
        setError('');

        try {
            const queryParams = new URLSearchParams();

            if (filters.startDate) {
                queryParams.append('startDate', filters.startDate);
            }

            if (filters.endDate) {
                queryParams.append('endDate', filters.endDate);
            }

            if (filters.categoryId) {
                queryParams.append('categoryId', filters.categoryId);
            }

            // Fetch transactions from API
            const response = await api.get(`/transactions?${queryParams.toString()}`);
            setTransactions(response.data.data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Kunde inte hämta transaktioner. Försök igen senare.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters({
            ...filters,
            [name]: value
        });
    };

    // Apply filters
    const handleApplyFilters = (event) => {
        event.preventDefault();
        fetchTransactions();
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilters({});
        fetchTransactions();
    };

    // Handle transaction update
    const handleTransactionUpdated = (updatedTransaction) => {
        setEditingTransaction(null);
        fetchTransactions();
    };

    // Handle transaction deletion
    const handleDeleteTransaction = async () => {
        if (!deletingTransaction) return;

        try {
            await api.delete(`/transactions?id=${deletingTransaction.id}`);
            setDeletingTransaction(null);
            fetchTransactions();
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Kunde inte ta bort transaktionen. Försök igen senare.');
        }
    };

    // Format amount with separator and currency
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            current: 'SEK'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('sv-SE');
    };

    // Get category name by ID
    const getCategoryName = (categoryId) => {
        if (!categoryId) return 'Ingen kategori';

        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Okänd kategori';
    };

    return (
        <div>
          {/* Filters */}
          <div className="mb-6 bg-white dark:bg-gray-900 shadow-md rounded p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Filtrera transaktioner</h3>
            
            <form onSubmit={handleApplyFilters} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Start Date */}
                <div>
                  <label 
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" 
                    htmlFor="startDate"
                  >
                    Från datum
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={filters.startDate || ''}
                    onChange={handleFilterChange}
                  />
                </div>
                
                {/* End Date */}
                <div>
                  <label 
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" 
                    htmlFor="endDate"
                  >
                    Till datum
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={filters.endDate || ''}
                    onChange={handleFilterChange}
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label 
                    className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" 
                    htmlFor="categoryId"
                  >
                    Kategori
                  </label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                    id="categoryId"
                    name="categoryId"
                    value={filters.categoryId || ''}
                    onChange={handleFilterChange}
                  >
                    <option value="">Alla kategorier</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Återställ filter
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Använd filter
                </button>
              </div>
            </form>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded">
              {error}
            </div>
          )}
          
          {/* Loading state */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Laddar transaktioner...</p>
            </div>
          ) : (
            <>
              {/* Transaction list */}
              {transactions.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-gray-900 shadow-md rounded">
                  <p className="text-gray-600 dark:text-gray-400">Inga transaktioner hittades.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 shadow-md rounded overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Datum
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Beskrivning
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Belopp
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Åtgärder
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((transaction) => (
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
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                            transaction.amount > 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
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
          
          {/* Edit transaction modal */}
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
          
          {/* Delete confirmation modal */}
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