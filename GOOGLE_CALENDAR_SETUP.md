# Google Calendar API Setup Guide

This guide will help you set up Google Calendar API integration for your Flovy AI Web application using your business account (faiz@flovy.ai).

## ✨ Business Account Setup

**Benefits of using business account:**
- Better security and organization management
- Professional appearance in OAuth consent screens
- Easier team collaboration and access control
- Better audit trails and compliance

## 🚀 Quick Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're signed in with your business account (faiz@flovy.ai)
3. Create a new project or select an existing one
4. Enable billing (required for API usage)
5. **Important**: Use your business account for better security and organization management

### 2. Enable Google Calendar API

1. In your Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

### 3. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - User Type: External (choose Internal if you have Google Workspace)
   - App name: Flovy AI
   - User support email: faiz@flovy.ai
   - Developer contact information: faiz@flovy.ai
   - **Scopes**: Add these required scopes:
     - `../auth/calendar.readonly`
     - `../auth/calendar.events.readonly`
     - `../auth/calendar.calendars.readonly`
     - `../auth/userinfo.profile`
     - `../auth/userinfo.email`
4. Choose **Web application** as the application type
5. **⚠️ IMPORTANT**: Add these exact authorized redirect URIs:
   - `http://localhost:3000/api/calendar/callback` (for development)
   - `https://yourdomain.com/api/calendar/callback` (for production - replace with your actual domain)
6. Click **Create**
7. Download the JSON credentials file

### 4. Configure Environment Variables

Copy `env.example` to `.env.local` and fill in your values:

```env
# Google Calendar API Configuration
# Get these from Google Cloud Console -> APIs & Services -> Credentials
GOOGLE_CLIENT_ID=your_client_id_from_google_cloud_console.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_from_google_cloud_console
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback

# For production, use your domain:
# GOOGLE_REDIRECT_URI=https://yourdomain.com/api/calendar/callback
```

**📝 Note**: The redirect URI in your `.env.local` must exactly match one of the URIs you added in Google Cloud Console.

### 5. Install Dependencies

The required packages are already installed:
- `googleapis`
- `google-auth-library`

## 🔧 How It Works

### New Features (Multiple Account Support)
- **Multiple Google Calendar Accounts**: Users can connect multiple Google accounts to their Firebase account
- **Account Switching**: Seamlessly switch between different Google Calendar accounts
- **Per-User Storage**: Calendar data is isolated per Firebase user
- **Smart Cleanup**: Calendar data is only cleared when user logs out of Firebase (not when switching calendar accounts)

### User Flow
1. User signs in with Firebase (their main account)
2. User clicks "Connect Google Calendar" to add calendar accounts
3. They can connect multiple Google accounts and switch between them
4. Each Google account maintains its own calendar data and settings
5. All calendar accounts are cleared only when user logs out of Firebase

### API Endpoints

- `GET /api/calendar/auth` - Generates OAuth URL
- `GET /api/calendar/callback` - Handles OAuth redirect and token exchange
- `GET /api/calendar/events` - Fetches calendar events for active account
- `GET /api/calendar/calendars` - Fetches calendar list for active account

### Account Management Features

- **Connect Multiple Accounts**: Add as many Google Calendar accounts as needed
- **Switch Accounts**: Easily switch between connected accounts
- **Disconnect Accounts**: Remove specific Google accounts
- **Persistent Storage**: Account connections persist across sessions
- **User Isolation**: Each Firebase user has their own set of connected Google accounts

## 🛡️ Security & Privacy

### Data Isolation
- **Firebase User Separation**: Calendar data is completely isolated per Firebase user
- **Account-Specific Storage**: Each Google account's data is stored separately
- **Secure Token Management**: Tokens are associated with both Firebase user and Google account IDs
- **Automatic Cleanup**: All calendar data is cleared when user logs out of Firebase

### For Production
1. **Update Redirect URI**: Change `GOOGLE_REDIRECT_URI` to use HTTPS and your production domain
2. **OAuth Credentials**: Use separate OAuth credentials for production
3. **Token Security**: Consider encrypting tokens before storing
4. **Rate Limiting**: Add rate limiting to API endpoints

## 📊 Multiple Account Benefits

### Use Cases
- **Personal + Work**: Connect both personal and work Google accounts
- **Multiple Organizations**: Manage calendars from different companies
- **Family Sharing**: Connect family members' calendars
- **Client Management**: Access client calendars (with permission)

### Data Insights
- **Cross-Account Analytics**: View insights across all connected accounts
- **Account-Specific Analysis**: Focus on specific account patterns
- **Comprehensive View**: Get a complete picture of your time usage

## 🚨 Troubleshooting

### OAuth Redirect URI Issues

**Error: "redirect_uri_mismatch"**
1. Check that your `.env.local` has: `GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback`
2. Verify this exact URI is added in Google Cloud Console → Credentials → OAuth 2.0 Client IDs
3. Make sure there are no extra spaces or trailing slashes
4. For production, update both the environment variable and Google Console with your HTTPS domain

**Error: "Access denied"**
- Verify the OAuth consent screen is configured correctly
- Check that Google Calendar API is enabled in your project
- Ensure your app is not in testing mode with restricted users

### Account Management Issues

**Cannot switch between accounts**
- Check browser console for errors
- Verify that multiple accounts are actually connected
- Clear localStorage and reconnect accounts if needed

**Data not clearing on logout**
- Ensure you're logging out of Firebase, not just disconnecting calendar accounts
- Check that `onAuthStateChanged` is properly detecting logout

### Common Issues

1. **"Invalid client"**
   - Verify client ID and secret in your `.env.local`
   - Check that OAuth credentials are for the correct project

2. **"Quota exceeded"**
   - Check your Google Cloud Console quotas
   - Consider implementing caching for frequently accessed data

3. **"Token expired"**
   - The app handles token refresh automatically
   - If issues persist, disconnect and reconnect the account

## 📈 Next Steps

1. **Enhanced Analytics**: Cross-account insights and comparisons
2. **Calendar Sync**: Two-way synchronization with external calendars
3. **Team Features**: Shared calendar insights for teams
4. **Export Features**: Export insights across all connected accounts
5. **Advanced Permissions**: Granular control over calendar access

## 🔗 Useful Links

- [Google Calendar API Documentation](https://developers.google.com/calendar/api)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quotas](https://developers.google.com/calendar/api/quotas) 