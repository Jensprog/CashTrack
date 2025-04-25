/**
 * Dashboard page component.
 *
 * This server component handles authentication checks and renders the dashboard
 * content for authenticated users only.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import Dashboard from '@/components/dashboard/Dashboard';

export const metadata = {
    title: "Dashboard - CashTrack",
    description: "Hantera din ekonomi med CashTrack",
};

/**
 * This page is marked as dynamic to ensure that cookies are read correctly.
 * The `dynamic` export is set to 'force-dynamic' to ensure that the page
 * is always rendered on the server.
 */
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get('token');

        if (!tokenCookie) {
            redirect("/login");
        }

        const decoded = verifyToken(tokenCookie.value);
        if (!decoded) {
            redirect("/login");
        }

        // User is authenticated, render the dashboard content
        return <Dashboard />;
    } catch (error) {
        console.error('Authentication error:', error);
        redirect("/login");
    }
}