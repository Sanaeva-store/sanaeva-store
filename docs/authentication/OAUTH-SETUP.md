# OAuth Setup Guide

This guide walks you through setting up OAuth social login for Google and Facebook in the Sanaeva Store application using Better Auth.

## Overview

The application uses Better Auth to handle social authentication with Google and Facebook. When users log in via social providers, they are automatically assigned the `CUSTOMER` role for storefront access.

## Prerequisites

- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Access to [Facebook for Developers](https://developers.facebook.com/)
- Application running locally or deployed

## Configuration Files

The OAuth configuration is located in:
- [server/config/auth.ts](../../server/config/auth.ts) - Better Auth configuration
- [.env](.env) - Environment variables (OAuth credentials)

## Google OAuth 2.0 Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **New Project**
4. Enter project name: `Sanaeva Store` (or your preference)
5. Click **Create**

### Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click on **Google+ API**
4. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Select **External** user type
   - Fill in required fields:
     - App name: `Sanaeva Store`
     - User support email: Your email
     - Developer contact: Your email
   - Click **Save and Continue**
   - Skip scopes (click **Save and Continue**)
   - Add test users if needed
   - Click **Back to Dashboard**

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Sanaeva Store Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - Your production URL (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Click **Create**

5. Copy the credentials:
   - **Client ID**: Copy to `GOOGLE_CLIENT_ID` in `.env`
   - **Client Secret**: Copy to `GOOGLE_CLIENT_SECRET` in `.env`

### Step 4: Update Environment Variables

```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

## Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select use case: **Authenticate and request data from users with Facebook Login**
4. Click **Next**
5. Select app type: **Consumer**
6. Fill in app details:
   - App name: `Sanaeva Store`
   - App contact email: Your email
7. Click **Create App**

### Step 2: Add Facebook Login Product

1. In your app dashboard, find **Facebook Login**
2. Click **Set Up**
3. Select platform: **Web**
4. Enter Site URL: `http://localhost:3000`
5. Click **Save** and **Continue**

### Step 3: Configure Facebook Login Settings

1. Go to **Products** > **Facebook Login** > **Settings**
2. Configure the following:
   - **Valid OAuth Redirect URIs**:
     - `http://localhost:3000/api/auth/callback/facebook` (development)
     - `https://yourdomain.com/api/auth/callback/facebook` (production)
   - Click **Save Changes**

### Step 4: Get App Credentials

1. Go to **Settings** > **Basic**
2. Copy the credentials:
   - **App ID**: Copy to `FACEBOOK_CLIENT_ID` in `.env`
   - **App Secret**: Click **Show**, then copy to `FACEBOOK_CLIENT_SECRET` in `.env`

### Step 5: Update Environment Variables

```env
FACEBOOK_CLIENT_ID=your-facebook-app-id-here
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret-here
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/auth/callback/facebook
```

### Step 6: App Review (Production Only)

For production use, you need to submit your app for review:

1. Go to **App Review** > **Permissions and Features**
2. Request **email** permission
3. Fill in the review form
4. Submit for review

⚠️ **Development Mode**: While in development mode, only you and added test users can use Facebook Login.

## Testing OAuth Integration

### Test Google Login

1. Ensure environment variables are set in `.env`
2. Restart your application: `bun dev`
3. Navigate to: `http://localhost:3000/api/auth/api/sign-in/google`
4. You should be redirected to Google's consent screen
5. After successful authentication, you'll be redirected back to your app
6. Verify user is created in database with `CUSTOMER` role

### Test Facebook Login

1. Ensure environment variables are set in `.env`
2. Restart your application: `bun dev`
3. Navigate to: `http://localhost:3000/api/auth/api/sign-in/facebook`
4. You should be redirected to Facebook's consent screen
5. After successful authentication, you'll be redirected back to your app
6. Verify user is created in database with `CUSTOMER` role

## Available OAuth Endpoints

Better Auth automatically provides these endpoints:

### Google OAuth
- **Initiate login**: `GET /api/auth/api/sign-in/google`
- **Callback**: `GET /api/auth/api/callback/google`

### Facebook OAuth
- **Initiate login**: `GET /api/auth/api/sign-in/facebook`
- **Callback**: `GET /api/auth/api/callback/facebook`

## Frontend Integration

### Using Better Auth React Client

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
})

export const { signIn } = authClient
```

### Login Buttons

```tsx
// components/auth/SocialLoginButtons.tsx
import { signIn } from '@/lib/auth-client'

export function SocialLoginButtons() {
  const handleGoogleLogin = async () => {
    await signIn.social({ provider: 'google' })
  }

  const handleFacebookLogin = async () => {
    await signIn.social({ provider: 'facebook' })
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
      <button onClick={handleFacebookLogin}>
        Sign in with Facebook
      </button>
    </div>
  )
}
```

## Automatic Role Assignment

When users authenticate via social login, the system automatically:
1. Creates a user account if it doesn't exist
2. Assigns the `CUSTOMER` role (storefront access)
3. Logs the authentication event in the audit log

This logic is implemented in [server/modules/auth/service.ts](../../server/modules/auth/service.ts) in the `handleSocialLogin()` function.

## Troubleshooting

### Error: "Redirect URI mismatch"

**Cause**: The redirect URI in your OAuth provider settings doesn't match the one in your `.env` file.

**Solution**: 
- Ensure the redirect URI in Google Cloud Console or Facebook App Settings matches exactly
- Check for trailing slashes
- Verify the protocol (`http` vs `https`)

### Error: "Client secret is invalid"

**Cause**: The client secret is incorrect or expired.

**Solution**:
- Regenerate the client secret in Google Cloud Console or Facebook App Settings
- Update the `.env` file with the new secret
- Restart your application

### Users not getting CUSTOMER role

**Cause**: Database seed hasn't been run, or `CUSTOMER` role doesn't exist.

**Solution**:
```bash
# Run database seed
bun prisma db seed

# Verify roles exist
bunx prisma studio
# Check the Role table
```

### OAuth not working in production

**Checklist**:
- [ ] Environment variables are set in production
- [ ] Production URLs are added to OAuth provider settings
- [ ] `BETTER_AUTH_URL` points to production domain
- [ ] Redirect URIs use `https://` protocol
- [ ] Facebook app is in Live mode (not Development)

## Security Best Practices

1. **Never commit OAuth secrets** to version control
2. **Use environment variables** for all sensitive data
3. **Enable email verification** in production
4. **Rotate secrets regularly** (quarterly recommended)
5. **Monitor audit logs** for suspicious activity
6. **Use HTTPS** in production
7. **Implement rate limiting** to prevent abuse

## Production Deployment

Before deploying to production:

1. Update redirect URIs in OAuth providers with production URLs
2. Set environment variables in your hosting platform
3. Update `BETTER_AUTH_URL` to production domain
4. Enable email verification in [server/config/auth.ts](../../server/config/auth.ts):
   ```typescript
   emailAndPassword: {
     enabled: true,
     requireEmailVerification: true, // Set to true
     ...
   }
   ```
5. Submit Facebook app for review (if using Facebook Login)
6. Test OAuth flow in production environment

## References

- [Better Auth Documentation](https://www.better-auth.com/)
- [Better Auth Google Provider](https://www.better-auth.com/docs/authentication/google)
- [Better Auth Facebook Provider](https://www.better-auth.com/docs/authentication/facebook)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)

## Support

For issues or questions:
- Check [Better Auth GitHub Issues](https://github.com/better-auth/better-auth/issues)
- Review existing authentication documentation in [docs/authentication/](.)
- Consult the [Integration Guide](INTEGRATION-GUIDE.md)
