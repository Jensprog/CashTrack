/**
 * This components responsibility is to render a pie chart for the user,
 * displaying the most common expenses in either percentage or SEK.
 * Using the DateRangeFilter UI-component to be able to select a specific period.
 */
'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '@/context/TransactionContext';
import DateRangeFilter from '@/components/ui/DateRangeFilter';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function SpendingChart() {
  const { transactions, customFilters, setCustomFilters, fetchTransactions } = useTransactions();
  const [chartData, setChartData] = useState([]);
  const [displayMode, setDisplayMode] = useState('amount');
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const expensesByCategory = {};
    let total = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount < 0 && transaction.category) {
        const categoryName = transaction.category.name;
        const amount = Math.abs(transaction.amount);

        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = 0;
        }
        expensesByCategory[categoryName] += amount;
        total += amount;
      }
    });

    // Convert to an array for the chart
    const data = Object.keys(expensesByCategory).map((category) => ({
      name: category,
      value: expensesByCategory[category],
      percent: (expensesByCategory[category] / total) * 100,
    }));

    data.sort((a, b) => b.value - a.value);

    setChartData(data);
    setTotalExpenses(total);
  }, [transactions, customFilters]);

  const handleFilterApply = (newFilters) => {
    setCustomFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      categoryId: '',
    };
    setCustomFilters(resetFilters);
    fetchTransactions(resetFilters);
  };

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82ca9d',
    '#8dd1e1',
    '#a4de6c',
    '#d0ed57',
    '#ffc658',
  ];

  const formatValue = (value) => {
    if (displayMode === 'amount') {
      return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
      }).format(value);
    } else {
      return `${value.toFixed(1)}%`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Budgetanalys</h1>

        {/* Filter */}
        <div className="mb-6">
          <DateRangeFilter
            initialFilters={customFilters}
            onFilterApply={handleFilterApply}
            onFilterReset={handleFilterReset}
          />
        </div>

        {/* Display Mode Toggle */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Utgifter per kategori
            </h2>
            <div className="flex space-x-1 rounded-md bg-gray-100 dark:bg-gray-800 p-1">
              <button
                onClick={() => setDisplayMode('amount')}
                className={`py-1 px-3 text-sm font-medium rounded-md transition-colors ${
                  displayMode === 'amount'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Belopp
              </button>
              <button
                onClick={() => setDisplayMode('percent')}
                className={`py-1 px-3 text-sm font-medium rounded-md transition-colors ${
                  displayMode === 'percent'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Procent
              </button>
            </div>
          </div>

          <div className="h-96">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={140}
                    fill="#8884d8"
                    dataKey={displayMode === 'amount' ? 'value' : 'percent'}
                    label={({ name, index }) => {
                      const entry = chartData[index];
                      const displayValue = displayMode === 'amount' ? entry.value : entry.percent;
                      return `${name}: ${formatValue(displayValue)}`;
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatValue(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Ingen utgiftsdata tillgänglig</p>
              </div>
            )}
          </div>

          {chartData.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                Utgiftsdetaljer
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Totala utgifter:</p>
                    <p className="text-lg font-semibold">
                      {new Intl.NumberFormat('sv-SE', {
                        style: 'currency',
                        currency: 'SEK',
                      }).format(totalExpenses)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Största utgiftskategori:
                    </p>
                    <p className="text-lg font-semibold">
                      {chartData[0]?.name} (
                      {formatValue(
                        displayMode === 'amount' ? chartData[0]?.value : chartData[0]?.percent,
                      )}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Table */}
        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Utgifter per kategori
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Kategori
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Belopp
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Procent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {chartData.map((category, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></span>
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                        {new Intl.NumberFormat('sv-SE', {
                          style: 'currency',
                          currency: 'SEK',
                        }).format(category.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                        {category.percent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="row"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Totalt
                    </th>
                    <td className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
                      {new Intl.NumberFormat('sv-SE', {
                        style: 'currency',
                        currency: 'SEK',
                      }).format(totalExpenses)}
                    </td>
                    <td className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpendingChart;
