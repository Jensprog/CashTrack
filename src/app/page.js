import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                CashTrack
              </span>
            </div>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col md:flex-row items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="md:w-1/2 md:pr-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Få kontroll över din <span className="text-blue-600 dark:text-blue-400">ekonomi</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            CashTrack hjälper dig hålla koll på dina inkomster och utgifter mellan de datum som passar dig. Få bättre översikt och ta kontrollen över din ekonomi.
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
              Läs mer
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-auto">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">Månadsöversikt</h3>
              <div className="mt-3 h-32 bg-blue-100 dark:bg-blue-800/30 rounded-md flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400">Graf över ekonomi</span>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Flexibla datum</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Välj själv vilka datum du vill se din ekonomi mellan, oavsett om det är lön till lön eller en specifik period.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Smart kategorisering</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kategorisera dina inkomster och utgifter för att tydligt se var pengarna kommer ifrån och vad de går till.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Tydliga översikter</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Få detaljerade vecko- och månadsöversikter som gör det enkelt att förstå dina ekonomiska mönster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ta kontrollen över din ekonomi idag
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Med CashTrack får du de verktyg du behöver för att få bättre koll på dina pengar, göra smartare ekonomiska val och uppnå dina finansiella mål.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md text-lg font-medium transition-colors"
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
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                CashTrack
              </span>
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