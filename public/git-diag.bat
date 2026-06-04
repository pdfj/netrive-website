@echo off
cd /d "C:\Users\malga\Downloads\netrive-website"
echo === GIT STATUS === > "C:\Users\malga\Downloads\netrive-website\public\git-log.txt"
git status >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt" 2>&1
echo === GIT LOG === >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt"
git log --oneline -3 >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt" 2>&1
echo === GIT REMOTE === >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt"
git remote -v >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt" 2>&1
echo === GIT PUSH TEST === >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt"
git push -u origin main >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt" 2>&1
echo Exit code: %errorlevel% >> "C:\Users\malga\Downloads\netrive-website\public\git-log.txt"
echo Done. Log saved.
pause
