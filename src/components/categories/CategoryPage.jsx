/**
 * Client component for the category page.
 *
 * This component contains a form to create and handle categories.
 */
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axiosConfig';
import CategoryForm from '@/components/categories/CategoryForm';
import CategoryList from '@/components/categories/CategoryList';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hasDefaultCategories, setHasDefaultCategories] = useState(false);

  // Fetch categories when page is rendered
  useEffect(() => {
    fetchCategories();
  }, []);

  // Check if the standard categories already exists
  useEffect(() => {
    const defaultCategoryNames = [
      'Lön',
      'Bidrag',
      'Gåvor',
      'Återbetalning',
      'Övrigt',
      'Hyra/Boende',
      'Mat och hushåll',
      'Transport',
      'Nöje',
      'Räkningar',
      'Hälsa',
      'Kläder',
      'Övrigt',
    ];

    // Check if the user have the standard categories
    const hasDefaults = defaultCategoryNames.some((defaultName) =>
      categories.some((category) => category.name === defaultName && category.userId !== null),
    );

    setHasDefaultCategories(hasDefaults);
  }, [categories]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data.data.categories);
      setError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Kunde inte hämta kategorier. Försök igen senare.');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      setCategories([...categories, response.data.data.category]);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const response = await api.put('/categories', {
        id,
        ...categoryData,
      });

      setCategories(
        categories.map((category) => (category.id === id ? response.data.data.category : category)),
      );

      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories?id=${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const createDefaultCategories = async () => {
    try {
      setLoading(true);
      const response = await api.post('/categories/defaults');
      await fetchCategories();
      return response.data;
    } catch (error) {
      console.error('Error creating default categories:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mina Kategorier!</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category form (left column) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Lägg till kategori
                </h2>
                <button
                  className="text-sm text-blue-600 dark:text-blue-400 lg:hidden"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? 'Dölj' : 'Visa'}
                </button>
              </div>

              <div className={`${showAddForm ? 'block' : 'hidden lg:block'}`}>
                <CategoryForm onSubmit={addCategory} />
              </div>
            </div>

            {/* Default categories */}
            {!hasDefaultCategories && (
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Standardkategorier
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Skapa ett set med standardkategorier för att snabbt komma igång.
                </p>
                <button
                  onClick={createDefaultCategories}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors w-full"
                  disabled={loading}
                >
                  {loading ? 'Skapar...' : 'Skapa standardkategorier'}
                </button>
              </div>
            )}
          </div>

          {/* Category list (right column) */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Kategorier
              </h2>
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded">
                  {error}
                </div>
              )}
              <CategoryList
                categories={categories}
                loading={loading}
                onUpdate={updateCategory}
                onDelete={deleteCategory}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
