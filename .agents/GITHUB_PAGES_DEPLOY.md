# GitHub Pages Deployment Guide

Deploy the N8N Workflow Library website to GitHub Pages.

## Prerequisites

- GitHub repository (already created)
- GitHub Pages enabled for the repository
- Git configured locally

## Option 1: Deploy from Main Branch (Recommended)

### Step 1: Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/yourusername/n8n
2. Click **Settings** → **Pages**
3. Under "Source", select:
   - **Branch**: `main`
   - **Folder**: `/website`
4. Click **Save**

GitHub will automatically deploy the website. Wait 2-3 minutes for the site to go live.

### Step 2: Access Your Site

Your website will be available at:

```
https://yourusername.github.io/n8n/website/
```

## Option 2: Deploy from gh-pages Branch

### Step 1: Create gh-pages Branch

```bash
# Create and switch to gh-pages branch
git checkout --orphan gh-pages

# Keep only the website folder
git rm -rf .
git add website/

# Commit and push
git commit -m "Deploy website to GitHub Pages"
git push origin gh-pages
```

### Step 2: Configure GitHub Pages

1. Go to **Settings** → **Pages**
2. Select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Click **Save**

### Step 3: Update Paths (if needed)

If deploying to a subfolder, update paths in `website/app.js`:

```javascript
// Before
const response = await fetch("./data/workflows.json");

// After (if in subfolder)
const response = await fetch("./website/data/workflows.json");
```

## Option 3: Deploy Using Actions

### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - "website/**"
      - "scripts/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Extract workflows
        run: npm run extract

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./website
```

### Step 2: Commit and Push

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment action"
git push origin main
```

The action will run automatically on each push to `main`.

## Verification

### Check Deployment Status

1. Go to your repository
2. Click **Actions**
3. Look for the latest workflow run
4. Verify status is ✅ **Success**

### Test the Website

1. Visit: `https://yourusername.github.io/n8n/website/`
2. Search for a workflow
3. Try downloading a workflow
4. Test mobile responsiveness

## Troubleshooting

### 404 Errors

**Problem**: Files not found when visiting site

**Solutions**:

- Verify the publish directory is correct
- Check that GitHub Pages is enabled
- Wait 2-3 minutes for deployment to complete
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

### JavaScript Not Working

**Problem**: Search and filters don't work

**Solutions**:

- Verify `app.js` is loaded (check DevTools Network tab)
- Check browser console for errors
- Ensure `data/workflows.json` is accessible
- Check file paths in `app.js`

### Data Not Loading

**Problem**: "Failed to load workflows" message

**Solutions**:

- Verify `workflows.json` exists and is valid JSON
- Check relative paths in `app.js`
- Use browser DevTools Network tab to debug fetch requests
- Regenerate `workflows.json` with `npm run extract`

### Styling Issues

**Problem**: Website looks broken or unstyled

**Solutions**:

- Verify `styles.css` is in the `website/` folder
- Check browser cache
- Verify CSS file paths in `index.html`
- Test in different browser

## Performance Optimization

### Compress Assets

```bash
# Install gzip
npm install --save-dev gzip-cli

# Compress
gzip -k website/data/workflows.json
```

GitHub Pages automatically serves gzipped files.

### Cache Control

GitHub Pages sets cache headers automatically. For custom headers, use GitHub Pages with a custom domain.

## Custom Domain

### Add Custom Domain

1. **Get a domain** from a registrar (Namecheap, GoDaddy, etc.)

2. **Configure DNS**:
   - Create a CNAME record pointing to: `yourusername.github.io`
   - Or use A records pointing to GitHub's IP addresses

3. **Add to GitHub**:
   - Go to **Settings** → **Pages**
   - Enter your custom domain in "Custom domain"
   - GitHub will create a CNAME file automatically

4. **Verify and Enforce HTTPS**:
   - Wait for DNS propagation (~24 hours)
   - Check "Enforce HTTPS"

Example: `https://n8n-workflows.yourdomain.com/`

## Updating the Website

### Update Workflows

```bash
# Extract new workflow data
npm run extract

# Commit changes
git add website/data/workflows.json
git commit -m "Update workflow data"
git push origin main
```

### Update Code

```bash
# Make changes to index.html, styles.css, or app.js
# Test locally
open website/index.html

# Commit and push
git add website/
git commit -m "Update website code"
git push origin main
```

GitHub Pages will automatically redeploy.

## Local Testing Before Deploy

### Test Locally

```bash
# Start local server
python3 -m http.server 8000

# Visit
open http://localhost:8000/website
```

### Test Paths

Ensure all paths work:

- ✅ `data/workflows.json` loads
- ✅ Workflows fetch correctly
- ✅ JSON viewer works
- ✅ Download/copy functions work
- ✅ Search functionality works

## Security

### Protect Secrets

Never commit:

- API keys
- Credentials
- Personal information
- Configuration files with secrets

Use `.gitignore`:

```
.env
.env.local
secrets/
credentials.json
```

### HTTPS

GitHub Pages automatically provides HTTPS for:

- `https://yourusername.github.io/n8n/`
- Custom domains (after setup)

## Rollback

### Revert to Previous Version

```bash
# See commit history
git log --oneline

# Revert to previous commit
git revert COMMIT_HASH

# Push
git push origin main
```

GitHub Pages will automatically redeploy the previous version.

## Analytics

### Add Google Analytics

Add to `website/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_ID");
</script>
```

Replace `GA_ID` with your Google Analytics ID.

## Support & Documentation

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **N8N Docs**: https://docs.n8n.io/

## Summary

| Method   | Setup Time | Maintenance | Recommended          |
| -------- | ---------- | ----------- | -------------------- |
| Option 1 | 5 min      | Minimal     | ✅ Yes               |
| Option 2 | 15 min     | Moderate    | For advanced users   |
| Option 3 | 20 min     | Automatic   | For frequent updates |

---

**Happy Deploying!** 🚀

For questions or issues, check GitHub Pages documentation or create an issue in your repository.
