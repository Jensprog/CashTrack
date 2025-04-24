/**
 * The FinancialOverview component displays summary information
 * about the user's financial transactions.
 */
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axiosConfig";

export default function FinancialOverview() {
    // State for financial data
    const [data, setData] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
        weekly: {
            balance: 0,
            income: 0,
            expenses: 0
        },
        monthly: {
            balance: 0,
            income: 0,
            expenses: 0
        }
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(true);

    // Error state
    const [error, setError] = useState('');

    // Period selection
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    // Fetch financial data on component mount and when period changes
    useEffect(() => {
        fetchFinancialData();
    }, [selectedPeriod]);

    // Fetch financial data from transactions
    const fetchFinancialData = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Calculate date ranges
            const now = new Date();

            // Weekly range (last 7 days)
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 7);
            const weekStartISO = weekStart.toISOString().split('T')[0];

            // Monthly range (last 30 days)
            const monthStart = new Date(now);
            monthStart.setDate(now.getDate() - 30);
            const monthStartISO = monthStart.toISOString().split('T')[0];

            // Current date as ISO string
            const nowISO = now.toISOString().split('T')[0];

            // Fetch transactions based on selected period
            let queryParams = new URLSearchParams();

            if (selectedPeriod === 'week') {
                queryParams.append('startDate', weekStartISO);
                queryParams.append('endDate', nowISO);
            } else if (selectedPeriod === 'month') {
                queryParams.append('startDate', monthStartISO);
                queryParams.append('endDate', nowISO);
            }

            const response = await api.get(`/transactions?${queryParams.toString()}`);
            const transactions = response.data.data.transactions;

            // Calculate financial metrics
            calculateFinancialData(transactions);
        } catch (error) {
            console.error('Error fetching financial data:', error);
            setError('Kunde inte hämta ekonomisk data. Försök igen senare.');
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate financial metrics from transactions
    const calculateFinancialData = (transactions) => {
        const now = new Date();

        // Calculate week and month start dates
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);

        const monthStart = new Date(now);
        monthStart.setDate(now.getDate() - 30);

        // Initialize counters
        let totalIncome = 0;
        let totalExpenses = 0;
        let weeklyIncome = 0;
        let weeklyExpenses = 0;
        let monthlyIncome = 0;
        let monthlyExpenses = 0;

        // Process transactions
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);
            const amount = transaction.amount;

            // Total calculations
            if (amount > 0) {
                totalIncome += amount;
            } else {
                totalExpenses += Math.abs(amount);
            }

            // Weekly calculations
            if (transactionDate >= weekStart) {
                if (amount > 0) {
                    weeklyIncome += amount;
                } else {
                    weeklyExpenses += Math.abs(amount);
                }
            }

            // Monthly calculations
            if (transactionDate >= monthStart) {
                if (amount > 0) {
                    monthlyIncome += amount;
                } else {
                    monthlyExpenses += Math.abs(amount);
                }
            }
        });

        // Update state with calculated values
        setData({
            balance: totalIncome - totalExpenses,
            income: totalIncome,
            expenses: totalExpenses,
            weekly: {
                balance: weeklyIncome - weeklyExpenses,
                income: weeklyIncome,
                expenses: weeklyExpenses
            },
            monthly: {
                balance: monthlyIncome - monthlyExpenses,
                income: monthlyIncome,
                expenses: monthlyExpenses
            }
        });
    };

    // Format amount with separator and currency
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Get display data based on selected period
    const getDisplayData = () => {
        switch (selectedPeriod) {
            case 'week':
                return {
                    balance: data.weekly.balance,
                    income: data.weekly.income,
                    expenses: data.weekly.expenses,
                    label: 'Senaste veckan'
                };
            case 'month':
                return {
                    balance: data.monthly.balance,
                    income: data.monthly.income,
                    expenses: data.monthly.expenses,
                    label: 'Sensate månaden'
                };
            default:
                return {
                    balance: data.balance,
                    income: data.income,
                    expenses: data.expenses,
                    label: 'Alla transaktioner'
                };
        }
    };

    // Get the current display data
    const displayData = getDisplayData();

    return (
        <div>
            {/* Period selector */}
            <div className="mb-4">
                <div className="flex space-x-1 rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                    <button
                        onClick={() => setSelectedPeriod('all')}
                        className={`flex-1 py-1 px-3 text-sm font-medium rounded-md transition-colors ${selectedPeriod === 'all'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Alla
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('month')}
                        className={`flex-1 py-1 px-3 text-sm font-medium rounded-md transition-colors ${selectedPeriod === 'month'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Månad
                    </button>
                    <button
                        onClick={() => setSelectedPeriod('week')}
                        className={`flex-1 py-1 px-3 text-sm font-medium rounded-md transition-colors ${selectedPeriod === 'week'
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Vecka
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded text-sm">
                    {error}
                </div>
            )}

            {/* Financial overview */}
            {isLoading ? (
                <div className="text-center py-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Laddar ekonomisk data...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                            Balans ({displayData.label})
                        </h3>
                        <p className={`text-2xl font-semibold ${displayData.balance >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                            {formatAmount(displayData.balance)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                                Inkomster
                            </h3>
                            <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                                {formatAmount(displayData.income)}
                            </p>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                                Utgifter
                            </h3>
                            <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                                {formatAmount(displayData.expenses)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}