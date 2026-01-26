# Fix Netlify Submodule Error Script
# This script removes the broken submodule entry that's causing Netlify deployment to fail

Write-Host "Fixing broken Git submodule configuration..." -ForegroundColor Cyan

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "Error: Not a Git repository. Please run this script from your project root." -ForegroundColor Red
    exit 1
}

# Step 1: Remove submodule from index (if it exists)
Write-Host "`nStep 1: Removing submodule from Git index..." -ForegroundColor Yellow
git rm --cached movie-project 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Removed movie-project from index" -ForegroundColor Green
} else {
    Write-Host "  ℹ movie-project not in index (may already be removed)" -ForegroundColor Gray
}

# Step 2: Remove .gitmodules file if it exists and is broken
Write-Host "`nStep 2: Checking .gitmodules file..." -ForegroundColor Yellow
if (Test-Path .gitmodules) {
    $content = Get-Content .gitmodules -Raw
    if ($content -match "movie-project" -and $content -notmatch "url\s*=") {
        Write-Host "  ⚠ Found broken .gitmodules entry" -ForegroundColor Yellow
        # Remove the broken entry
        $lines = Get-Content .gitmodules
        $newLines = @()
        $skipNext = $false
        foreach ($line in $lines) {
            if ($line -match "\[submodule\s+[\"']?movie-project[\"']?\]") {
                $skipNext = $true
                continue
            }
            if ($skipNext -and ($line -match "^\s*path\s*=" -or $line -match "^\s*$")) {
                if ($line -match "^\s*$") {
                    $skipNext = $false
                }
                continue
            }
            if ($skipNext -and $line -notmatch "^\s*path\s*=") {
                $skipNext = $false
            }
            if (-not $skipNext) {
                $newLines += $line
            }
        }
        if ($newLines.Count -eq 0 -or ($newLines.Count -eq 1 -and $newLines[0] -eq "")) {
            Remove-Item .gitmodules
            Write-Host "  ✓ Removed empty .gitmodules file" -ForegroundColor Green
        } else {
            $newLines | Set-Content .gitmodules
            Write-Host "  ✓ Fixed .gitmodules file" -ForegroundColor Green
        }
    } else {
        Write-Host "  ℹ .gitmodules exists but doesn't have broken entry" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ .gitmodules file doesn't exist locally" -ForegroundColor Gray
    Write-Host "  → Creating empty .gitmodules to override remote version..." -ForegroundColor Yellow
    # Create empty file to override remote
    "" | Out-File .gitmodules -Encoding UTF8
    git add .gitmodules
    Write-Host "  ✓ Created empty .gitmodules" -ForegroundColor Green
}

# Step 3: Remove local submodule directory if it exists
Write-Host "`nStep 3: Checking for local submodule directory..." -ForegroundColor Yellow
if (Test-Path movie-project) {
    Write-Host "  ⚠ Found movie-project directory" -ForegroundColor Yellow
    $response = Read-Host "  Do you want to remove it? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Remove-Item -Recurse -Force movie-project
        Write-Host "  ✓ Removed movie-project directory" -ForegroundColor Green
    } else {
        Write-Host "  ℹ Keeping movie-project directory" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ No local movie-project directory found" -ForegroundColor Gray
}

# Step 4: Clean up Git submodule metadata
Write-Host "`nStep 4: Cleaning up Git submodule metadata..." -ForegroundColor Yellow
git config -f .git/config --remove-section submodule.movie-project 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Removed submodule config" -ForegroundColor Green
} else {
    Write-Host "  ℹ No submodule config found" -ForegroundColor Gray
}

if (Test-Path .git/modules/movie-project) {
    Remove-Item -Recurse -Force .git/modules/movie-project
    Write-Host "  ✓ Removed submodule metadata directory" -ForegroundColor Green
} else {
    Write-Host "  ℹ No submodule metadata directory found" -ForegroundColor Gray
}

# Step 5: Stage changes
Write-Host "`nStep 5: Staging changes..." -ForegroundColor Yellow
git add .gitmodules 2>$null
git add -A
Write-Host "  ✓ Changes staged" -ForegroundColor Green

# Summary
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "Fix completed!" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes: git status" -ForegroundColor White
Write-Host "2. Commit the fix: git commit -m 'Fix: Remove broken submodule entry'" -ForegroundColor White
Write-Host "3. Push to remote: git push" -ForegroundColor White
Write-Host "`nAfter pushing, Netlify should be able to build successfully!" -ForegroundColor Green
