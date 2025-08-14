@echo off
echo 🔍 Git Diagnostic Tool
echo =====================
echo.

cd /d "C:\Users\Nagnath\Resumeai"

echo 📂 Current Directory:
cd

echo.
echo 🔧 Git Version:
git --version

echo.
echo 📋 Git Status:
git status

echo.
echo 🌐 Git Remote:
git remote -v

echo.
echo 📊 Recent Commits:
git log --oneline -5

echo.
echo 🔍 Git Configuration:
git config --global user.name
git config --global user.email

echo.
echo 📁 Local Files (should show all our new files):
dir /b *.md

echo.
echo 🎯 DIAGNOSIS COMPLETE
echo If you see files locally but not on GitHub, your push isn't working.
echo.
pause
