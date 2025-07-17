import { useCallback, useEffect, useState } from 'react';

interface CalendarTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

interface CalendarListEntry {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: string;
  selected?: boolean;
}

interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
  attendees: number;
  isAllDay: boolean;
  calendarId: string;
  calendarName: string;
}

interface CalendarAnalytics {
  totalEvents: number;
  allDayEvents: number;
  eventsWithAttendees: number;
  averageAttendees: number;
  eventsByMonth: Record<string, number>;
  eventsByDayOfWeek: Record<string, number>;
  eventsByCalendar: Record<string, number>;
}

interface CalendarData {
  events: CalendarEvent[];
  analytics: CalendarAnalytics;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
  calendarsUsed: string[];
}

interface CalendarList {
  calendars: CalendarListEntry[];
  totalCalendars: number;
  primaryCalendar: string;
}

export const useGoogleCalendar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [calendarList, setCalendarList] = useState<CalendarList | null>(null);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>(['primary']);
  const [tokens, setTokens] = useState<CalendarTokens | null>(null);

  // Check for existing tokens on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('googleCalendarTokens');
    const storedSelectedCalendars = localStorage.getItem('googleCalendarSelected');
    
    if (storedTokens) {
      try {
        const parsedTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('googleCalendarTokens');
      }
    }

    if (storedSelectedCalendars) {
      try {
        const parsedCalendars = JSON.parse(storedSelectedCalendars);
        setSelectedCalendars(parsedCalendars);
      } catch {
        localStorage.removeItem('googleCalendarSelected');
      }
    }
  }, []);

  // Handle OAuth tokens from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get('access_token');
    const refresh_token = urlParams.get('refresh_token');
    const expiry_date = urlParams.get('expiry_date');

    console.log('URL params - access_token:', access_token ? 'present' : 'missing');
    console.log('URL params - refresh_token:', refresh_token ? 'present' : 'missing');

    if (access_token && refresh_token) {
      const newTokens: CalendarTokens = {
        access_token,
        refresh_token,
        expiry_date: parseInt(expiry_date || '0'),
      };

      console.log('Setting tokens from URL params');
      setTokens(newTokens);
      setIsAuthenticated(true);
      localStorage.setItem('googleCalendarTokens', JSON.stringify(newTokens));

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar/auth');
      const { authUrl } = await response.json();
      
      // Open OAuth popup or redirect
      window.location.href = authUrl;
    } catch {
      setError('Failed to start authentication');
      setIsLoading(false);
    }
  }, []);

  const fetchCalendarList = useCallback(async () => {
    if (!tokens) {
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });

      const response = await fetch(`/api/calendar/calendars?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar list');
      }

      const data = await response.json();
      setCalendarList(data);
      
      // Update selected calendars to include primary calendar if not already selected
      const primaryId = data.primaryCalendar;
      if (primaryId && !selectedCalendars.includes(primaryId)) {
        const updatedSelection = [...selectedCalendars, primaryId];
        setSelectedCalendars(updatedSelection);
        localStorage.setItem('googleCalendarSelected', JSON.stringify(updatedSelection));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar list');
    } finally {
      setIsLoading(false);
    }
  }, [tokens, selectedCalendars]);

  const fetchCalendarData = useCallback(async (days: number = 365) => {
    if (!tokens) {
      setError('Not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        days: days.toString(),
      });

      // Add selected calendar IDs to the request
      selectedCalendars.forEach(calendarId => {
        params.append('calendarIds', calendarId);
      });

      const response = await fetch(`/api/calendar/events?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar data');
      }

      const data = await response.json();
      setCalendarData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
    } finally {
      setIsLoading(false);
    }
  }, [tokens, selectedCalendars]);

  const updateSelectedCalendars = useCallback((calendarIds: string[]) => {
    setSelectedCalendars(calendarIds);
    localStorage.setItem('googleCalendarSelected', JSON.stringify(calendarIds));
  }, []);

  const disconnect = useCallback(() => {
    setTokens(null);
    setIsAuthenticated(false);
    setCalendarData(null);
    setCalendarList(null);
    setSelectedCalendars(['primary']);
    localStorage.removeItem('googleCalendarTokens');
    localStorage.removeItem('googleCalendarSelected');
  }, []);

  return {
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
  };
}; 