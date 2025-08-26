/**
 * @file Footer component for the application.
 */

export default function Footer() {

    return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">CashTrack</span>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-2">
              <span className="text-blue-600 dark:text-blue-400 w-24 text-center md:text-left font-bold">
                Kundtjänst
              </span>
              <a
                href="mailto:support@cashtrack.se?subject=&body="
                className="text-gray-600 dark:text-gray-400 w-24 text-center md:text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Kontakta oss
              </a>
            </div>

            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} CashTrack. Alla rättigheter förbehållna.
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
}