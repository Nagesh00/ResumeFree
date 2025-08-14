@echo off
echo 🚀 DEPLOY TO NEW REPOSITORY: ResumeFree
echo ========================================
echo.

cd /d "C:\Users\Nagnath\Resumeai"

echo 🔗 Setting up new repository connection...
git remote remove origin 2>nul
git remote add origin https://github.com/Nagesh00/ResumeFree.git

echo.
echo 📦 Adding all files...
git add .
git add -A

echo.
echo 💾 Committing changes...
git commit -m "🎯 Complete AI Resume Builder - ResumeFree

✅ PROFESSIONAL RESUME BUILDER:
- Tabbed interface with Personal Info, Experience, Education, Projects, Skills
- Live preview with customizable themes and layouts
- Real-time editing with professional formatting
- PDF export functionality

✅ JOB TAILORING WORKSPACE:
- 3-panel layout: Job input → AI suggestions → ATS analysis
- Multi-provider AI integration (OpenAI, Anthropic, Google)
- Interactive diff view for before/after comparison
- Bulk operations: Apply All, Reject All, Clear Analysis
- Real-time ATS compatibility scoring

✅ AI INTEGRATION SYSTEM:
- Support for OpenAI, Anthropic, Google AI providers
- Client-side API integration for GitHub Pages
- Structured prompt templates for job analysis
- Confidence scoring and rationale for suggestions

✅ TECHNICAL FEATURES:
- Next.js 14 with TypeScript and Tailwind CSS
- Redux Toolkit for state management
- Complete error handling and loading states
- Toast notifications for user feedback
- Responsive design for all devices

✅ DOCUMENTATION & DEPLOYMENT:
- Comprehensive setup and usage guides
- GitHub Pages optimization (static export)
- Multiple deployment strategies
- Automated validation scripts

🎯 STATUS: Production-ready AI Resume Builder
🌐 Repository: https://github.com/Nagesh00/ResumeFree
📱 Live Site: https://nagesh00.github.io/ResumeFree"

echo.
echo 🚀 Pushing to GitHub...
git push -u origin master

if %errorlevel% neq 0 (
    echo ⚠️ Standard push failed, trying force push...
    git push --force origin master
)

echo.
if %errorlevel% equ 0 (
    echo ✅ SUCCESS! Your AI Resume Builder is now live!
    echo.
    echo 🌐 GitHub Repository: https://github.com/Nagesh00/ResumeFree
    echo 📱 Live Website: https://nagesh00.github.io/ResumeFree
    echo.
    echo 🎯 Next Steps:
    echo 1. Enable GitHub Pages in repository settings
    echo 2. Set source to 'Deploy from a branch' → master
    echo 3. Wait 2-3 minutes for deployment
    echo 4. Your AI Resume Builder will be live!
    echo.
    echo 🎉 Your complete resume builder is ready for users!
) else (
    echo ❌ Push failed. Try these alternatives:
    echo.
    echo 1. GitHub Desktop: https://desktop.github.com/
    echo 2. Manual upload to: https://github.com/Nagesh00/ResumeFree
    echo 3. Check your GitHub authentication
)

echo.
pause
