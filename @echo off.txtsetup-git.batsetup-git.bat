@echo off
cd /d "C:\Users\malga\Downloads\netrive-website"
git init
git add .
git commit -m "Initial commit: Netrive website"
git branch -M main
git remote add origin https://github.com/pdfj/netrive-website.git
git push -u origin main
pause