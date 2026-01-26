# PowerShell Script to Fix Netlify Submodule Error
# This script helps you fix the broken submodule in your GitHub repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Netlify Submodule Fix Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$repoUrl = "https://github.com/gosag/movie-project"
Write-Host "Repository: $repoUrl" -ForegroundColor Yellow
Write-Host ""

# Check if we're in a git repository
$isGitRepo = Test-Path .git

if (-not $isGitRepo) {
    Write-Host "⚠️  This directory is not a Git repository." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You have two options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OPTION 1: Fix directly on GitHub (Easiest)" -ForegroundColor Green
    Write-Host "  1. Go to: $repoUrl" -ForegroundColor White
    Write-Host "  2. Find the .gitmodules file in the root"
    Write-Host "  3. Click 'Delete file' or edit it to remove the movie-project entry"
    Write-Host "  4. Commit the change"
    Write-Host "  5. Redeploy on Netlify"
    Write-Host ""
    Write-Host "OPTION 2: Clone and fix locally" -ForegroundColor Green
    Write-Host "  Would you like to clone the repo and fix it now? (y/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host ""
        Write-Host "Cloning repository..." -ForegroundColor Cyan
        $clonePath = Join-Path $PSScriptRoot "movie-project-clone"
        
        if (Test-Path $clonePath) {
            Write-Host "⚠️  Directory $clonePath already exists. Removing..." -ForegroundColor Yellow
            Remove-Item -Recurse -Force $clonePath
        }
        
        git clone $repoUrl $clonePath
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to clone repository. Please check your Git credentials." -ForegroundColor Red
            exit 1
        }
        
        Set-Location $clonePath
        Write-Host "✓ Repository cloned to: $clonePath" -ForegroundColor Green
        Write-Host ""
        
        # Now fix the submodule
        Write-Host "Fixing submodule issue..." -ForegroundColor Cyan
        
        # Remove submodule from index
        git rm --cached movie-project 2>$null
        Write-Host "  ✓ Removed movie-project from index" -ForegroundColor Gray
        
        # Fix .gitmodules
        if (Test-Path .gitmodules) {
            $content = Get-Content .gitmodules -Raw
            if ($content -match "movie-project") {
                Write-Host "  ⚠️  Found .gitmodules with movie-project entry" -ForegroundColor Yellow
                
                # Remove the movie-project section
                $lines = Get-Content .gitmodules
                $newLines = @()
                $skipSection = $false
                
                foreach ($line in $lines) {
                    if ($line -match '\[submodule\s+["'']?movie-project["'']?\]') {
                        $skipSection = $true
                        continue
                    }
                    if ($skipSection -and ($line -match "^\s*path\s*=" -or $line -match "^\s*url\s*=" -or ($line -match "^\s*$" -and $newLines.Count -gt 0))) {
                        if ($line -match "^\s*$") {
                            $skipSection = $false
                        }
                        continue
                    }
                    if (-not $skipSection) {
                        $newLines += $line
                    }
                }
                
                if ($newLines.Count -eq 0 -or ($newLines.Count -eq 1 -and $newLines[0] -eq "")) {
                    Remove-Item .gitmodules
                    git rm .gitmodules
                    Write-Host "  ✓ Deleted empty .gitmodules file" -ForegroundColor Green
                } else {
                    $newLines | Set-Content .gitmodules
                    git add .gitmodules
                    Write-Host "  ✓ Fixed .gitmodules file" -ForegroundColor Green
                }
            } else {
                Write-Host "  ℹ️  .gitmodules doesn't contain movie-project" -ForegroundColor Gray
            }
        } else {
            Write-Host "  ℹ️  No .gitmodules file found" -ForegroundColor Gray
            # Create empty one to ensure clean state
            "" | Out-File .gitmodules -Encoding UTF8
            git add .gitmodules
            Write-Host "  ✓ Created empty .gitmodules" -ForegroundColor Green
        }
        
        # Clean up metadata
        git config -f .git/config --remove-section submodule.movie-project 2>$null
        Remove-Item -Recurse -Force .git/modules/movie-project -ErrorAction SilentlyContinue
        
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "  Ready to commit and push!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Review changes:" -ForegroundColor Yellow
        Write-Host "  git status" -ForegroundColor White
        Write-Host ""
        Write-Host "Commit the fix:" -ForegroundColor Yellow
        Write-Host "  git commit -m 'Fix: Remove broken submodule entry'" -ForegroundColor White
        Write-Host ""
        Write-Host "Push to GitHub:" -ForegroundColor Yellow
        Write-Host "  git push" -ForegroundColor White
        Write-Host ""
        Write-Host "Then redeploy on Netlify!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "To fix on GitHub:" -ForegroundColor Cyan
        Write-Host "1. Visit: $repoUrl" -ForegroundColor White
        Write-Host "2. Delete or edit .gitmodules file" -ForegroundColor White
        Write-Host "3. Commit the change" -ForegroundColor White
        Write-Host "4. Redeploy on Netlify" -ForegroundColor White
    }
} else {
    Write-Host "✓ Git repository detected" -ForegroundColor Green
    Write-Host ""
    Write-Host "Fixing submodule issue..." -ForegroundColor Cyan
    
    # Remove submodule from index
    git rm --cached movie-project 2>$null
    Write-Host "  ✓ Removed movie-project from index" -ForegroundColor Gray
    
    # Fix .gitmodules
    if (Test-Path .gitmodules) {
        $content = Get-Content .gitmodules -Raw
        if ($content -match "movie-project") {
            Write-Host "  ⚠️  Found .gitmodules with movie-project entry" -ForegroundColor Yellow
            
            # Remove the movie-project section
            $lines = Get-Content .gitmodules
            $newLines = @()
            $skipSection = $false
            
            foreach ($line in $lines) {
                if ($line -match '\[submodule\s+["'']?movie-project["'']?\]') {
                    $skipSection = $true
                    continue
                }
                if ($skipSection -and ($line -match "^\s*path\s*=" -or $line -match "^\s*url\s*=" -or ($line -match "^\s*$" -and $newLines.Count -gt 0))) {
                    if ($line -match "^\s*$") {
                        $skipSection = $false
                    }
                    continue
                }
                if (-not $skipSection) {
                    $newLines += $line
                }
            }
            
            if ($newLines.Count -eq 0 -or ($newLines.Count -eq 1 -and $newLines[0] -eq "")) {
                Remove-Item .gitmodules
                git rm .gitmodules
                Write-Host "  ✓ Deleted empty .gitmodules file" -ForegroundColor Green
            } else {
                $newLines | Set-Content .gitmodules
                git add .gitmodules
                Write-Host "  ✓ Fixed .gitmodules file" -ForegroundColor Green
            }
        }
    }
    
    # Clean up metadata
    git config -f .git/config --remove-section submodule.movie-project 2>$null
    Remove-Item -Recurse -Force .git/modules/movie-project -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Fix completed!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Review: git status" -ForegroundColor White
    Write-Host "2. Commit: git commit -m 'Fix: Remove broken submodule entry'" -ForegroundColor White
    Write-Host "3. Push: git push" -ForegroundColor White
    Write-Host "4. Redeploy on Netlify!" -ForegroundColor Green
}
