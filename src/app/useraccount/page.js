/**
 * @file Renders the UserAccount component.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import UserAccount from '@/components/auth/UserAccount';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Mitt Konto - CashTrack',
  description: 'Hantera ditt CashTrack-konto',
};

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
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
        <UserAccount />
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Authentication error:', error);
    redirect('/login');
  }
}
