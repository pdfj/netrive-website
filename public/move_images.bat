@echo off
set DOWNLOADS=C:\Users\malga\Downloads
set PORTFOLIO=%DOWNLOADS%\netrive-website\public\images\portfolio
set BLOG=%DOWNLOADS%\netrive-website\public\images\blog

if exist "%DOWNLOADS%\apex-digital.jpg" move "%DOWNLOADS%\apex-digital.jpg" "%PORTFOLIO%\apex-digital.jpg"
if exist "%DOWNLOADS%\coastal-brands.jpg" move "%DOWNLOADS%\coastal-brands.jpg" "%PORTFOLIO%\coastal-brands.jpg"
if exist "%DOWNLOADS%\meridian-properties.jpg" move "%DOWNLOADS%\meridian-properties.jpg" "%PORTFOLIO%\meridian-properties.jpg"
if exist "%DOWNLOADS%\summit-health.jpg" move "%DOWNLOADS%\summit-health.jpg" "%PORTFOLIO%\summit-health.jpg"
if exist "%DOWNLOADS%\why-website.jpg" move "%DOWNLOADS%\why-website.jpg" "%BLOG%\why-website.jpg"
if exist "%DOWNLOADS%\choose-package.jpg" move "%DOWNLOADS%\choose-package.jpg" "%BLOG%\choose-package.jpg"
if exist "%DOWNLOADS%\seo-south-africa.jpg" move "%DOWNLOADS%\seo-south-africa.jpg" "%BLOG%\seo-south-africa.jpg"
if exist "%DOWNLOADS%\fast-websites.jpg" move "%DOWNLOADS%\fast-websites.jpg" "%BLOG%\fast-websites.jpg"
if exist "%DOWNLOADS%\web-agency.jpg" move "%DOWNLOADS%\web-agency.jpg" "%BLOG%\web-agency.jpg"
if exist "%DOWNLOADS%\ecommerce-vs-landing.jpg" move "%DOWNLOADS%\ecommerce-vs-landing.jpg" "%BLOG%\ecommerce-vs-landing.jpg"
echo Done! All images moved.
pause
