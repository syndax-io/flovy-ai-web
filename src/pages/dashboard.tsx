"use client";

import { useState } from "react";
import ProtectedRoute from "../components/app/ProtectedRoute";
import Navbar from "../components/app/Navbar";
import Card from "../components/app/Card";
import Modal from "../components/app/Modal";

interface CardData {
  id: string;
  variant: "blue" | "green" | "purple" | "red" | "yellow";
  title: string;
  description: string;
  summary: {
    mainMetric: string;
    subMetrics: string[];
    trend: "up" | "down" | "stable";
  };
  notes: string[];
  detailedData: {
    charts?: string[];
    metrics: { label: string; value: string; change?: string }[];
    recommendations: string[];
  };
}

const cardData: CardData[] = [
  {
    id: "daily-focus",
    variant: "blue",
    title: "Daily Focus",
    description: "AI-powered suggestions for what to focus on today",
    summary: {
      mainMetric: "85%",
      subMetrics: ["3 Priority Tasks", "2 Hours Deep Work", "5 Meetings"],
      trend: "up" as const,
    },
    notes: [
      "Based on your calendar and priorities, focus on completing the quarterly report today",
      "You have 3 meetings scheduled - prepare key talking points for each",
      "Block 2 hours for deep work on the new feature development",
      "Review and respond to urgent emails from the last 24 hours",
    ],
    detailedData: {
      metrics: [
        { label: "Focus Score", value: "85%", change: "+5%" },
        { label: "Tasks Completed", value: "12/15", change: "+2" },
        { label: "Deep Work Hours", value: "2.5h", change: "+0.5h" },
        { label: "Meeting Efficiency", value: "92%", change: "+3%" },
      ],
      recommendations: [
        "Schedule your most important task between 9-11 AM when you're most productive",
        "Take a 5-minute break every 25 minutes to maintain focus",
        "Use the Pomodoro technique for the quarterly report task",
        "Prepare talking points for the 2 PM client meeting in advance",
      ],
    },
  },
  {
    id: "habit-tracking",
    variant: "green",
    title: "Habit Tracking",
    description: "Monitor your progress and build better habits",
    summary: {
      mainMetric: "78%",
      subMetrics: ["7 Day Streak", "5/7 Exercise", "30min Reading"],
      trend: "up" as const,
    },
    notes: [
      "Morning routine: 7 days streak - keep it up!",
      "Exercise: 5/7 days this week - aim for 6 days next week",
      "Reading: 30 minutes daily - currently on track",
      "Water intake: 8 glasses daily - need to improve hydration",
      "Sleep: 7-8 hours - maintain this healthy pattern",
    ],
    detailedData: {
      metrics: [
        { label: "Overall Consistency", value: "78%", change: "+8%" },
        { label: "Morning Routine", value: "7 days", change: "streak" },
        { label: "Exercise Days", value: "5/7", change: "+1" },
        { label: "Reading Time", value: "30min", change: "on track" },
        { label: "Water Intake", value: "6/8 glasses", change: "-2" },
        { label: "Sleep Quality", value: "8.2/10", change: "+0.3" },
      ],
      recommendations: [
        "Set a reminder for water intake every 2 hours",
        "Try adding 10 minutes of stretching to your morning routine",
        "Join the evening reading challenge to boost consistency",
        "Track your sleep with a sleep app for better insights",
      ],
    },
  },
  {
    id: "smart-insights",
    variant: "purple",
    title: "Smart Insights",
    description: "Get intelligent insights about your productivity patterns",
    summary: {
      mainMetric: "92%",
      subMetrics: ["Peak Hours 9-11AM", "40% More Tasks", "15% Break Boost"],
      trend: "stable" as const,
    },
    notes: [
      "Your most productive hours are 9-11 AM - schedule important tasks then",
      "You tend to get distracted during 2-4 PM - use this time for routine tasks",
      "Team collaboration peaks on Tuesdays and Thursdays",
      "You complete 40% more tasks when working in 25-minute focused sessions",
      "Consider taking more breaks - productivity increases by 15% with regular rest periods",
    ],
    detailedData: {
      metrics: [
        { label: "Productivity Score", value: "92%", change: "+2%" },
        { label: "Peak Hours", value: "9-11 AM", change: "consistent" },
        { label: "Focus Sessions", value: "25min optimal", change: "proven" },
        { label: "Break Efficiency", value: "15% boost", change: "+5%" },
        { label: "Team Sync Days", value: "Tue/Thu", change: "optimal" },
        { label: "Distraction Hours", value: "2-4 PM", change: "identified" },
      ],
      recommendations: [
        "Move your most challenging tasks to 9-11 AM time slot",
        "Schedule routine tasks and meetings during 2-4 PM",
        "Implement 25-minute focused work sessions with 5-minute breaks",
        "Plan team collaborations for Tuesdays and Thursdays",
        "Use the 2-4 PM slot for creative brainstorming or learning",
      ],
    },
  },
  {
    id: "time-analytics",
    variant: "yellow",
    title: "Time Analytics",
    description: "Detailed breakdown of how you spend your time",
    summary: {
      mainMetric: "6.8h",
      subMetrics: ["2.5h Deep Work", "1.8h Meetings", "2.5h Admin"],
      trend: "up" as const,
    },
    notes: [
      "Total productive time: 6.8 hours out of 8 hours workday",
      "Deep work sessions increased by 15% this week",
      "Meeting efficiency improved with better preparation",
      "Administrative tasks taking up more time than ideal",
      "Consider batching similar tasks to reduce context switching",
    ],
    detailedData: {
      metrics: [
        { label: "Total Productive Time", value: "6.8h", change: "+0.5h" },
        { label: "Deep Work", value: "2.5h", change: "+0.3h" },
        { label: "Meetings", value: "1.8h", change: "-0.2h" },
        { label: "Administrative", value: "2.5h", change: "+0.4h" },
        { label: "Context Switches", value: "12/day", change: "-3" },
        { label: "Focus Score", value: "85%", change: "+5%" },
      ],
      recommendations: [
        "Batch administrative tasks into 30-minute blocks",
        "Reduce meeting duration by 15 minutes when possible",
        "Schedule deep work blocks in 90-minute sessions",
        "Use time blocking to minimize context switching",
        "Review and optimize recurring meetings",
      ],
    },
  },
  {
    id: "goal-progress",
    variant: "red",
    title: "Goal Progress",
    description: "Track progress towards your weekly and monthly goals",
    summary: {
      mainMetric: "73%",
      subMetrics: ["3/5 Weekly Goals", "12/20 Monthly Tasks", "2 Milestones"],
      trend: "up" as const,
    },
    notes: [
      "Weekly goal completion: 3 out of 5 goals achieved",
      "Monthly task progress: 12 out of 20 tasks completed",
      "2 major milestones reached this month",
      "Behind schedule on the project documentation",
      "Ahead of schedule on the team training initiative",
    ],
    detailedData: {
      metrics: [
        { label: "Weekly Goals", value: "3/5", change: "+1" },
        { label: "Monthly Tasks", value: "12/20", change: "+3" },
        { label: "Milestones", value: "2/3", change: "+1" },
        { label: "Project Progress", value: "68%", change: "+8%" },
        { label: "Team Training", value: "85%", change: "+15%" },
        { label: "Documentation", value: "45%", change: "-5%" },
      ],
      recommendations: [
        "Focus on completing the remaining 2 weekly goals",
        "Allocate 2 hours daily for project documentation",
        "Continue the momentum on team training initiative",
        "Review and adjust monthly goals if needed",
        "Celebrate the 2 milestone achievements",
      ],
    },
  },
];

export default function Dashboard() {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
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
