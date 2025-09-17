@echo off
echo This script will open PowerShell with administrator privileges to enable script execution
echo for npm commands.

powershell -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command ""Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; Write-Host \"Execution policy has been set to RemoteSigned for the current user.\" -ForegroundColor Green; pause""' -Verb RunAs"

echo After running the elevated PowerShell window and accepting the prompt,
echo you should be able to run npm commands.
echo.
echo Press any key to exit...
pause > nul