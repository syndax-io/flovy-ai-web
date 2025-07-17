import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { access_token, refresh_token } = req.query;

  if (!access_token || !refresh_token) {
    return res.status(400).json({ error: 'Access token and refresh token are required' });
  }

  try {
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: access_token as string,
      refresh_token: refresh_token as string,
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

    res.status(200).json({
      calendars,
      totalCalendars: calendars.length,
      primaryCalendar: calendars.find(cal => cal.primary)?.id || 'primary'
    });

  } catch (error) {
    console.error('Error fetching calendar list:', error);
    res.status(500).json({ 
      error: 'Failed to fetch calendar list',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 