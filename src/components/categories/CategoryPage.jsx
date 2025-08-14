/**
 * @file Client component for the category page.
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

  // Fetch categories when page is rendered
  useEffect(() => {
    fetchCategories();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mina Kategorier</h1>

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

            {/* Information om kategorier */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Om kategorier
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Kategorier hjälper dig att organisera dina inkomster och utgifter. Du kan skapa egna
                kategorier för att anpassa efter dina behov.
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-2">
                <li>Inkomstkategorier används för pengar du får in (gröna)</li>
                <li>Utgiftskategorier används för pengar du spenderar (röda)</li>
                <li>Du kan lägga till, redigera och ta bort kategorier när som helst</li>
              </ul>
            </div>
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
