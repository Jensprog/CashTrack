/**
 * The page that renders the SpendingChart-component.
 */
'use client';

import { TransactionProvider } from '@/context/TransactionContext';
import SpendingChart from '@/components/spendingchart/SpendingChart';

export default function SpendingChartPage() {
  return (
    <TransactionProvider>
      <SpendingChart />
    </TransactionProvider>
  );
}
