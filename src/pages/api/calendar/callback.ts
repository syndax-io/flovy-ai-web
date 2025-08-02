import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { code, error } = req.query;

  if (error) {
    // Handle OAuth error
    console.error('OAuth error:', error);
    return res.redirect(`/dashboard?error=${encodeURIComponent(error as string)}`);
  }

  if (!code) {
    console.error('No authorization code received');
    return res.redirect('/dashboard?error=No authorization code received');
  }

  try {
    console.log('Exchanging code for tokens...');
    
    // Exchange code for tokens directly here
    const { tokens } = await oauth2Client.getToken(code as string);
    
    console.log('Tokens received successfully');

    // Redirect back to dashboard with tokens
    const tokenParams = new URLSearchParams({
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      expiry_date: tokens.expiry_date?.toString() || '',
    });

    console.log('Redirecting to dashboard with tokens');
    res.redirect(`/dashboard?${tokenParams.toString()}`);

  } catch (error) {
    console.error('Error in callback:', error);
    res.redirect('/dashboard?error=Failed to complete authentication');
  }
} 