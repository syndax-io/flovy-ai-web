import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

// Get the redirect URI from environment variable or use localhost for development
const getRedirectUri = () => {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  
  // Default for development
  return process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com/api/calendar/callback'
    : 'http://localhost:3000/api/calendar/callback';
};

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  getRedirectUri()
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    // Handle OAuth error
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL(`/dashboard?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(new URL('/dashboard?error=No authorization code received', request.url));
  }

  try {
    console.log('Exchanging code for tokens...');
    
    // Exchange code for tokens directly here
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('Tokens received successfully');

    // Redirect back to dashboard with tokens
    const tokenParams = new URLSearchParams({
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      expiry_date: tokens.expiry_date?.toString() || '',
    });

    console.log('Redirecting to dashboard with tokens');
    return NextResponse.redirect(new URL(`/dashboard?${tokenParams.toString()}`, request.url));

  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.redirect(new URL('/dashboard?error=Failed to complete authentication', request.url));
  }
}
