"use client";

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Modal from "../components/Modal";
import GoogleCalendarIntegration from "../components/GoogleCalendarIntegration";
import AISuggestions from "../components/AISuggestions";
import NotesCard from "../components/NotesCard";

import { useAuth } from "../contexts/AuthContext";
import { CardData, cardData } from "../data/dashboardData";

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotesCard, setShowNotesCard] = useState(false);

  const handleCardClick = (card: CardData) => {
    if (card.id === "notes-goals") {
      setShowNotesCard(true);
    } else {
      setSelectedCard(card);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleCloseNotesCard = () => {
    setShowNotesCard(false);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      case "stable":
        return "→";
    }
  };

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

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  85%
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Focus Score
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                  6.8h
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Productive Time
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  73%
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Goal Progress
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  12
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Tasks Completed
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <AISuggestions
              cardData={cardData}
              userName={user?.displayName || "User"}
            />

            {/* Google Calendar Integration */}
            <div className="mb-8">
              <GoogleCalendarIntegration />
            </div>

            {/* Notes & Goals Card */}
            {showNotesCard && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notes & Goals Management
                  </h3>
                  <button
                    onClick={handleCloseNotesCard}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
                <NotesCard />
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardData.map((card) => (
                <Card
                  key={card.id}
                  variant={card.variant}
                  title={card.title}
                  description={card.description}
                  onClick={() => handleCardClick(card)}
                  clickable={true}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {card.summary.mainMetric}
                      </span>
                      <span className="text-2xl">
                        {getTrendIcon(card.summary.trend)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {card.summary.subMetrics.map((metric, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-400"
                        >
                          • {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedCard?.title || ""}
          variant={selectedCard?.variant}
        >
          {selectedCard && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {selectedCard.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedCard.summary.mainMetric}
                    </span>
                    <span className="text-2xl">
                      {getTrendIcon(selectedCard.summary.trend)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Key Metrics:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCard.detailedData.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {metric.label}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {metric.value}
                        </span>
                      </div>
                      {metric.change && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {metric.change}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Recommendations:
                </h3>
                <ul className="space-y-2">
                  {selectedCard.detailedData.recommendations.map(
                    (rec, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                      >
                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {rec}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Related Notes */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Related Notes & Insights:
                </h3>
                <ul className="space-y-2">
                  {selectedCard.notes.map((note, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
