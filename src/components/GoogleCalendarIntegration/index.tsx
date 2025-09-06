import React, { useEffect, useState } from "react";

import { useGoogleCalendar } from "../../hooks/useGoogleCalendar";
import Card from "../Card";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const GoogleCalendarIntegration: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    error,
    calendarData,
    calendarList,
    selectedCalendars,
    authenticate,
    fetchCalendarList,
    fetchCalendarData,
    updateSelectedCalendars,
    disconnect,
  } = useGoogleCalendar();

  useEffect(() => {
    console.log("calendarData got updated!", calendarData);
    console.log("Selected calendars:", selectedCalendars);
    console.log("Calendar list:", calendarList);
  }, [calendarData, selectedCalendars, calendarList]);

  const [showCalendarSelector, setShowCalendarSelector] = useState(false);

  const handleConnect = async () => {
    await authenticate();
  };

  const handleFetchCalendars = async () => {
    await fetchCalendarList();
  };

  const handleFetchData = async () => {
    await fetchCalendarData(60); // Fetch last 60 days' data
  };

  const handleCalendarToggle = (calendarId: string) => {
    const newSelection = selectedCalendars.includes(calendarId)
      ? selectedCalendars.filter((id) => id !== calendarId)
      : [...selectedCalendars, calendarId];

    updateSelectedCalendars(newSelection);
  };

  const handleSelectAllCalendars = () => {
    if (calendarList) {
      const allCalendarIds = calendarList.calendars.map((cal) => cal.id);
      updateSelectedCalendars(allCalendarIds);
    }
  };

  const handleSelectPrimaryOnly = () => {
    if (calendarList) {
      updateSelectedCalendars([calendarList.primaryCalendar]);
    }
  };

  if (error) {
    return (
      <Card variant="red" title="Calendar Connection Error">
        <div className="space-y-3">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Try Again"}
          </button>
        </div>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card variant="blue" title="Connect Google Calendar">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Connect your Google Calendar to get personalized insights about your
            schedule, meeting patterns, and productivity trends from the past
            year. You can connect to any calendar you have access to.
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>View your calendar analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Track meeting patterns and productivity</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Connect to multiple calendars</span>
            </div>
          </div>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span>Connect Google Calendar</span>
              </>
            )}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="green" title="Google Calendar Connected">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircleIcon className="w-5 h-5" />
          <span className="font-medium">Successfully connected!</span>
        </div>

        {/* Calendar Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white">
              Select Calendars
            </h4>
            <button
              onClick={() => setShowCalendarSelector(!showCalendarSelector)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showCalendarSelector ? "Hide" : "Show"} Calendars
            </button>
          </div>

          {showCalendarSelector && (
            <div className="space-y-3">
              {!calendarList ? (
                <button
                  onClick={handleFetchCalendars}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load Available Calendars"}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSelectAllCalendars}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleSelectPrimaryOnly}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      Primary Only
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {calendarList.calendars.map((calendar) => (
                      <label
                        key={calendar.id}
                        className="flex items-center space-x-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCalendars.includes(calendar.id)}
                          onChange={() => handleCalendarToggle(calendar.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {calendar.summary}
                            {calendar.primary && (
                              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                Primary
                              </span>
                            )}
                          </div>
                          {calendar.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {calendar.description}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedCalendars.length} of {calendarList.totalCalendars}{" "}
                    calendars selected
                  </div>
                </div>
              )}
            </div>
          )}

          {calendarList && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {selectedCalendars.length} calendar
              {selectedCalendars.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>

        {calendarData ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calendarData.analytics.totalEvents}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Events
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {calendarData.analytics.averageAttendees}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Attendees
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Data from {calendarData.calendarsUsed.length} calendar
              {calendarData.calendarsUsed.length !== 1 ? "s" : ""} over the last{" "}
              {calendarData.dateRange.days} days
            </div>

            {/* Calendar breakdown */}
            {Object.keys(calendarData.analytics.eventsByCalendar).length >
              0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Events by Calendar:
                </div>
                {Object.entries(calendarData.analytics.eventsByCalendar).map(
                  ([calendarName, count]) => (
                    <div
                      key={calendarName}
                      className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="truncate">{calendarName}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600 dark:text-gray-400">
              Ready to analyze your calendar data. Click below to fetch your
              calendar insights from the selected calendars.
            </p>
            <button
              onClick={handleFetchData}
              disabled={isLoading || selectedCalendars.length === 0}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Fetching Data..." : "Fetch Calendar Data"}
            </button>
          </div>
        )}

        <button
          onClick={disconnect}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Disconnect Calendar
        </button>
      </div>
    </Card>
  );
};

export default GoogleCalendarIntegration;
