# Supabase Storage Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in with your email
3. Click **"New Project"**
4. Fill in:
   - **Project Name:** `loretana-customizer`
   - **Database Password:** Create a strong password
   - **Region:** Choose closest to you
5. Click **"Create new project"**
6. Wait for project to initialize (1-2 minutes)

### Step 2: Get Project Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (starts with `https://...supabase.co`)
   - **Anon Key** (under "anon public")

### Step 3: Create Storage Bucket

1. Go to **Storage** in the left menu
2. Click **"New bucket"**
3. Name it: `customizer-uploads`
4. **Uncheck** "Make it private" (to allow public access)
5. Click **"Create bucket"**

### Step 4: Configure Your .env

Update `/home/inoublileith6/LoretanBackend/.env`:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

### Step 5: Test Locally

```bash
npm run build
npm start
```

Then test in Postman:
- Base URL: `http://localhost:3000`
- POST `/customizer/upload` with a PNG/JPG file
- Files will be stored in Supabase!

### Step 6: Deploy to Vercel

1. Add environment variables to Vercel:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

2. Deploy:
   ```bash
   npx vercel deploy --prod
   ```

## Advantages of Supabase

✅ **Easy Setup** - No complex authentication
✅ **Free Tier** - 500MB storage included  
✅ **Public URLs** - Instant shareable links
✅ **CORS Friendly** - Works from browser
✅ **Scalable** - Pay as you grow

## API Endpoints

All endpoints work the same way as before:

- **POST** `/customizer/upload` - Upload image
- **DELETE** `/customizer/cleanup/:sessionId` - Delete session files
- **POST** `/customizer/session/:sessionId` - Get session info

The response format is identical!
