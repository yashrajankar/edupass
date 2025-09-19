# Vercel Deployment Guide

This guide explains how to deploy the application to Vercel and configure it properly.

## Prerequisites

1. A Vercel account
2. A deployed backend API (currently configured to use https://edupass-backend.onrender.com)
3. Node.js installed locally (for development)

## Deployment Steps

### 1. Deploy to Vercel

You can deploy this application to Vercel in several ways:

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Option B: Using Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project in Vercel dashboard
3. Configure the project settings as needed

### 2. Environment Variables

Set the following environment variables in your Vercel project settings:

- `BACKEND_URL`: The URL of your deployed backend API (e.g., https://edupass-backend.onrender.com)

### 3. Configuration Files

#### vercel.json
This file contains the routing configuration:
- Static file serving for HTML, CSS, and JS files
- API route proxying to your backend
- Fallback routing to index.html for client-side routing

#### API Routes
The `api/` directory contains Vercel serverless functions:
- `api/auth/[...auth].js`: Proxies authentication requests to your backend
- `api/health.js`: Health check endpoint

## How It Works

1. Static files (HTML, CSS, JS) are served directly by Vercel's edge network
2. API requests are proxied to your backend service
3. Authentication is handled by your backend API
4. The frontend uses localStorage to maintain user sessions

## Troubleshooting

### Common Issues

1. **Login not working**: Check that your backend URL is correctly configured
2. **CSS not loading**: Verify that all asset paths are relative
3. **API errors**: Check the browser console and Vercel logs for error messages

### Debugging Steps

1. Visit `/debug.html` to check environment configuration
2. Check the browser console for JavaScript errors
3. Verify that your backend API is accessible
4. Check Vercel logs for serverless function errors

## Custom Domain

To use a custom domain:

1. Add your domain in the Vercel project settings
2. Configure DNS records as instructed by Vercel
3. Update any hardcoded URLs in your code to use the new domain

## Support

For issues with deployment, check:
- Vercel documentation: https://vercel.com/docs
- This project's issue tracker