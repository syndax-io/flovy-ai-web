"use client";

import ProtectedRoute from "../components/app/ProtectedRoute";
import SessionPresetSelector from "../components/app/SessionPresetSelector";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/web/Logo";
import Image from "next/image";

export default function Dashboard() {
  const { user, logout, timeRemaining } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Logo className="w-8 h-8 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  flovy.ai Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center space-x-3">
                    {/* Session Timeout Warning */}
                    {timeRemaining > 0 && timeRemaining <= 5 && (
                      <div className="bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                        <span className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                          Session expires in {timeRemaining} min
                        </span>
                      </div>
                    )}

                    {user.photoURL && (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

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

            {/* Session Info */}
            {timeRemaining > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Session active for {timeRemaining} more minutes. Any activity
                  will extend your session.
                </p>
              </div>
            )}

            {/* Session Preset Selector */}
            <SessionPresetSelector />

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
