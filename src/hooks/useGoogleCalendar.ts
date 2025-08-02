import { useCallback, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface CalendarTokens {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
  userId: string; // Firebase user ID
  googleAccountId: string; // Google account identifier (email or sub)
  googleAccountEmail: string; // Google account email for display
}

interface CalendarAccount {
  id: string; // Google account identifier
  email: string;
  tokens: CalendarTokens;
  isConnected: boolean;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<CalendarAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<CalendarAccount | null>(null);

  // Listen to Firebase auth state changes and clear calendar data ONLY on logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user?.uid);
      
      // Only clear when user logs out (user becomes null)
      if (currentUser && !user) {
        console.log('User logged out, clearing all calendar data');
        setConnectedAccounts([]);
        setActiveAccount(null);
        setIsAuthenticated(false);
        setCalendarData(null);
        setCalendarList(null);
        setSelectedCalendars(['primary']);
        setError(null);
        clearAllCalendarStorage();
      }
      
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Load connected accounts for current user
  useEffect(() => {
    if (!currentUser) return;

    const loadConnectedAccounts = () => {
      const accountsKey = `googleCalendarAccounts_${currentUser.uid}`;
      const selectedKey = `googleCalendarSelected_${currentUser.uid}`;
      
      const storedAccounts = localStorage.getItem(accountsKey);
      const storedSelected = localStorage.getItem(selectedKey);
      
      if (storedAccounts) {
        try {
          const accounts = JSON.parse(storedAccounts);
          setConnectedAccounts(accounts);
          
          // Set the first connected account as active if none is active
          if (accounts.length > 0 && !activeAccount) {
            setActiveAccount(accounts[0]);
            setIsAuthenticated(true);
          }
        } catch {
          localStorage.removeItem(accountsKey);
        }
      }

      if (storedSelected) {
        try {
          const calendars = JSON.parse(storedSelected);
          setSelectedCalendars(calendars);
        } catch {
          localStorage.removeItem(selectedKey);
        }
      }
    };

    loadConnectedAccounts();
  }, [currentUser, activeAccount]);

  // Handle OAuth tokens from URL params
  useEffect(() => {
    if (!currentUser) return;

    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get('access_token');
    const refresh_token = urlParams.get('refresh_token');
    const expiry_date = urlParams.get('expiry_date');

    if (access_token && refresh_token) {
      addNewCalendarAccount(access_token, refresh_token, parseInt(expiry_date || '0'));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser]);

  const clearAllCalendarStorage = () => {
    if (!currentUser) return;
    
    const accountsKey = `googleCalendarAccounts_${currentUser.uid}`;
    const selectedKey = `googleCalendarSelected_${currentUser.uid}`;
    
    localStorage.removeItem(accountsKey);
    localStorage.removeItem(selectedKey);
  };

  const addNewCalendarAccount = async (access_token: string, refresh_token: string, expiry_date: number) => {
    if (!currentUser) return;

    try {
      // Fetch Google user info to get account details
      const userInfoResponse = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`
      );
      const userInfo = await userInfoResponse.json();

      const newAccount: CalendarAccount = {
        id: userInfo.id || userInfo.email,
        email: userInfo.email,
        tokens: {
          access_token,
          refresh_token,
          expiry_date,
          userId: currentUser.uid,
          googleAccountId: userInfo.id || userInfo.email,
          googleAccountEmail: userInfo.email,
        },
        isConnected: true,
      };

      // Update connected accounts
      const updatedAccounts = [...connectedAccounts];
      const existingIndex = updatedAccounts.findIndex(acc => acc.id === newAccount.id);
      
      if (existingIndex >= 0) {
        // Update existing account
        updatedAccounts[existingIndex] = newAccount;
      } else {
        // Add new account
        updatedAccounts.push(newAccount);
      }

      setConnectedAccounts(updatedAccounts);
      setActiveAccount(newAccount);
      setIsAuthenticated(true);

      // Save to localStorage
      const accountsKey = `googleCalendarAccounts_${currentUser.uid}`;
      localStorage.setItem(accountsKey, JSON.stringify(updatedAccounts));

      console.log('Added/updated calendar account:', userInfo.email);
    } catch (error) {
      console.error('Error adding calendar account:', error);
      setError('Failed to add calendar account');
    }
  };

  const switchAccount = useCallback((accountId: string) => {
    const account = connectedAccounts.find(acc => acc.id === accountId);
    if (account) {
      setActiveAccount(account);
      setCalendarData(null); // Clear current calendar data
      setCalendarList(null);
      console.log('Switched to account:', account.email);
    }
  }, [connectedAccounts]);

  const disconnectAccount = useCallback((accountId: string) => {
    if (!currentUser) return;

    const updatedAccounts = connectedAccounts.filter(acc => acc.id !== accountId);
    setConnectedAccounts(updatedAccounts);

    // If we're disconnecting the active account, switch to another or clear
    if (activeAccount?.id === accountId) {
      if (updatedAccounts.length > 0) {
        setActiveAccount(updatedAccounts[0]);
      } else {
        setActiveAccount(null);
        setIsAuthenticated(false);
        setCalendarData(null);
        setCalendarList(null);
      }
    }

    // Save to localStorage
    const accountsKey = `googleCalendarAccounts_${currentUser.uid}`;
    localStorage.setItem(accountsKey, JSON.stringify(updatedAccounts));

    console.log('Disconnected account:', accountId);
  }, [currentUser, connectedAccounts, activeAccount]);

  const disconnect = useCallback(() => {
    if (!currentUser) return;
    
    setConnectedAccounts([]);
    setActiveAccount(null);
    setIsAuthenticated(false);
    setCalendarData(null);
    setCalendarList(null);
    setSelectedCalendars(['primary']);
    clearAllCalendarStorage();
  }, [currentUser]);

  const authenticate = useCallback(async () => {
    if (!currentUser) {
      setError('User not authenticated with Firebase');
      return;
    }

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
  }, [currentUser]);

  const fetchCalendarList = useCallback(async () => {
    if (!currentUser || !activeAccount) {
      setError('No active calendar account');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        access_token: activeAccount.tokens.access_token,
        refresh_token: activeAccount.tokens.refresh_token,
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
        const selectedKey = `googleCalendarSelected_${currentUser.uid}`;
        localStorage.setItem(selectedKey, JSON.stringify(updatedSelection));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar list');
    } finally {
      setIsLoading(false);
    }
  }, [activeAccount, selectedCalendars, currentUser]);

  const fetchCalendarData = useCallback(async (days: number = 365) => {
    if (!currentUser || !activeAccount) {
      setError('No active calendar account');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        access_token: activeAccount.tokens.access_token,
        refresh_token: activeAccount.tokens.refresh_token,
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
      console.log('Calendar data received for:', activeAccount.email, data);
      setCalendarData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
    } finally {
      setIsLoading(false);
    }
  }, [activeAccount, selectedCalendars, currentUser]);

  // Automatically fetch calendar data when active account changes
  useEffect(() => {
    if (currentUser && activeAccount && !calendarData) {
      setTimeout(() => {
        fetchCalendarData(365);
      }, 1000);
    }
  }, [currentUser, activeAccount, calendarData, fetchCalendarData]);

  const updateSelectedCalendars = useCallback((calendarIds: string[]) => {
    if (!currentUser) return;
    
    setSelectedCalendars(calendarIds);
    const selectedKey = `googleCalendarSelected_${currentUser.uid}`;
    localStorage.setItem(selectedKey, JSON.stringify(calendarIds));
  }, [currentUser]);

  return {
    isAuthenticated,
    isLoading,
    error,
    calendarData,
    calendarList,
    selectedCalendars,
    connectedAccounts,
    activeAccount,
    authenticate,
    fetchCalendarList,
    fetchCalendarData,
    updateSelectedCalendars,
    switchAccount,
    disconnectAccount,
    disconnect,
  };
}; 