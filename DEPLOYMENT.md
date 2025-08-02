# Netlify Deployment Guide for Flovy AI

## 🚀 Quick Deploy Steps

### 1. Connect to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub repository
4. Select the `flovy-ai-web` repository

### 2. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 (set in netlify.toml)

### 3. Environment Variables
Set these in Netlify Dashboard → Site settings → Environment variables:

#### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_production_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_production_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_production_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id
```

#### Google OAuth Configuration
```
GOOGLE_CLIENT_ID=your_production_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.netlify.app/api/calendar/callback
```

#### AI API Keys
```
OPENAI_API_KEY=your_production_openai_api_key
GEMINI_API_KEY=your_production_gemini_api_key
```

### 4. Google OAuth Setup for Production

#### Update Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add your Netlify domain to **Authorized redirect URIs**:
   ```
   https://your-domain.netlify.app/api/calendar/callback
   ```
5. Add your Netlify domain to **Authorized JavaScript origins**:
   ```
   https://your-domain.netlify.app
   ```

### 5. Deploy
1. Click "Deploy site" in Netlify
2. Wait for build to complete
3. Your site will be live at `https://your-domain.netlify.app`

## 🔧 Configuration Files

### netlify.toml
- Configures build settings
- Sets Node.js version
- Enables Next.js plugin

### next.config.ts
- Configures image domains for Firebase
- Optimized for Netlify deployment

## 🛠️ Troubleshooting

### Build Errors
- Check Node.js version (should be 18)
- Verify all environment variables are set
- Check build logs in Netlify dashboard

### OAuth Errors
- Ensure redirect URI matches exactly in Google Console
- Check that environment variables are correct
- Verify domain is added to authorized origins

### API Errors
- Check that API keys are valid for production
- Ensure Firebase project is configured for production
- Verify Google Calendar API is enabled

## 📝 Important Notes

1. **Environment Variables**: All sensitive data should be set in Netlify, not in code
2. **Domain**: Replace `your-domain.netlify.app` with your actual Netlify domain
3. **HTTPS**: Netlify provides SSL certificates automatically
4. **Functions**: API routes will be handled by Netlify Functions
5. **Performance**: Enable Netlify's CDN for better performance

## 🔄 Continuous Deployment

Once connected to Git:
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Rollback to previous versions if needed

## 📊 Monitoring

- Check Netlify Analytics for performance
- Monitor function logs for API issues
- Set up notifications for build failures 