/**
 * @file Categories page component.
 *
 * This server component handles authentication checks and renders the categories
 * content for authenticated users only.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import CategoryPage from '@/components/categories/CategoryPage';

export const metadata = {
  title: 'Kategorier - CashTrack',
  description: 'Hantera dina transaktionskategorier i CashTrack',
};

// Page is marked as dynamic to ensure correct reading of cookies.
export const dynamic = 'force-dynamic';

export default async function CategoriesPageRoute() {
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

    return <CategoryPage />;
  } catch (error) {
    console.error('Authentication error:', error);
    redirect('/login');
  }
}
