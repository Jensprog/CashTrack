/**
 * Transaction Context Provider.
 *
 * This context provides transaction state and functions across the application
 * for communication between transaction-related components.
 */
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/axiosConfig';

// Create context
const TransactionContext = createContext(null);

// Custom hook for using the TransactionContext
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [customFilters, setCustomFilters] = useState({
    startDate: '',
    endDate: '',
    categoryId: '',
  });

  const [financialData, setFinancialData] = useState({
    balance: 0,
    income: 0,
    savings: 0,
    expenses: 0,
    weekly: { balance: 0, income: 0, savings: 0, expenses: 0 },
    monthly: { balance: 0, income: 0, savings: 0, expenses: 0 },
  });

  // Calculate financial data from transactions
  const calculateFinancialData = useCallback((transactions) => {
    // Actual date for time period calculations
    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 30);

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    // Total balance from all transactions
    let totalBalance = 0;
    let totalIncome = 0;
    let totalSavings = 0;
    let totalExpenses = 0;

    // Weekly and monthly data
    let weeklyIncome = 0;
    let weeklyExpenses = 0;
    let weeklySavings = 0;
    let monthlySavings = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    // Calculate transactions
    sortedTransactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const amount = transaction.amount;

      // Update total balance for all transactions
      totalBalance += amount;

      // Total income and expenses
      if (amount > 0) {
        totalIncome += amount;
      } else if (transaction.category?.isSaving) {
        totalSavings += Math.abs(amount);
      } else {
        totalExpenses += Math.abs(amount);
      }

      // Weekly income and expenses
      if (transactionDate >= weekStart) {
        if (amount > 0) {
          weeklyIncome += amount;
        } else if (transaction.category?.isSaving) {
          weeklySavings += Math.abs(amount);
        } else {
          weeklyExpenses += Math.abs(amount);
        }
      }

      // Monthly income and expenses
      if (transactionDate >= monthStart) {
        if (amount > 0) {
          monthlyIncome += amount;
        } else if (transaction.category?.isSaving) {
          monthlySavings += Math.abs(amount);
        } else {
          monthlyExpenses += Math.abs(amount);
        }
      }
    });

    // Update state with calculated data
    setFinancialData({
      // Total for all transactions
      balance: totalBalance,
      income: totalIncome,
      savings: totalSavings,
      expenses: totalExpenses,

      // Weekly data
      weekly: {
        balance: totalBalance,
        income: weeklyIncome,
        savings: weeklySavings,
        expenses: weeklyExpenses,
      },

      // Monthly data
      monthly: {
        balance: totalBalance,
        income: monthlyIncome,
        savings: monthlySavings,
        expenses: monthlyExpenses,
      },
    });
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (newFilters = null) => {
      setLoading(true);
      setError(null);

      try {
        // Use new filters if provided otherwise use existing filters
        const currentFilters = newFilters || filters;

        // Update the filter state
        if (newFilters) {
          setFilters(newFilters);
        }

        const queryParams = new URLSearchParams();
        if (currentFilters.startDate) queryParams.append('startDate', currentFilters.startDate);
        if (currentFilters.endDate) queryParams.append('endDate', currentFilters.endDate);
        if (currentFilters.categoryId) queryParams.append('categoryId', currentFilters.categoryId);

        const response = await api.get(`/transactions?${queryParams.toString()}`);
        setTransactions(response.data.data.transactions);

        // If custom filters are provided, update their state
        if (newFilters && newFilters !== filters) {
          setCustomFilters(newFilters);
        }

        // Calculate financial data
        calculateFinancialData(response.data.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Kunde inte hämta transaktioner. Försök igen senare.');
      } finally {
        setLoading(false);
      }
    },
    [filters, calculateFinancialData],
  );

  // Create transaction
  const createTransaction = useCallback(
    async (transactionData) => {
      try {
        const response = await api.post('/transactions', transactionData);
        // Update trancation list and financial data
        await fetchTransactions();
        return response.data;
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
    },
    [fetchTransactions],
  );

  // Update transaction
  const updateTransaction = useCallback(
    async (id, transactionData) => {
      try {
        const response = await api.put('/transactions', {
          id,
          ...transactionData,
        });
        // Update transaction list and financial data
        await fetchTransactions();
        return response.data;
      } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
      }
    },
    [fetchTransactions],
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    async (id) => {
      try {
        await api.delete(`/transactions?id=${id}`);
        // Update transaction list and financial data
        await fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
      }
    },
    [fetchTransactions],
  );

  // Fetch transactions on initial render
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Context value to provide for components
  const value = {
    transactions,
    loading,
    error,
    financialData,
    filters,
    customFilters,
    setCustomFilters,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};
