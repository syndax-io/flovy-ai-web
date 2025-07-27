# Google Calendar API Setup Guide

This guide will help you set up Google Calendar API integration for your Flovy AI Web application.

## 🚀 Quick Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required for API usage)

### 2. Enable Google Calendar API

1. In your Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Flovy AI
   - User support email: your email
   - Developer contact information: your email
4. Choose **Web application** as the application type
5. Add these authorized redirect URIs:
   - `http://localhost:3000/api/calendar/callback` (for development)
   - `https://yourdomain.com/api/calendar/callback` (for production)
6. Click **Create**
7. Download the JSON credentials file

### 4. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# Google Calendar API Configuration
GOOGLE_CLIENT_ID=your_client_id_from_json_file
GOOGLE_CLIENT_SECRET=your_client_secret_from_json_file
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Install Dependencies

The required packages are already installed:
- `googleapis`
- `google-auth-library`

## 🔧 How It Works

### User Flow
1. User clicks "Connect Google Calendar" on the dashboard
2. They're redirected to Google's OAuth consent screen
3. After granting permissions, they're redirected back to your app
4. The app stores the access tokens securely
5. User can now fetch their calendar data and get insights

### API Endpoints

- `GET /api/calendar/auth` - Generates OAuth URL
- `POST /api/calendar/auth` - Exchanges code for tokens
- `GET /api/calendar/events` - Fetches calendar events
- `GET /api/calendar/callback` - Handles OAuth redirect

### Features

- **Seamless OAuth Flow**: Users don't need to manually configure anything
- **Secure Token Storage**: Tokens are stored in localStorage (consider encryption for production)
- **Analytics**: Provides insights on meeting patterns, productivity trends
- **Past Data**: Fetches up to 1 year of calendar history
- **Real-time Updates**: Can refresh data anytime

## 🛡️ Security Considerations

### For Production
1. **Encrypt Tokens**: Consider encrypting tokens before storing in localStorage
2. **HTTPS Only**: Ensure your production domain uses HTTPS
3. **Token Refresh**: Implement automatic token refresh logic
4. **Rate Limiting**: Add rate limiting to API endpoints
5. **Error Handling**: Implement proper error handling for expired tokens

### Environment Variables
- Never commit `.env.local` to version control
- Use different OAuth credentials for development and production
- Regularly rotate client secrets

## 📊 Data Retrieved

The API fetches and analyzes:
- **Event Details**: Title, description, location, attendees
- **Time Patterns**: Meeting frequency, duration, time of day
- **Productivity Insights**: Deep work blocks, administrative tasks
- **Collaboration Metrics**: Team meetings, external meetings
- **Analytics**: Monthly trends, day-of-week patterns

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure the redirect URI in Google Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"Access denied"**
   - Verify the OAuth consent screen is configured
   - Check that the API is enabled in your project

3. **"Quota exceeded"**
   - Check your Google Cloud Console quotas
   - Consider implementing caching for frequently accessed data

4. **"Token expired"**
   - Implement token refresh logic
   - Handle expired tokens gracefully

### Debug Mode
Add this to your `.env.local` for detailed logging:
```env
DEBUG=googleapis:*
```

## 📈 Next Steps

1. **Enhanced Analytics**: Add more sophisticated data analysis
2. **Real-time Sync**: Implement webhook-based real-time updates
3. **Multiple Calendars**: Support for multiple Google accounts
4. **Export Features**: Allow users to export their insights
5. **Integration**: Connect with other productivity tools

## 🔗 Useful Links

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quotas](https://developers.google.com/calendar/api/quotas) 