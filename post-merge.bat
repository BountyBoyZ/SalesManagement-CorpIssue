@echo off

@REM Decompressing site_packages.tar

for %%F in (%cd%) do set projectname=%%~nF

if not exist R:\SitePackages\%projectname%\site-packages goto afterpullsite
echo.
echo pulling site-packages
xcopy R:\SitePackages\%projectname%\site-packages .\venv\Lib\site-packages  /y /d /s /i
goto success

:afterpullsite
echo. 
echo cannot find the site-packages on the offile repository

:success
exit /b 0