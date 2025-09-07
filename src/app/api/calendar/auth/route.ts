import { OAuth2Client } from 'google-auth-library';
import { NextRequest, NextResponse } from 'next/server';

// Get the redirect URI from environment variable or use localhost for development
const getRedirectUri = () => {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  
  // Default for development
  return process.env.NODE_ENV === 'production' 
    ? 'https://flovy.ai/api/calendar/callback'
    : 'http://localhost:3000/api/calendar/callback';
};

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  getRedirectUri()
);

export async function GET() {
  const redirectUri = getRedirectUri();

  // Generate OAuth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events.readonly',
      'https://www.googleapis.com/auth/calendar.calendars.readonly',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent', // This ensures we get a refresh token
    redirect_uri: redirectUri
  });

  // Debug: Log the redirect URI being used
  console.log('Using Redirect URI:', redirectUri);
  console.log('Generated Auth URL:', authUrl);

  return NextResponse.json({ authUrl, redirectUri });
}
