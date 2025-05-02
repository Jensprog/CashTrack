/**
 * CategoryList component to show a list of categories.
 */
'use client';

import { useState } from 'react';
import CategoryForm from './CategoryForm';

export default function CategoryList({ categories, loading, onUpdate, onDelete }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const incomeCategories = categories.filter((cat) => cat.isIncome);
  const expenseCategories = categories.filter((cat) => !cat.isIncome);

  const handleCategoryUpdated = (updatedCategory) => {
    setEditingCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      await onDelete(deletingCategory.id);
      setDeletingCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Kunde inte ta bort kategorin. Försök igen senare.');
    }
  };

  if (loading) {
    return <p className="text-gray-600 dark:text-gray-400 text-sm">Laddar kategorier...</p>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-600 dark:text-gray-400 mb-3">Inga kategorier än</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Skapa kategorier för att organisera dina transaktioner.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Income categories */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3 border-b pb-2">
          Inkomstkategorier
        </h3>
        {incomeCategories.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Inga inkomstkategorier skapade.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center p-3 rounded bg-green-50 dark:bg-green-900/10"
              >
                <span className="font-medium">{category.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => setDeletingCategory(category)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expense categories */}
      <div>
        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-3 border-b pb-2">
          Utgiftskategorier
        </h3>
        {expenseCategories.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Inga utgiftskategorier skapade.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex justify-between items-center p-3 rounded bg-red-50 dark:bg-red-900/10"
              >
                <span className="font-medium">{category.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    Redigera
                  </button>
                  <button
                    onClick={() => setDeletingCategory(category)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit category */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Redigera kategori
                </h3>
                <button
                  onClick={() => setEditingCategory(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  &times;
                </button>
              </div>
              <CategoryForm
                category={editingCategory}
                onSubmit={(data) => onUpdate(editingCategory.id, data)}
                onSuccess={handleCategoryUpdated}
                onCancel={() => setEditingCategory(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Bekräfta borttagning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Är du säker på att du vill ta bort kategorin "{deletingCategory.name}"? Detta kan
                inte ångras.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteCategory}
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
