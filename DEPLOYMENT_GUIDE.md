# GitHub Pages Deployment Guide

This guide explains how to deploy your Angular e-commerce application to GitHub Pages so it can be viewed in a browser.

## 🚀 Quick Deployment (Automatic)

### Step 1: Enable GitHub Pages

1. Go to your repository: https://github.com/gane27/ecommerce-angular
2. Click on **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click **Save**

### Step 2: Push Changes

The GitHub Actions workflow will automatically deploy when you push to `main`:

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### Step 3: Wait for Deployment

1. Go to **Actions** tab in your GitHub repository
2. Wait for the workflow to complete (usually 2-3 minutes)
3. Once complete, your site will be live at:
   **https://gane27.github.io/ecommerce-angular/**

---

## 📋 What Was Configured

### 1. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automatically builds and deploys on every push to `main`
- Uses Node.js 18
- Builds with GitHub Pages configuration
- Deploys to `gh-pages` branch

### 2. Angular Configuration (`angular.json`)
- Added `github-pages` build configuration
- Sets `baseHref` to `/ecommerce-angular/` (your repo name)

### 3. Package Scripts (`package.json`)
- `build:gh-pages`: Builds for GitHub Pages
- `deploy`: Manual deployment command

---

## 🔧 Manual Deployment (Alternative)

If you prefer to deploy manually:

```bash
# Install angular-cli-ghpages (one time)
npm install -g angular-cli-ghpages

# Build and deploy
npm run deploy
```

Or step by step:

```bash
# Build for GitHub Pages
npm run build:gh-pages

# Deploy using angular-cli-ghpages
npx angular-cli-ghpages --dir=dist/ecommerce-app
```

---

## 🌐 Access Your Deployed Site

Once deployed, your application will be available at:

**https://gane27.github.io/ecommerce-angular/**

Note: It may take a few minutes after the first deployment for the site to be accessible.

---

## 🔄 Updating Your Site

Every time you push changes to the `main` branch, GitHub Actions will:
1. Automatically build your application
2. Deploy it to GitHub Pages
3. Your site will be updated within 2-3 minutes

No manual steps required!

---

## ⚠️ Important Notes

### Base Href
- The application is configured with `baseHref: "/ecommerce-angular/"`
- This matches your repository name
- If you rename your repository, update `angular.json`:
  ```json
  "baseHref": "/your-new-repo-name/"
  ```

### Routing
- Angular routing works correctly with the configured base href
- All routes will be prefixed with `/ecommerce-angular/`

### Assets
- Images and other assets will load correctly
- Make sure all asset paths are relative

---

## 🐛 Troubleshooting

### Site Not Loading
1. Check GitHub Actions: Go to **Actions** tab → Check if workflow succeeded
2. Check GitHub Pages settings: Settings → Pages → Verify `gh-pages` branch is selected
3. Wait a few minutes: First deployment can take 5-10 minutes

### 404 Errors on Routes
- This is normal for Angular SPAs on GitHub Pages
- GitHub Pages doesn't support server-side routing
- Users should navigate from the home page (don't bookmark direct routes)

### Build Errors
- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Images Not Loading
- Ensure image URLs are relative paths
- Check that images are in `src/assets/` folder
- Verify Unsplash URLs are accessible

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## ✅ Deployment Checklist

- [x] GitHub Actions workflow created
- [x] Angular build configuration updated
- [x] Package scripts added
- [ ] GitHub Pages enabled in repository settings
- [ ] First deployment completed
- [ ] Site accessible at https://gane27.github.io/ecommerce-angular/

---

## 🎉 Success!

Once deployed, share your live site URL:
**https://gane27.github.io/ecommerce-angular/**
