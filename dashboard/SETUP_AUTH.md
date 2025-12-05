# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for the Medication Reminder dashboard.

## Prerequisites

- Google Account
- Node.js installed
- PostgreSQL database (local or cloud)

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 1.2 Create a New Project (or select existing)
1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Name it: `Medication Reminder`
4. Click "CREATE"

### 1.3 Enable Google+ API
1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click "ENABLE"

### 1.4 Create OAuth 2.0 Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `MedReminder`
   - User support email: Your email
   - Developer contact: Your email
   - Click **SAVE AND CONTINUE**
   - Scopes: Skip for now (click **SAVE AND CONTINUE**)
   - Test users: Add your Gmail address
   - Click **SAVE AND CONTINUE**

4. Back to Create OAuth client ID:
   - Application type: **Web application**
   - Name: `MedReminder Web Client`

5. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

6. Click **CREATE**

### 1.5 Copy Your Credentials
You'll see a popup with:
- **Client ID**: `something.apps.googleusercontent.com`
- **Client Secret**: `some-random-string`

**IMPORTANT**: Copy both of these! You'll need them in the next step.

---

## Step 2: Set Up Database

### Option A: Local Prisma Postgres (Easiest for Development)

1. Open terminal in `dashboard` folder
2. Run:
   ```bash
   npx prisma dev
   ```
3. This will start a local PostgreSQL database
4. The DATABASE_URL is already set in `.env` file

### Option B: Vercel Postgres (For Production)

1. Go to https://vercel.com/dashboard
2. Create a new project or select existing
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Copy the `DATABASE_URL` connection string
6. Add it to your `.env` file

---

## Step 3: Configure Environment Variables

1. Open `dashboard/.env` file
2. Update the following values:

```env
# ==================== Database ====================
# If using Prisma local dev (Option A), keep the existing DATABASE_URL
# If using Vercel Postgres (Option B), replace with your connection string
DATABASE_URL="your-database-url-here"

# ==================== NextAuth.js ====================
# Generate a random secret for production
# Run this command: openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-here"

# Your app URL (keep as localhost for development)
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials (from Step 1.5)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### Generate NEXTAUTH_SECRET

**Windows (PowerShell)**:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

**Mac/Linux**:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` value.

---

## Step 4: Run Database Migrations

1. Open terminal in `dashboard` folder
2. Run:
   ```bash
   npx prisma migrate dev --name init
   ```
3. This creates all the database tables
4. Run:
   ```bash
   npx prisma generate
   ```
5. This generates the Prisma Client

---

## Step 5: Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

You should be redirected to the sign-in page!

---

## Step 6: Test Google Sign-In

1. Click **"Sign in with Google"**
2. Select your Google account
3. Grant permissions
4. You should be redirected to the dashboard!

---

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add authentication"
git push
```

### 2. Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL` (from Vercel Postgres)
   - `NEXTAUTH_SECRET` (generate new one for production)
   - `NEXTAUTH_URL` (your Vercel deployment URL, e.g., `https://medreminder.vercel.app`)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### 3. Update Google OAuth Redirect URI
1. Go back to Google Cloud Console
2. Go to **Credentials** → Your OAuth client
3. Add your Vercel URL to **Authorized redirect URIs**:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
4. Save

---

## Troubleshooting

### "Error: redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches:
  - Local: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://your-domain.com/api/auth/callback/google`

### "Database connection error"
- Check your `DATABASE_URL` is correct
- For Prisma dev, make sure the local server is running (`npx prisma dev`)
- For Vercel Postgres, check the connection string is correct

### "NEXTAUTH_SECRET must be defined"
- Make sure you generated and added `NEXTAUTH_SECRET` to `.env`

### "Access blocked: This app's request is invalid"
- Make sure you completed the OAuth consent screen configuration
- Add your email to test users

---

## Features Now Available

✅ **Multi-User Authentication**
- Each user has their own account
- Sign in with Google (no password needed)

✅ **User-Specific Alarms**
- Each user's alarms are saved separately in PostgreSQL
- Alarms persist across sessions

✅ **Protected Routes**
- Dashboard, Alarms, Stats, Settings require login
- Automatic redirect to sign-in page

✅ **User Profile**
- Display user name, email, and profile picture
- Logout functionality

✅ **Database Integration**
- PostgreSQL stores users, alarms, and adherence data
- Ready for Vercel deployment

---

## Next Steps

- Add adherence tracking (log when doses are taken)
- Build real-time statistics from database
- Add email notifications for missed doses
- Connect physical Arduino and sync alarms

Enjoy your fully authenticated medication reminder system! 🎉
