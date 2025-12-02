# Deployment Guide: Loretana Backend to Vercel

This guide explains how to deploy your NestJS backend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **Git Repository**: Your project must be in a git repository (GitHub, GitLab, or Bitbucket)
3. **Environment Variables**: Have your `.env` values ready

## Step 1: Push Your Project to Git

If not already done:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main  # or your branch name
```

## Step 2: Connect to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your Git repository (GitHub/GitLab/Bitbucket)
4. Choose the repository `LoretanBackend`
5. Click **"Import"**

### Option B: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel deploy
```

## Step 3: Configure Environment Variables

After importing, Vercel will ask for environment variables:

1. In the **Environment Variables** section, add:
   - `EMAIL_USER` → your Gmail address (e.g., `inoublileith6@gmail.com`)
   - `EMAIL_PASSWORD` → your Gmail App Password (NOT your main password)
   - `NODE_ENV` → `production`

2. Click **"Deploy"**

### Example Environment Variables

```
EMAIL_USER=inoublileith6@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
NODE_ENV=production
```

## Step 4: Monitor Deployment

- Vercel will automatically build and deploy your project
- Check the deployment status in the Vercel dashboard
- Logs are available in **"Deployments"** tab

## Step 5: Get Your Live URL

Once deployed, Vercel provides a unique URL:

```
https://loretanbackend-xxx.vercel.app
```

Your API endpoints will be accessible at:

- QR Generation: `https://loretanbackend-xxx.vercel.app/qr/generate`
- Send Email: `https://loretanbackend-xxx.vercel.app/email/send`
- Test HTML: `https://loretanbackend-xxx.vercel.app/email/send-test-html`
- Test Upload: `https://loretanbackend-xxx.vercel.app/email/test-upload`

## Troubleshooting

### Build Fails

- Check logs in Vercel dashboard → **Deployments** → **Build Logs**
- Ensure all dependencies in `package.json` are correct
- Run locally first: `npm run build && npm run start:prod`

### Email Not Sending

- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set in Vercel environment
- Check Gmail App Passwords (2FA must be enabled)
- Verify the email recipient is valid
- Check Vercel function logs for SMTP errors

### Large File Upload Fails

- Vercel functions have a 6 MB payload limit by default
- Current limits in controller: 10 MB per file, 20 MB total
- To fix: either reduce file limits or upgrade to Vercel Pro

### Connection Timeout

- Vercel serverless functions have 30-second timeout (on Pro plan)
- Email sending usually completes in 1-2 seconds
- If timeout occurs, check network/SMTP connectivity

## Redeploy After Changes

Every push to your branch triggers automatic redeployment:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Vercel will automatically rebuild and redeploy.

## Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `api.loretana.com`)
3. Point your domain registrar's DNS to Vercel nameservers

## Important Notes

- **File Uploads**: Vercel's serverless functions have limitations on file size and request duration. Current setup supports up to 10 MB per file.
- **Database**: If you add a database later, use a managed service like MongoDB Atlas, PostgreSQL on Railway, or Supabase.
- **Rate Limiting**: Consider adding rate limiting for email endpoint in production.
- **Logging**: Use Vercel's integrated logging; avoid writing logs to disk.

## Rollback

If deployment fails or you need to revert:

1. Go to **Deployments** in Vercel dashboard
2. Find the previous working deployment
3. Click **"...Promote to Production"**

## Further Help

- [Vercel NestJS Guide](https://vercel.com/docs/frameworks/nestjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Troubleshooting](https://vercel.com/support)
