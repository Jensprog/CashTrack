/**
 * @file SavingsAccountList component to show a list of savings accounts.
 */
'use client';

import { useState } from 'react';
import SavingsAccountForm from '@/components/savingsaccount/SavingsAccountForm';
import TransferForm from '@/components/transfers/TransferForm';

export default function SavingsAccountList({
  savingsAccounts,
  loading,
  onUpdate,
  onDelete,
  onRefresh,
}) {
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [transferModal, setTransferModal] = useState(null);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const calculateProgress = (currentAmount, targetAmount) => {
    if (!targetAmount || targetAmount <= 0) return 0;
    return Math.min((currentAmount / targetAmount) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleAccountUpdated = () => {
    setEditingAccount(null);
    if (onRefresh) onRefresh();
  };

  const handleTransferSuccess = () => {
    setTransferModal(null);
    if (onRefresh) onRefresh();
  };

  const handleDeleteAccount = async () => {
    if (!deletingAccount) return;

    try {
      await onDelete(deletingAccount.id);
      setDeletingAccount(null);
    } catch (error) {
      console.error('Error deleting savings account:', error);
      alert(error.response?.data?.message || 'Kunde inte ta bort sparkontot. Försök igen senare.');
    }
  };

  if (loading) {
    return <p className="text-gray-600 dark:text-gray-400 text-sm">Laddar sparkonton...</p>;
  }

  if (savingsAccounts.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600 dark:text-gray-400 mb-3">Inga sparkonton än</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Skapa ditt första sparkonto för att komma igång med sparandet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {savingsAccounts.map((account) => {
          const progress = calculateProgress(account.currentAmount, account.targetAmount);
          const progressColor = getProgressColor(progress);

          return (
            <div
              key={account.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              {/* Account Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {account.name}
                  </h3>
                  {account.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {account.description}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingAccount(account)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => setDeletingAccount(account)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                  >
                    Ta bort
                  </button>
                </div>
              </div>

              {/* Current Amount */}
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sparat:
                  </span>
                  <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatAmount(account.currentAmount)}
                  </span>
                </div>
              </div>

              {/* Target Amount and Progress */}
              {account.targetAmount && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sparmål:
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatAmount(account.targetAmount)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${progressColor}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {progress.toFixed(1)}% av målet
                    </span>
                    {progress >= 100 ? (
                      <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        🎉 Mål uppnått!
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatAmount(account.targetAmount - account.currentAmount)} kvar
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Transfer Actions */}
              <div className="flex space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setTransferModal({ type: 'TO_SAVINGS', accountId: account.id })}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                >
                  Överför till
                </button>
                <button
                  onClick={() => setTransferModal({ type: 'FROM_SAVINGS', accountId: account.id })}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                  disabled={account.currentAmount <= 0}
                >
                  Ta ut från
                </button>
              </div>

              {/* Transfer History Summary */}
              {account.transfers && account.transfers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {account.transfers.length} överföring(ar) • Senaste:{' '}
                    {new Date(account.transfers[0].date).toLocaleDateString('sv-SE')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transfer modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {transferModal.type === 'TO_SAVINGS'
                    ? 'Överför till sparkonto'
                    : 'Ta ut från sparkonto'}
                </h3>
                <button
                  onClick={() => setTransferModal(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              <TransferForm
                savingsAccountId={transferModal.accountId}
                transferType={transferModal.type}
                onSuccess={handleTransferSuccess}
                onCancel={() => setTransferModal(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit account modal */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Redigera sparkonto
                </h3>
                <button
                  onClick={() => setEditingAccount(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              <SavingsAccountForm
                savingsAccount={editingAccount}
                onSubmit={(data) => onUpdate(editingAccount.id, data)}
                onSuccess={handleAccountUpdated}
                onCancel={() => setEditingAccount(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deletingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Bekräfta borttagning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Är du säker på att du vill ta bort sparkontot "{deletingAccount.name}"?
                {deletingAccount.currentAmount > 0 && (
                  <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                    Varning: Detta konto har {formatAmount(deletingAccount.currentAmount)} sparat.
                  </span>
                )}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeletingAccount(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteAccount}
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
