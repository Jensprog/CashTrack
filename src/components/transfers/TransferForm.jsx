/**
 * @file TransferForm component for transferring money between main account and savings accounts.
 */
'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import api from '@/lib/axiosConfig';

export default function TransferForm({
  transfer = null,
  savingsAccountId = null,
  transferType = 'TO_SAVINGS',
  onSuccess = () => {},
  onCancel = () => {},
}) {
  // Get functions from TransactionContext
  const { createTransfer, updateTransfer } = useTransactions();
  const initialFormState = {
    amount: transfer ? Math.abs(transfer.amount).toString() : '',
    description: transfer?.description || '',
    date: transfer
      ? new Date(transfer.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    type: transfer ? transfer.type : transferType,
    savingsAccountId: transfer ? transfer.savingsAccountId : savingsAccountId || '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [savingsAccounts, setSavingsAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch savings accounts on component mount
  useEffect(() => {
    fetchSavingsAccounts();
  }, []);

  // Find selected account when savingsAccoundId changes
  useEffect(() => {
    if (formData.savingsAccountId && savingsAccounts.length > 0) {
      const account = savingsAccounts.find((acc) => acc.id === formData.savingsAccountId);
      setSelectedAccount(account);
    }
  }, [formData.savingsAccountId, savingsAccounts]);

  // Clear success message after 3 sec
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchSavingsAccounts = async () => {
    try {
      const response = await api.get('/savingsaccount');
      setSavingsAccounts(response.data.data.savingsAccounts || []);
    } catch (error) {
      console.error('Error fetching savings accounts:', error);
      setError('Kunde inte hämta sparkonton. Försök igen senare.');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTransferTypeChange = (type) => {
    setFormData({
      ...formData,
      type: type,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const data = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        type: formData.type,
        savingsAccountId: formData.savingsAccountId,
      };

      // Validate Required fields
      if (!data.amount || !data.date || !data.type || !data.savingsAccountId) {
        throw new Error('Alla obligatoriska fält måste fyllas i');
      }

      if (isNaN(data.amount) || data.amount <= 0) {
        throw new Error('Belopp måste vara ett positivt tal');
      }

      // Savings accounts need to have sufficient balance for transfers
      if (data.type === 'FROM_SAVINGS' && selectedAccount) {
        if (selectedAccount.currentAmount < data.amount) {
          throw new Error(
            `Otillräckligt saldo. Tillgängligt: ${selectedAccount.currentAmount.toFixed(2)}`,
          );
        }
      }

      let response;
      if (transfer) {
        response = await updateTransfer(transfer.id, data);
        setSuccessMessage('Överföringen har uppdaterats!');
      } else {
        response = await createTransfer(data);
        setSuccessMessage('Överföringen har skapats!');
        setFormData({
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          type: transferType,
          savingsAccountId: savingsAccountId || '',
        });
      }

      onSuccess(response?.transfer);
    } catch (error) {
      console.error('Transfer error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Ett fel inträffade. Försök igen senare.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {transfer ? 'Redigera överföring' : 'Ny överföring'}
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
        {/* Transfer Type */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Överföringstyp
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTransferTypeChange('TO_SAVINGS')}
              className={`py-2 px-3 rounded-md flex items-center justify-center ${
                formData.type === 'TO_SAVINGS'
                  ? 'bg-green-100 border border-green-500 dark:bg-green-900/20 dark:border-green-700'
                  : 'bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Till sparkonto
            </button>

            <button
              type="button"
              onClick={() => handleTransferTypeChange('FROM_SAVINGS')}
              className={`py-2 px-3 rounded-md flex items-center justify-center ${
                formData.type === 'FROM_SAVINGS'
                  ? 'bg-blue-100 border border-blue-500 dark:bg-blue-900/20 dark:border-blue-700'
                  : 'bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Från sparkonto
            </button>
          </div>
        </div>

        {/* Savings Account Selection */}
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="savingsAccountId"
          >
            Sparkonto *
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="savingsAccountId"
            name="savingsAccountId"
            value={formData.savingsAccountId}
            onChange={handleChange}
            required
          >
            <option value="">Välj sparkonto</option>
            {savingsAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({formatAmount(account.currentAmount)})
              </option>
            ))}
          </select>
          {selectedAccount && formData.type === 'FROM_SAVINGS' && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tillgängligt saldo: {formatAmount(selectedAccount.currentAmount)}
            </p>
          )}
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
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">kr</span>
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
            placeholder={
              formData.type === 'TO_SAVINGS'
                ? 'T.ex. Månadsparande, Buffert'
                : 'T.ex. Semesterköp, Akut utgift'
            }
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div className="mb-6">
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

        {/* Transfer Summary */}
        {formData.amount && formData.savingsAccountId && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Överföringssammanfattning:
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formData.type === 'TO_SAVINGS' ? (
                <div>
                  <p>
                    Från: <span className="font-medium">Huvudkonto</span>
                  </p>
                  <p>
                    Till: <span className="font-medium">{selectedAccount?.name}</span>
                  </p>
                  <p>
                    Belopp:{' '}
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatAmount(parseFloat(formData.amount || 0))}
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <p>
                    Från: <span className="font-medium">{selectedAccount?.name}</span>
                  </p>
                  <p>
                    Till: <span className="font-medium">Huvudkonto</span>
                  </p>
                  <p>
                    Belopp:{' '}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {formatAmount(parseFloat(formData.amount || 0))}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between">
          {transfer && (
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
              transfer ? '' : 'w-full'
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? transfer
                ? 'Uppdaterar...'
                : 'Överför...'
              : transfer
                ? 'Uppdatera'
                : 'Genomför överföring'}
          </button>
        </div>
      </form>
    </div>
  );
}
