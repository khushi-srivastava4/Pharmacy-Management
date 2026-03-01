# Force restart backend server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESTARTING BACKEND SERVER" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Kill all Python processes
Write-Host "`n[1/4] Stopping all Python processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Step 2: Clear cache
Write-Host "[2/4] Clearing Python cache..." -ForegroundColor Yellow
if (Test-Path __pycache__) {
    Remove-Item -Recurse -Force __pycache__
    Write-Host "   Cache cleared!" -ForegroundColor Green
} else {
    Write-Host "   No cache found" -ForegroundColor Gray
}

# Step 3: Verify schema
Write-Host "[3/4] Verifying schema..." -ForegroundColor Yellow
python -c "from schemas import MedicineCreate; import json; s = MedicineCreate.model_json_schema(); print('   Required fields:', s.get('required', [])); print('   Properties:', list(s.get('properties', {}).keys()))"
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Schema is correct!" -ForegroundColor Green
} else {
    Write-Host "   ERROR: Schema check failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Start server
Write-Host "[4/4] Starting backend server..." -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Server starting on http://localhost:8001" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

uvicorn main:app --reload --port 8001
