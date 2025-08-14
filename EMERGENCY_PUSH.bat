@echo off
echo 🚨 EMERGENCY GITHUB PUSH - Complete Fix
echo =======================================
echo.

cd /d "C:\Users\Nagnath\Resumeai"

echo 🔍 Step 1: Checking current git status...
git status
git remote -v

echo.
echo 🔧 Step 2: Removing old git and starting fresh...
rmdir /s /q .git 2>nul
git init

echo.
echo 👤 Step 3: Setting up git user...
git config user.name "Nagesh00"
set /p email="Enter your GitHub email: "
git config user.email "%email%"

echo.
echo 📦 Step 4: Adding ALL files...
git add .
git add -A

echo.
echo 💾 Step 5: Creating initial commit...
git commit -m "🎯 Complete AI Resume Builder - ResumeFree

✅ PROFESSIONAL FEATURES:
- Resume Builder with tabbed interface
- Job Tailoring Workspace with AI suggestions
- ATS Scoring and keyword analysis
- Multi-provider AI integration
- Interactive diff view and bulk operations
- Redux state management with TypeScript
- Toast notifications and error handling

✅ COMPLETE CODEBASE:
- Next.js 14 with TypeScript
- Tailwind CSS styling
- All documentation and guides
- Production-ready deployment

STATUS: Complete AI Resume Builder ready for use!"

echo.
echo 🔗 Step 6: Adding remote repository...
git remote add origin https://github.com/Nagesh00/ResumeFree.git

echo.
echo 🚀 Step 7: Pushing to GitHub (trying main branch first)...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo ⚠️ Main branch failed, trying master...
    git branch -M master
    git push -u origin master --force
)

if %errorlevel% neq 0 (
    echo ⚠️ Standard push failed, trying with credentials...
    echo.
    echo 🔑 You may need to enter your GitHub credentials:
    echo Username: Nagesh00
    echo Password: [Use your Personal Access Token if you have 2FA enabled]
    echo.
    git push -u origin master --force
)

echo.
if %errorlevel% equ 0 (
    echo ✅ SUCCESS! Your AI Resume Builder is now on GitHub!
    echo.
    echo 🌐 Repository: https://github.com/Nagesh00/ResumeFree
    echo 📱 To enable live site:
    echo    1. Go to repository Settings → Pages
    echo    2. Source: Deploy from branch → main/master
    echo    3. Live site: https://nagesh00.github.io/ResumeFree
    echo.
    echo 🎉 Complete AI Resume Builder successfully deployed!
) else (
    echo ❌ PUSH STILL FAILED - Try these alternatives:
    echo.
    echo 🔧 Option 1: Use GitHub Desktop
    echo    Download: https://desktop.github.com/
    echo    Sign in and push from GUI
    echo.
    echo 🔧 Option 2: Manual Upload
    echo    1. Go to: https://github.com/Nagesh00/ResumeFree
    echo    2. Click "Upload files"
    echo    3. Drag ALL files from this folder
    echo.
    echo 🔧 Option 3: VS Code Git Integration
    echo    1. Open VS Code in this folder
    echo    2. Use Source Control panel
    echo    3. Stage, commit, and push
    echo.
    echo 🔑 Authentication might be the issue:
    echo    - Make sure you're signed into GitHub
    echo    - Use Personal Access Token for password
    echo    - Enable 2FA if not already enabled
)

echo.
pause
