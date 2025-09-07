import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');
  const days = searchParams.get('days') || '365';
  const calendarIds = searchParams.getAll('calendarIds');

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: 'Access token and refresh token are required' }, { status: 400 });
  }

  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: access_token,
      refresh_token: refresh_token,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - parseInt(days));

    // Parse calendar IDs - if not provided, use primary calendar
    const calendarIdList = calendarIds.length > 0 ? calendarIds : ['primary'];

    let allEvents: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Fetch events from all specified calendars
    for (const calendarId of calendarIdList) {
      try {
        const response = await calendar.events.list({
          calendarId: calendarId,
          timeMin: startDate.toISOString(),
          timeMax: now.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
          maxResults: 2500,
        });

        const events = response.data.items || [];
        allEvents = allEvents.concat(events);
      } catch (calendarError) {
        console.error(`Error fetching events from calendar ${calendarId}:`, calendarError);
        // Continue with other calendars even if one fails
      }
    }

    // Sort all events by start time
    allEvents.sort((a, b) => {
      const aStart = a.start?.dateTime || a.start?.date;
      const bStart = b.start?.dateTime || b.start?.date;
      return new Date(aStart).getTime() - new Date(bStart).getTime();
    });

    // Process and categorize events
    const processedEvents = allEvents.map(event => ({
      id: event.id,
      summary: event.summary || 'No Title',
      description: event.description || '',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      location: event.location || '',
      attendees: event.attendees?.length || 0,
      isAllDay: !event.start?.dateTime,
      calendarId: event.organizer?.email || event.calendarId || 'primary',
      calendarName: event.calendarId || 'Primary Calendar',
    }));

    // Calculate analytics
    const analytics = {
      totalEvents: processedEvents.length,
      allDayEvents: processedEvents.filter(e => e.isAllDay).length,
      eventsWithAttendees: processedEvents.filter(e => e.attendees > 0).length,
      averageAttendees: processedEvents.length > 0 
        ? Math.round(processedEvents.reduce((sum, e) => sum + e.attendees, 0) / processedEvents.length)
        : 0,
      eventsByMonth: {} as Record<string, number>,
      eventsByDayOfWeek: {} as Record<string, number>,
      eventsByCalendar: {} as Record<string, number>,
    };

    // Group events by month, day of week, and calendar
    processedEvents.forEach(event => {
      if (!event.start) return; // Skip events without start date
      
      const date = new Date(event.start);
      const month = date.toLocaleString('default', { month: 'long' });
      const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
      
      analytics.eventsByMonth[month] = (analytics.eventsByMonth[month] || 0) + 1;
      analytics.eventsByDayOfWeek[dayOfWeek] = (analytics.eventsByDayOfWeek[dayOfWeek] || 0) + 1;
      analytics.eventsByCalendar[event.calendarName] = (analytics.eventsByCalendar[event.calendarName] || 0) + 1;
    });

    return NextResponse.json({
      events: processedEvents,
      analytics,
      dateRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
        days: parseInt(days)
      },
      calendarsUsed: calendarIdList
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch calendar events',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
