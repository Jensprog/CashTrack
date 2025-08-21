/**
 * @file CategoryForm component is a form to add and edit categories.
 */
'use client';

import { useState, useEffect } from 'react';

export default function CategoryForm({
  category = null,
  onSubmit,
  onSuccess = () => {},
  onCancel = () => {},
}) {
  const initialFormState = {
    name: category ? category.name : '',
    isIncome: category ? category.isIncome : false,
  };

  const [formData, setFormData] = useState(initialFormState);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        isIncome: category.isIncome,
      });
    }
  }, [category]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleCategoryTypeChange = (typeId) => {
    if (typeId === 'income') {
      setFormData({
        ...formData,
        isIncome: true,
      });
    } else {
      setFormData({
        ...formData,
        isIncome: false,
      });
    }
  };

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
        isIncome: formData.isIncome,
      };

      if (!data.name) {
        throw new Error('Kategorinamn krävs');
      }

      const response = await onSubmit(data);

      if (category) {
        setSuccessMessage('Kategorin har uppdaterats!');
      } else {
        setSuccessMessage('Kategorin har skapats!');
        // Reset form for a new category
        setFormData({
          name: '',
          isIncome: false,
        });
      }

      onSuccess(response?.data?.category);
    } catch (error) {
      console.error('Category error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(error.message || 'Ett fel inträffade. Försök igen senare.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryType = () => {
    if (formData.isIncome) return 'income';
    return 'expense';
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
        {/* Category type */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Kategorityp
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleCategoryTypeChange('income')}
              className={`py-2 px-3 rounded-md flex items-center justify-center ${
                getCategoryType() === 'income'
                  ? 'bg-green-100 border border-green-500 dark:bg-green-900/20 dark:border-green-700'
                  : 'bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Inkomst
            </button>

            <button
              type="button"
              onClick={() => handleCategoryTypeChange('expense')}
              className={`py-2 px-3 rounded-md flex items-center justify-center ${
                getCategoryType() === 'expense'
                  ? 'bg-red-100 border border-red-500 dark:bg-red-900/20 dark:border-red-700'
                  : 'bg-gray-100 border border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
            >
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Utgift
            </button>
          </div>
        </div>

        {/* Category name */}
        <div className="mb-6">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Kategorinamn *
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder={`T.ex. ${getCategoryType() === 'income' ? 'Lön, Bidrag' : 'Mat, Hyra'}`}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          {category && (
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
              category ? '' : 'w-full'
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? category
                ? 'Uppdaterar...'
                : 'Sparar...'
              : category
                ? 'Uppdatera'
                : 'Skapa kategori'}
          </button>
        </div>
      </form>
    </div>
  );
}
