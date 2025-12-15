// src/app/page.js
import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function LandingPage() {
  // 1. Get the session from the server
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <span className="text-xl font-bold text-gray-900">JobTracker</span>
          </div>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                {/* Sign Out Form (Server Action) */}
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button
                    type="submit"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Track your job search <br className="hidden sm:block" />
          <span className="text-blue-600">without the chaos.</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          Stop using spreadsheets. Organize your applications, track interview
          statuses, and land your next role faster with our simple, dedicated
          tracker.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/about" // Example secondary link
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-200 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 md:text-lg"
              >
                Learn more
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} JobTracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
