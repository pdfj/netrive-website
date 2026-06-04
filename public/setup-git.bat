@echo off
cd /d "C:\Users\malga\Downloads\netrive-website"
git config --global user.email "bushilah001@gmail.com"
git config --global user.name "pdfj"
git init
git remote remove origin 2>nul
git remote add origin https://github.com/pdfj/netrive-website.git
git add .
git commit -m "Initial commit: Netrive website"
git branch -M main
git push -u origin main
pause
