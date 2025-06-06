/**
 * The TransactionForm component is a React functional component that
 * provides a form for adding or editing transactions.
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import api from '@/lib/axiosConfig.js';

export default function TransactionForm({
  transaction = null,
  onSuccess = () => {},
  onCancel = () => {},
}) {
  // Get functions from TransactionContext
  const { createTransaction, updateTransaction } = useTransactions();

  // Initial form state
  const initialFormState = {
    amount: transaction ? Math.abs(transaction.amount).toString() : '',
    description: transaction?.description || '',
    date: transaction
      ? new Date(transaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    categoryId: transaction?.categoryId || '',
    transactionType: transaction
      ? transaction.amount > 0
        ? 'income'
        : transaction.category?.isSaving
          ? 'saving'
          : 'expense'
      : 'expense',
  };

  // Form state
  const [formData, setFormData] = useState(initialFormState);

  // Categories
  const [categories, setCategories] = useState([]);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [error, setError] = useState('');

  // Success message
  const [successMessage, setSuccessMessage] = useState('');

  const messageTimerRef = useRef(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();

    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  // Effect to clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }

      messageTimerRef.current = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  }, [successMessage]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Kunde inte hämta kategorier. Försök igen senare.');
    }
  };

  const handleTransactionTypeChange = (type) => {
    setFormData({
      ...formData,
      transactionType: type,
      categoryId: '',
    });
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      let amount = Math.abs(parseFloat(formData.amount));

      if (formData.transactionType !== 'income') {
        amount = -amount;
      }

      const data = {
        amount,
        description: formData.description,
        date: formData.date,
        categoryId: formData.categoryId || null,
      };

      let response;
      if (transaction) {
        response = await updateTransaction(transaction.id, data);
        setSuccessMessage('Transaktionen har uppdaterats!');
      } else {
        response = await createTransaction(data);
        setSuccessMessage('Transaktionen har skapats!');

        setFormData({
          ...initialFormState,
          amount: '',
          description: '',
          categoryId: '',
          date: new Date().toISOString().split('T')[0],
        });
      }

      onSuccess(response?.transaction);
    } catch (error) {
      console.error('Transaction error', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Ett fel inträffade. Försök igen senare');
      }
      // Clear error message after 5 seconds
      messageTimerRef.current = setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories
    .filter((category) => {
      if (formData.transactionType === 'income') {
        return category.isIncome;
      } else if (formData.transactionType === 'saving') {
        return !category.isIncome && category.isSaving;
      } else {
        return !category.isIncome && !category.isSaving;
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'sv'));

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {transaction ? 'Redigera transaktion' : 'Ny transaktion'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Transaction Type */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Transaktionstyp
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleTransactionTypeChange('income')}
              className={`py-2 px-3 rounded-md flex items-center justify-center ${
                formData.transactionType === 'income'
                  ? 'bg-green-100 border border-green-500 dark:bg-green-900/20 dark:border-green-700'
                  : 'bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Inkomst
            </button>

            <button
              type="button"
              onClick={() => handleTransactionTypeChange('saving')}
              className={`py-2 px-3 rounded-md flex items-center justify-center ${
                formData.transactionType === 'saving'
                  ? 'bg-blue-100 border border-blue-500 dark:bg-blue-900/20 dark:border-blue-700'
                  : 'bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Sparande
            </button>

            <button
              type="button"
              onClick={() => handleTransactionTypeChange('expense')}
              className={`py-2 px-3 rounded-md flex items-center justify-center ${
                formData.transactionType === 'expense'
                  ? 'bg-red-100 border border-red-500 dark:bg-red-900/20 dark:border-red-700'
                  : 'bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Utgift
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Belopp (kr) *
          </label>
          <div className="relative">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              name="amount"
              type="text"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <div
              className={`absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none ${
                formData.transactionType === 'income'
                  ? 'text-green-500'
                  : formData.transactionType === 'saving'
                    ? 'text-blue-500'
                    : 'text-red-500'
              }`}
            >
              {formData.transactionType === 'income' ? '+' : '-'}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Beskrivning
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            type="text"
            placeholder="Vad handlar transaktionen om?"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Datum *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="mb-6">
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
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">Välj kategori (valfritt)</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            disabled={isLoading}
          >
            {isLoading
              ? transaction
                ? 'Uppdaterar...'
                : 'Sparar...'
              : transaction
                ? 'Uppdatera'
                : 'Spara'}
          </button>
        </div>
      </form>
    </div>
  );
}
