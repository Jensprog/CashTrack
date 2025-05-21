'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-grow flex flex-col md:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="md:w-1/2 md:pr-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Ta kontroll över din <span className="text-blue-600 dark:text-blue-400">ekonomi</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            CashTrack hjälper dig hålla koll på dina inkomster och utgifter med flexibla datumperioder. 
            Se din ekonomi lön-till-lön, veckovis eller med egna tidsintervall.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium transition-colors flex justify-center items-center"
            >
              Kom igång gratis
            </Link>
            <Link
              href="/login"
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-md text-base font-medium transition-colors flex justify-center items-center"
            >
              Logga in
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-auto">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">
                Budgetöversikt
              </h3>
              <div className="mt-3 h-48 bg-blue-100 dark:bg-blue-800/30 rounded-md flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full p-2">
                  {/* Mock Pie Chart */}
                  <circle cx="100" cy="100" r="80" fill="#60a5fa" />
                  <circle cx="100" cy="100" r="40" fill="#f87171" />
                  <path d="M 100 100 L 100 20 A 80 80 0 0 1 159 65 Z" fill="#34d399" />
                  <path d="M 100 100 L 159 65 A 80 80 0 0 1 145 141 Z" fill="#fbbf24" />
                  <text x="230" y="50" fill="currentColor" fontSize="14">Mat: 32%</text>
                  <text x="230" y="80" fill="currentColor" fontSize="14">Hyra: 40%</text>
                  <text x="230" y="110" fill="currentColor" fontSize="14">Nöje: 15%</text>
                  <text x="230" y="140" fill="currentColor" fontSize="14">Transport: 13%</text>
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <span className="font-medium">Lön</span>
                <span className="text-green-600 dark:text-green-400">+25 000 kr</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <span className="font-medium">Hyra</span>
                <span className="text-red-600 dark:text-red-400">-8 500 kr</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <span className="font-medium">Matvaror</span>
                <span className="text-red-600 dark:text-red-400">-3 200 kr</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Funktioner som gör skillnad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Flexibla datum
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Välj själv vilka datum du vill se din ekonomi mellan, oavsett om det är lön till lön
                eller en specifik period.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Smart kategorisering
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kategorisera dina inkomster och utgifter för att tydligt se var pengarna kommer
                ifrån och vad de går till.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Budgetanalys
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualisera dina utgifter i tydliga diagram och se exakt hur dina pengar fördelas 
                mellan olika kategorier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Se hur CashTrack fungerar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dashboard Screenshot */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="p-1">
                <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded-t-lg flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Dashboard</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Balans</h4>
                      <p className="text-xl font-semibold text-green-600 dark:text-green-400">13 300 kr</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Inkomster</h4>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">25 000 kr</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Utgifter</h4>
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">11 700 kr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  Få en tydlig översikt över din ekonomi
                </p>
              </div>
            </div>
            
            {/* Budget Analysis Screenshot */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="p-1">
                <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded-t-lg flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Budgetanalys</h3>
                  <div className="h-48 flex items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Simplified pie chart */}
                      <circle cx="100" cy="100" r="80" fill="#e0e0e0" />
                      <path d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z" fill="#60a5fa" />
                      <path d="M 100 100 L 180 100 A 80 80 0 0 1 100 180 Z" fill="#f87171" />
                      <path d="M 100 100 L 100 180 A 80 80 0 0 1 20 100 Z" fill="#34d399" />
                      <path d="M 100 100 L 20 100 A 80 80 0 0 1 100 20 Z" fill="#fbbf24" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  Se dina utgifter fördelade per kategori
                </p>
              </div>
            </div>
            
            {/* Transactions Screenshot */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
              <div className="p-1">
                <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded-t-lg flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Transaktioner</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <div>
                        <div className="font-medium">Lön</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">2025-04-25</div>
                      </div>
                      <div className="font-medium text-green-600 dark:text-green-400">+25 000 kr</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <div>
                        <div className="font-medium">Hyra</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">2025-04-30</div>
                      </div>
                      <div className="font-medium text-red-600 dark:text-red-400">-8 500 kr</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                      <div>
                        <div className="font-medium">Matvaror</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">2025-05-03</div>
                      </div>
                      <div className="font-medium text-red-600 dark:text-red-400">-1 200 kr</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  Hantera alla dina transaktioner på ett ställe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ta kontrollen över din ekonomi idag
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Med CashTrack får du de verktyg du behöver för att få bättre koll på dina pengar, göra
            smartare ekonomiska val och uppnå dina finansiella mål.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-md text-lg font-medium transition-colors"
          >
            Skapa ditt konto nu
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CashTrack</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} CashTrack. Alla rättigheter förbehållna.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
