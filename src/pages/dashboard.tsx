"use client";

import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import GoogleCalendarIntegration from "../components/GoogleCalendarIntegration";
import AIChatCard from "../components/AIChatCard";
import NotesCard from "../components/NotesCard";

import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Productivity Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered insights to help you work smarter and achieve more
              </p>
            </div>

            {/* AI Chat Assistant */}
            <div className="mb-8">
              <AIChatCard userName={user?.displayName || "User"} />
            </div>

            {/* Google Calendar Integration */}
            <div className="mb-8">
              <GoogleCalendarIntegration />
            </div>

            {/* Notes & Goals Card */}
            <div className="mb-8">
              <NotesCard />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
