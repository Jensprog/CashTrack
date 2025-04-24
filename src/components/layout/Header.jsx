/**
 * The Header component displays the navigation bar at the top of the application.
 * It dynamincally shows different links based on authentication status. 
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Header() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const router = useRouter();

    // Check if the user is logged in on component mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Check the authentication status
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/api/auth/status');
            setUser(response.data.data.user);
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo and brand name */}
              <div className="flex items-center">
                <Link 
                  href="/" 
                  className="flex-shrink-0 flex items-center"
                >
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    CashTrack
                  </span>
                </Link>
              </div>
              
              {/* Desktop navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                {!isLoading && (
                  user ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <div className="ml-3 relative">
                        <div>
                          <button
                            onClick={handleLogout}
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                          >
                            Logga ut
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Logga in
                      </Link>
                      <Link 
                        href="/register" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Skapa konto
                      </Link>
                    </>
                  )
                )}
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-expanded="false"
                >
                  <span className="sr-only">Öppna huvudmeny</span>
                  {/* Icon when menu is closed */}
                  <svg
                    className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {/* Icon when menu is open */}
                  <svg
                    className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile menu, show/hide based on menu state */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
              <div className="pt-2 pb-3 space-y-1">
                {!isLoading && (
                  user ? (
                    <>
                      <Link 
                        href="/dashboard"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                      >
                        Logga ut
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
                      >
                        Logga in
                      </Link>
                      <Link 
                        href="/register"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
                      >
                        Skapa konto
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        </header>
      );
}