# Build and Deployment Fix for ResumeAI

## Issue: GitHub Pages Deployment Failing

The deployment is failing because:
1. **API Routes Conflict**: Static export mode conflicts with API routes
2. **Missing Environment Variables**: Build needs proper env configuration
3. **Dependency Issues**: Some packages might have build conflicts

## Quick Fixes Applied:

### 1. Fixed next.config.js
- Disabled static export mode to allow API routes
- Removed conflicting output settings
- Maintained PDF.js webpack configuration

### 2. Environment Configuration
Create `.env.local` with at least:
```
OPENAI_API_KEY=your_key_here
# Add other API keys as needed
```

### 3. Alternative Deployment Options

#### Option A: Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Option B: Deploy to Netlify
- Connect your GitHub repo to Netlify
- Set build command: `npm run build`
- Set publish directory: `.next`

#### Option C: Keep GitHub Pages (Static Only)
If you want to use GitHub Pages, you need to:
1. Remove all API routes from `src/app/api/`
2. Use client-side only AI integration
3. Re-enable static export in next.config.js

## Build Commands to Test Locally:

```bash
# Check for TypeScript errors
npm run type-check

# Test build locally
npm run build

# Test production build
npm run start
```

## GitHub Actions Workflow Fix

If using GitHub Actions, update `.github/workflows/` with:
- Node.js version 18 or higher
- Proper environment variables
- Build caching for faster deploys

## Recommended Solution:

**Deploy to Vercel instead of GitHub Pages** because:
- ✅ Supports API routes natively
- ✅ Environment variable management
- ✅ Better Next.js integration
- ✅ Automatic deployments from GitHub
- ✅ Free tier available

The ResumeAI app with job tailoring features needs server-side API routes to work properly, which GitHub Pages cannot provide.
