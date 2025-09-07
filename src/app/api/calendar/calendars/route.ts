import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

interface CalendarListEntry {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  accessRole: string;
  selected?: boolean;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const access_token = searchParams.get('access_token');
  const refresh_token = searchParams.get('refresh_token');

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

    // Get list of all calendars
    const response = await calendar.calendarList.list();

    const calendars: CalendarListEntry[] = (response.data.items || []).map(item => ({
      id: item.id!,
      summary: item.summary || 'Untitled Calendar',
      description: item.description || undefined,
      primary: item.primary || false,
      accessRole: item.accessRole || 'none',
      selected: item.primary || false, // Default to primary calendar being selected
    }));

    return NextResponse.json({
      calendars,
      totalCalendars: calendars.length,
      primaryCalendar: calendars.find(cal => cal.primary)?.id || 'primary'
    });

  } catch (error) {
    console.error('Error fetching calendar list:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch calendar list',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
