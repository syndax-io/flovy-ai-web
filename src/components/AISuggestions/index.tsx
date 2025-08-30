import { useGoogleCalendar } from "../../hooks/useGoogleCalendar";

import { SuggestionResponse, UserProfile } from "../../lib/aiModels";

import React, { useEffect, useState } from "react";

import { marked } from "marked";
import Modal from "../Modal";

interface AISuggestionsProps {
  cardData: CardData[]; // Using the cardData from dashboard
  userName: string;
}

interface CardData {
  id: string;
  notes: string[];
}

const AISuggestions: React.FC<AISuggestionsProps> = ({
  cardData,
  userName,
}) => {
  const { calendarData, isAuthenticated } = useGoogleCalendar();
  const [suggestion, setSuggestion] = useState<SuggestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullSuggestion, setShowFullSuggestion] = useState(false);

  // Configure marked for security and emoji support
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Function to process markdown with emoji support
  const processMarkdown = (text: string): string => {
    // First, let marked process the markdown
    const processed = marked.parse(text) as string;

    // Ensure emojis are properly rendered by adding emoji-friendly styling
    return processed.replace(
      /<(p|div|span|li|h[1-6])([^>]*)>/g,
      "<$1$2 style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;\">"
    );
  };

  // Function to truncate text and check if read more is needed
  const getTruncatedText = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) {
      return {
        truncated: text,
        needsReadMore: false,
      };
    }

    // Find the last complete sentence within the limit
    const truncated = text.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf("."),
      truncated.lastIndexOf("!"),
      truncated.lastIndexOf("?")
    );

    if (lastSentenceEnd > maxLength * 0.7) {
      return {
        truncated: text.substring(0, lastSentenceEnd + 1),
        needsReadMore: true,
      };
    }

    // If no good sentence break, just cut at word boundary
    const lastSpace = truncated.lastIndexOf(" ");

    return {
      truncated: text.substring(0, lastSpace) + "...",
      needsReadMore: true,
    };
  };

  useEffect(() => {
    const generateSuggestion = async () => {
      if (!isAuthenticated || !calendarData) return;

      setIsLoading(true);
      setError(null);

      try {
        // Extract goals from card data
        const goals = cardData
          .filter((card) => card.id === "goal-progress")
          .flatMap((card) => card.notes)
          .slice(0, 3); // Take first 3 goals

        // Extract recent tasks from card data
        const recentTasks = cardData
          .filter((card) => card.id === "daily-focus")
          .flatMap((card) => card.notes)
          .slice(0, 3); // Take first 3 tasks

        // Convert calendar events to the expected format
        const calendarEvents = calendarData.events
          .filter((event) => {
            const eventDate = new Date(event.start);
            const today = new Date();
            return eventDate.toDateString() === today.toDateString();
          })
          .slice(0, 5) // Take first 5 events

          .map((event) => ({
            title: event.summary,
            startTime: event.start,
            endTime: event.end,
          }));

        // Extract preferences from card data
        const preferences = {
          preferredWorkHours: "9-5",
          idealEnergyLevels: "High energy in morning",
          focusTime: "Morning hours",
        };

        const userProfile: UserProfile = {
          name: userName,
          goals:
            goals.length > 0
              ? goals
              : [
                  "Improve productivity",
                  "Complete daily tasks",
                  "Maintain work-life balance",
                ],
          recentTasks:
            recentTasks.length > 0
              ? recentTasks
              : ["Started dashboard", "Connected calendar", "Set up goals"],
          calendarEvents,
          preferences,
        };

        // Call the suggestions API
        const response = await fetch("/api/suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userProfile,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate suggestion");
        }

        const suggestionData = await response.json();
        setSuggestion(suggestionData);
      } catch (err) {
        console.error("Error generating AI suggestion:", err);
        setError(
          err instanceof Error ? err.message : "Failed to generate suggestion"
        );
      } finally {
        setIsLoading(false);
      }
    };

    generateSuggestion();
  }, [isAuthenticated, calendarData, cardData, userName]);

  if (!isAuthenticated) {
    return null; // Don't show if calendar is not connected
  }

  if (isLoading) {
    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        {" "}
        <div className="flex items-center space-x-3">
          {" "}
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>{" "}
          <div>
            {" "}
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {" "}
              AI Assistant{" "}
            </h3>{" "}
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {" "}
              Generating personalized suggestion...{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        {" "}
        <div className="flex items-center space-x-3">
          {" "}
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            {" "}
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              {" "}
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />{" "}
            </svg>{" "}
          </div>{" "}
          <div>
            {" "}
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              {" "}
              AI Assistant{" "}
            </h3>{" "}
            <p className="text-sm text-red-700 dark:text-red-300">
              {" "}
              Unable to generate suggestion: {error}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }

  if (!suggestion) {
    return null;
  }

  const { truncated, needsReadMore } = getTruncatedText(suggestion.suggestion);

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
      {" "}
      <div className="flex items-start space-x-4">
        {" "}
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          {" "}
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            {" "}
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />{" "}
          </svg>{" "}
        </div>{" "}
        <div className="flex-1">
          {" "}
          <div className="flex items-center space-x-2 mb-2">
            {" "}
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              {" "}
              AI Assistant{" "}
            </h3>{" "}
            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              {" "}
              Personalized{" "}
            </span>{" "}
            {suggestion?.isMock && (
              <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                {" "}
                Demo Mode{" "}
              </span>
            )}
          </div>{" "}
          <div className="text-gray-800 dark:text-gray-200 leading-relaxed font-emoji">
            {" "}
            {needsReadMore ? (
              <>
                {" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: processMarkdown(truncated),
                  }}
                />{" "}
                <span
                  className="ml-1 text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium"
                  onClick={() => setShowFullSuggestion(true)}
                >
                  {" "}
                  Read more{" "}
                </span>{" "}
              </>
            ) : (
              <span
                dangerouslySetInnerHTML={{
                  __html: processMarkdown(truncated),
                }}
              />
            )}
          </div>{" "}
          {suggestion.priority && (
            <div className="mt-3 flex items-center space-x-2">
              {" "}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {" "}
                Priority:{" "}
              </span>{" "}
              <span
                className={`px-2 py-1 text-xs rounded-full $ {
                        suggestion.priority==="high"
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                        : suggestion.priority==="medium"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }

                    `}
              >
                {" "}
                {suggestion.priority.charAt(0).toUpperCase() +
                  suggestion.priority.slice(1)}
              </span>{" "}
            </div>
          )}
        </div>{" "}
      </div>{" "}
      {showFullSuggestion && (
        <Modal
          isOpen={showFullSuggestion}
          onClose={() => setShowFullSuggestion(false)}
          title="AI Assistant Suggestion"
          variant="green"
        >
          {" "}
          <div
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 prose-emoji"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
            }}
            dangerouslySetInnerHTML={{
              __html: processMarkdown(suggestion.suggestion),
            }}
          />{" "}
        </Modal>
      )}
    </div>
  );
};

export default AISuggestions;
