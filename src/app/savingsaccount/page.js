/**
 * @file Savings accounts page component.
 *
 * This server component handles authentication checks and renders the savings accounts
 * content for authenticated users only.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import SavingsAccountPage from '@/components/savingsaccount/SavingsAccountPage';

export const metadata = {
  title: 'Sparkonton - CashTrack',
  description: 'Hantera dina sparkonton',
};

export const dynamic = 'force-dynamic';

export default async function SavingsAccountsPageRoute() {
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

    return <SavingsAccountPage />;
  } catch (error) {
    console.error('Authentication error:', error);
    redirect('/login');
  }
}
