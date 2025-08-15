/**
 * @file SavingsAccountForm component is a form to add and edit savings accounts.
 */
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axiosConfig';

export default function SavingsAccountForm({
  savingsAccount = null,
  onSubmit,
  onSuccess = () => {},
  onCancel = () => {},
}) {
  const initialFormState = {
    name: savingsAccount ? savingsAccount.name : '',
    description: savingsAccount ? savingsAccount.description || '' : '',
    targetAmount: savingsAccount
      ? savingsAccount.targetAmount
        ? savingsAccount.targetAmount.toString()
        : ''
      : '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (savingsAccount) {
      setFormData({
        name: savingsAccount.name,
        description: savingsAccount.description || '',
        targetAmount: savingsAccount.targetAmount ? savingsAccount.targetAmount.toString() : '',
      });
    }
  }, [savingsAccount]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : null,
      };

      if (!data.name) {
        throw new Error('Namn krävs');
      }

      if (data.targetAmount !== null && (isNaN(data.targetAmount) || data.targetAmount <= 0)) {
        throw new Error('Målsumma måste vara ett positivt tal');
      }

      const response = await onSubmit(data);

      if (savingsAccount) {
        setSuccessMessage('Sparkontot har uppdaterats!');
      } else {
        setSuccessMessage('Sparkontot har skapats!');
        setFormData({
          name: '',
          description: '',
          targetAmount: '',
        });
      }

      onSuccess(response?.data?.data?.savingsAccount);
    } catch (error) {
      console.error('Savings account error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Ett fel inträffade. Försök igen senare.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
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
        {/* Account Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Kontonamn *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="T.ex. Buffert, Semesterresa, Ny bil"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Beskrivning
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            rows="3"
            placeholder="Vad sparar du till? (valfritt)"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Target Amount */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="targetAmount"
          >
            Sparmål (kr)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="targetAmount"
            name="targetAmount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Hur mycket vill du spara? (valfritt)"
            value={formData.targetAmount}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Lämna tomt om du inte har ett specifikt sparmål
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          {savingsAccount && (
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              onClick={onCancel}
            >
              Avbryt
            </button>
          )}
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
              savingsAccount ? '' : 'w-full'
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? savingsAccount
                ? 'Uppdaterar...'
                : 'Sparar...'
              : savingsAccount
                ? 'Uppdatera'
                : 'Skapa sparkonto'}
          </button>
        </div>
      </form>
    </div>
  );
}
