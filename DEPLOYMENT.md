# Deployment Guide

This document explains how to deploy the PDF Generator application using GitHub Actions.

## Architecture

- **Frontend**: Deployed to GitHub Pages (static hosting)
- **Backend**: Deployed to Render at https://gen-pdf-0hb9.onrender.com/

## Setup Instructions

### 1. Frontend Deployment (GitHub Pages)

#### Step 1: Enable GitHub Pages
1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", select **GitHub Actions** as the source

#### Step 2: Configure Base Path
The `vite.config.js` has been updated with `base: '/gen-pdf/'`. If your repository name is different, update this line:
```javascript
base: '/your-repo-name/',
```

#### Step 3: Deploy
Push changes to the `main` branch, and the frontend will automatically deploy to:
```
https://your-username.github.io/gen-pdf/
```

The workflow runs automatically when:
- Changes are pushed to `frontend/**` directory
- Changes are pushed to `.github/workflows/deploy-frontend.yml`
- Manually triggered via the Actions tab

### 2. Backend Deployment (Render)

#### Step 1: Get Render Deploy Hook
1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your service: `gen-pdf-0hb9`
3. Click on **Settings**
4. Scroll down to **Deploy Hook**
5. Click **Create Deploy Hook**
6. Copy the generated URL (looks like: `https://api.render.com/deploy/srv-xxxxx?key=xxxxx`)

#### Step 2: Add GitHub Secret
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `RENDER_DEPLOY_HOOK_URL`
5. Value: Paste the deploy hook URL from Render
6. Click **Add secret**

#### Step 3: Deploy
Push changes to the `main` branch, and the backend will automatically redeploy on Render.

The workflow runs automatically when:
- Changes are pushed to `backend/**` directory
- Changes are pushed to `.github/workflows/deploy-backend.yml`
- Manually triggered via the Actions tab

## Manual Deployment

You can manually trigger deployments:

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Select the workflow you want to run:
   - "Deploy Frontend to GitHub Pages"
   - "Deploy Backend to Render"
4. Click **Run workflow**
5. Select the branch (usually `main`)
6. Click **Run workflow**

## Verifying Deployments

### Frontend
- Check the Actions tab for workflow status
- Once complete, visit: `https://your-username.github.io/gen-pdf/`
- The app should load and connect to the backend API

### Backend
- Check Render dashboard for deployment status
- Visit: https://gen-pdf-0hb9.onrender.com/
- Should see: `{"message":"Sri Brundabana Enterprises PDF Generator API","status":"Live & Ready"}`

## Troubleshooting

### Frontend Issues
- **404 Error**: Check that the `base` path in `vite.config.js` matches your repository name
- **Build Fails**: Check Actions tab for error logs, ensure all dependencies are in `package.json`
- **Blank Page**: Open browser console, check for asset loading errors (usually base path issue)

### Backend Issues
- **Deploy Hook Failed**: Verify the secret `RENDER_DEPLOY_HOOK_URL` is correctly set
- **Server Not Responding**: Check Render dashboard for deployment logs and errors
- **Cold Start**: First request after inactivity takes 30-90 seconds (Render free tier limitation)

## Environment Variables

### Frontend
No environment variables needed. The backend URL is hardcoded in:
- `frontend/src/components/PdfGenerator.vue` (line 100)

### Backend
Render automatically sets:
- `PORT`: Port number (usually 10000)
- Other environment variables can be set in Render dashboard under Environment

## Cost
- GitHub Pages: Free
- Render Free Tier: Free (with limitations: cold starts, 750 hours/month)

## Next Steps
- Consider upgrading Render to paid plan to eliminate cold starts
- Add environment variables for the backend URL instead of hardcoding
- Set up staging environments for testing before production deployment
