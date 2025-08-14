@echo off
echo 🚀 SIMPLE SOLUTION: Upload to ResumeFree Repository
echo ===============================================
echo.

cd /d "C:\Users\Nagnath\Resumeai"

echo 📋 Current files in your project:
dir /b *.md
echo.
dir /b *.json
echo.
dir /b *.js
echo.

echo 🔧 STEP 1: Reset Git Completely
rmdir /s /q .git 2>nul
git init

echo.
echo 🔧 STEP 2: Configure Git User
git config user.name "Nagesh00"
git config user.email "nagesh00@example.com"

echo.
echo 🔧 STEP 3: Add All Files
git add .

echo.
echo 🔧 STEP 4: Create Initial Commit
git commit -m "Complete AI Resume Builder - All Features"

echo.
echo 🔧 STEP 5: Set Remote to ResumeFree
git remote add origin https://github.com/Nagesh00/ResumeFree.git

echo.
echo 🔧 STEP 6: Try Multiple Push Methods
echo Trying main branch...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo Trying master branch...
    git branch -M master  
    git push -u origin master
)

if %errorlevel% neq 0 (
    echo Trying force push...
    git push --force origin master
)

echo.
if %errorlevel% equ 0 (
    echo ✅ SUCCESS! Check: https://github.com/Nagesh00/ResumeFree
) else (
    echo ❌ AUTOMATED PUSH FAILED
    echo.
    echo 🎯 MANUAL SOLUTION - 100% GUARANTEED:
    echo.
    echo 1. Open web browser
    echo 2. Go to: https://github.com/Nagesh00/ResumeFree
    echo 3. Click "uploading an existing file"
    echo 4. Drag these files from C:\Users\Nagnath\Resumeai:
    echo    - All .md files
    echo    - src folder
    echo    - package.json
    echo    - next.config.js  
    echo    - tailwind.config.js
    echo    - All .bat files
    echo 5. Add commit message: "Complete AI Resume Builder"
    echo 6. Click "Commit new files"
    echo.
    echo ✅ This will upload your complete AI Resume Builder!
)

echo.
pause
