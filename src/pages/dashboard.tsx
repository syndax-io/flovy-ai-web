"use client";

import ProtectedRoute from "../components/app/ProtectedRoute";
import Navbar from "../components/app/Navbar";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to your Dashboard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This is where your AI-powered productivity journey begins. Your
              personalized dashboard is coming soon!
            </p>

            {/* Placeholder content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Daily Focus
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  AI-powered suggestions for what to focus on today
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Habit Tracking
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Monitor your progress and build better habits
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Smart Insights
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  Get intelligent insights about your productivity patterns
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
