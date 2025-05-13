/**
 * This component is responsible to display a date range filter.
 *
 * Can be reused in other components so users can choose a custom date range
 * to get an overview of their incomes and expenses.
 */
'use client';

import { useState, useEffect } from 'react';

export default function DateRangeFilter({
  initialFilters = {},
  onFilterChange,
  onFilterApply,
  onFilterReset,
  includeCategory = false,
  categories = [],
  compact = false,
}) {
  const [filters, setFilters] = useState({
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    categoryId: initialFilters.categoryId || '',
  });

  // Update filters when initialFilters changes
  useEffect(() => {
    setFilters({
      startDate: initialFilters.startDate || filters.startDate || '',
      endDate: initialFilters.endDate || filters.endDate || '',
      categoryId: initialFilters.categoryId || filters.categoryId || '',
    });
  }, [initialFilters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);

    // Inform the parent component about the filter change
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleApplyFilters = (event) => {
    event.preventDefault();
    if (onFilterApply) {
      onFilterApply(filters);
    }
  };

  const handleResetFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      categoryId: '',
    };

    setFilters(resetFilters);

    if (onFilterReset) {
      onFilterReset(resetFilters);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 shadow-md rounded p-${compact ? '3' : '4'}`}>
      <h3
        className={`text-${compact ? 'md' : 'lg'} font-semibold mb-${compact ? '2' : '3'} text-gray-800 dark:text-white`}
      >
        Filtrera efter datum
      </h3>

      <form onSubmit={handleApplyFilters} className="space-y-4">
        <div
          className={`grid grid-cols-1 ${includeCategory ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}
        >
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
              value={filters.startDate}
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
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          {/* Category */}
          {includeCategory && (
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
                value={filters.categoryId}
                onChange={handleFilterChange}
              >
                <option value="">Alla kategorier</option>

                {/* Group and sort categories */}
                <optgroup label="Inkomster">
                  {categories
                    .filter((cat) => cat.isIncome)
                    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>

                <optgroup label="Sparande">
                  {categories
                    .filter((cat) => !cat.isIncome && cat.isSaving)
                    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>

                <optgroup label="Utgifter">
                  {categories
                    .filter((cat) => !cat.isIncome && !cat.isSaving)
                    .sort((a, b) => a.name.localeCompare(b.name, 'sv'))
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          )}
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
  );
}
