# Render Deploy Hook Setup - Step by Step

## Part A: Get Deploy Hook Key from Render

### Step 1: Open Render Dashboard
- Go to: https://dashboard.render.com/
- Login to your account

### Step 2: Select Your Service
- Find and click on service: **gen-pdf-0hb9**

### Step 3: Open Settings
- Click on **Settings** tab in the left sidebar

### Step 4: Find Deploy Hook
- Scroll down until you see **Deploy Hook** section

### Step 5: Create Deploy Hook
- Click **Create Deploy Hook** button
- A URL will appear like: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`
- Click the copy button to copy this entire URL
- Keep this URL safe (don't share it)

---

## Part B: Add Key to GitHub Secrets

### Step 1: Open Your Repository
- Go to your GitHub repository
- Example: `github.com/your-username/gen-pdf`

### Step 2: Go to Settings
- Click **Settings** tab at the top

### Step 3: Navigate to Secrets
- In left sidebar, find **Secrets and variables**
- Click to expand it
- Click **Actions** underneath

### Step 4: Create New Secret
- Click green **New repository secret** button

### Step 5: Add Secret Details
- **Name field**: Type exactly `RENDER_DEPLOY_HOOK_URL`
- **Secret field**: Paste the full URL from Render
- Click **Add secret** button

Done! The secret is now saved.

---

## Part C: How It Works in Code

The workflow file already has this code:

```yaml
- name: Trigger Render Deployment
  run: |
    curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

When workflow runs:
1. GitHub reads secret `RENDER_DEPLOY_HOOK_URL`
2. Replaces `${{ secrets.RENDER_DEPLOY_HOOK_URL }}` with your actual URL
3. Executes: `curl -X POST "https://api.render.com/deploy/srv-xxxxx?key=yyyyy"`
4. Render receives request and starts deployment

---

## Part D: Test It

### Option 1: Manual Test
1. Go to repository **Actions** tab
2. Click **Deploy Backend to Render** workflow
3. Click **Run workflow** button
4. Select **main** branch
5. Click **Run workflow**
6. Watch it run - should see green checkmark

### Option 2: Automatic Test
1. Make any change in `backend/` folder
2. Commit and push to main:
   ```bash
   git add .
   git commit -m "test deploy"
   git push
   ```
3. GitHub Actions runs automatically
4. Render deploys your backend

---

## Quick Checklist

✅ Logged into Render  
✅ Found service gen-pdf-0hb9  
✅ Went to Settings → Deploy Hook  
✅ Created deploy hook and copied URL  
✅ Went to GitHub repo Settings  
✅ Went to Secrets and variables → Actions  
✅ Created secret named `RENDER_DEPLOY_HOOK_URL`  
✅ Pasted Render URL as secret value  
✅ Saved secret  
✅ Tested workflow from Actions tab  

---

## Common Issues

**Secret not found error**
- Check secret name is exactly: `RENDER_DEPLOY_HOOK_URL` (all caps)

**Curl error**
- Make sure you copied the complete URL from Render
- URL should start with `https://api.render.com/deploy/`

**Render not deploying**
- Check Render Events tab for API trigger
- Verify URL in GitHub secret matches Render
- Try creating a new deploy hook in Render

---

## Security Note

🔒 Never share the deploy hook URL publicly - anyone with it can trigger deployments of your service.
