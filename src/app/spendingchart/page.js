/**
 * @file The page that renders the SpendingChart-component.
 */
'use client';

import { TransactionProvider } from '@/context/TransactionContext';
import SpendingChart from '@/components/spendingchart/SpendingChart';
import Footer from '@/components/layout/Footer';

export default function SpendingChartPage() {
  return (
    <TransactionProvider>
      <SpendingChart />
      <Footer />
    </TransactionProvider>
  );
}
