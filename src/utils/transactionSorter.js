/**
 * Utility functions for transaction handling.
 * Sorts transactions based on specified key and direciton.
 * Default sorting is by date (newest first) and then by createdAT (newest first).
 */
export const sortTransactions = (
    transactions,
    key = 'date',
    direction = 'descending'
) => {
    return [...transactions].sort((a, b) => {
        if (key === 'date') {
           // Sort by date first
           const dateA = new Date(a.date);
           const dateB = new Date(b.date);
           const dateComparison = dateA.getTime() - dateB.getTime();
           
           // If the dates are the same, sort by createdAt
           if (dateComparison === 0) {
            const createdAtA = new Date(a.createdAt);
            const createdAtB = new Date(b.createdAt);
            return direction === 'ascending'
            ? createdAtA.getTime() - createdAtB.getTime()
            : createdAtB.getTime() - createdAtA.getTime();
           }

           return direction === 'ascending' ? dateComparison : -dateComparison;
        }

        // Handle special cases for amount (numerical order)
        if (key === 'amount') {
            return direction === 'ascending' ? a.amount - b.amount : b.amount - a.amount;
        }

        // Handle strings and other fields
        if (typeof a[key] === 'string') {
            const stringComparison = a[key].localeCompare(b[key]);
            return direction === 'ascending' ? stringComparison : -stringComparison;
        }

        // Fallback for other types
        if (a[key] < b[key]) {
            return direction === 'ascending' ? -1 : 1;
        }

        if (a[key] > b[key]) {
            return direction === 'ascending' ? 1 : -1;
        }

        // Secondary sort by date and createdAt if the primary key is equal
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison === 0) {
            return direction === 'ascending'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return dateComparison;
    });
};

export const getLatestTransactions = (transactions, count = 5) => {
    return sortTransactions(transactions).slice(0, count);
}