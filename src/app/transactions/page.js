/**
 * @file Transactions page component.
 *
 * This pages handles all transaction management functionality including
 * adding, editing, deleting and listing transactions.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import TransactionPage from '@/components/transactions/TransactionPage';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Transaktioner - CashTrack',
  description: 'Hantera dina transaktioner med CashTrack',
};

export const dynamic = 'force-dynamic';

export default async function TransactionsPageRoute() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie) {
      redirect('/login');
    }

    const decoded = verifyToken(tokenCookie.value);
    if (!decoded) {
      redirect('/login');
    }

    return (
      <>
        <TransactionPage />
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Authentication error:', error);
    redirect('/login');
  }
}
