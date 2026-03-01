# PowerShell script to completely restart the backend
Write-Host "Stopping any running uvicorn processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*python*" -or $_.ProcessName -like "*uvicorn*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "Clearing Python cache..." -ForegroundColor Yellow
if (Test-Path __pycache__) {
    Remove-Item -Recurse -Force __pycache__
    Write-Host "Cleared __pycache__" -ForegroundColor Green
}
Get-ChildItem -Filter "*.pyc" -Recurse | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "`nStarting backend server..." -ForegroundColor Green
Write-Host "Backend will be available at http://localhost:8001" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

uvicorn main:app --reload --port 8001
