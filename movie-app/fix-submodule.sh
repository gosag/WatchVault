#!/bin/bash
# Fix Netlify Submodule Error Script
# This script removes the broken submodule entry that's causing Netlify deployment to fail

echo -e "\033[0;36mFixing broken Git submodule configuration...\033[0m"

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "\033[0;31mError: Not a Git repository. Please run this script from your project root.\033[0m"
    exit 1
fi

# Step 1: Remove submodule from index (if it exists)
echo -e "\n\033[0;33mStep 1: Removing submodule from Git index...\033[0m"
git rm --cached movie-project 2>/dev/null && echo -e "  \033[0;32m✓ Removed movie-project from index\033[0m" || echo -e "  \033[0;90mℹ movie-project not in index (may already be removed)\033[0m"

# Step 2: Remove .gitmodules file if it exists and is broken
echo -e "\n\033[0;33mStep 2: Checking .gitmodules file...\033[0m"
if [ -f .gitmodules ]; then
    if grep -q "movie-project" .gitmodules && ! grep -q "url\s*=" .gitmodules; then
        echo -e "  \033[0;33m⚠ Found broken .gitmodules entry\033[0m"
        # Remove lines related to movie-project submodule
        sed -i.bak '/\[submodule "movie-project"\]/,/^$/d' .gitmodules
        # Remove backup file
        rm -f .gitmodules.bak
        # If file is now empty, remove it
        if [ ! -s .gitmodules ]; then
            rm .gitmodules
            echo -e "  \033[0;32m✓ Removed empty .gitmodules file\033[0m"
        else
            echo -e "  \033[0;32m✓ Fixed .gitmodules file\033[0m"
        fi
    else
        echo -e "  \033[0;90mℹ .gitmodules exists but doesn't have broken entry\033[0m"
    fi
else
    echo -e "  \033[0;90mℹ .gitmodules file doesn't exist locally\033[0m"
    echo -e "  \033[0;33m→ Creating empty .gitmodules to override remote version...\033[0m"
    touch .gitmodules
    git add .gitmodules
    echo -e "  \033[0;32m✓ Created empty .gitmodules\033[0m"
fi

# Step 3: Remove local submodule directory if it exists
echo -e "\n\033[0;33mStep 3: Checking for local submodule directory...\033[0m"
if [ -d movie-project ]; then
    echo -e "  \033[0;33m⚠ Found movie-project directory\033[0m"
    read -p "  Do you want to remove it? (y/N): " response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf movie-project
        echo -e "  \033[0;32m✓ Removed movie-project directory\033[0m"
    else
        echo -e "  \033[0;90mℹ Keeping movie-project directory\033[0m"
    fi
else
    echo -e "  \033[0;90mℹ No local movie-project directory found\033[0m"
fi

# Step 4: Clean up Git submodule metadata
echo -e "\n\033[0;33mStep 4: Cleaning up Git submodule metadata...\033[0m"
git config -f .git/config --remove-section submodule.movie-project 2>/dev/null && echo -e "  \033[0;32m✓ Removed submodule config\033[0m" || echo -e "  \033[0;90mℹ No submodule config found\033[0m"

if [ -d .git/modules/movie-project ]; then
    rm -rf .git/modules/movie-project
    echo -e "  \033[0;32m✓ Removed submodule metadata directory\033[0m"
else
    echo -e "  \033[0;90mℹ No submodule metadata directory found\033[0m"
fi

# Step 5: Stage changes
echo -e "\n\033[0;33mStep 5: Staging changes...\033[0m"
git add .gitmodules 2>/dev/null
git add -A
echo -e "  \033[0;32m✓ Changes staged\033[0m"

# Summary
echo -e "\n\033[0;36m============================================================\033[0m"
echo -e "\033[0;32mFix completed!\033[0m"
echo -e "\033[0;36m============================================================\033[0m"
echo -e "\n\033[0;33mNext steps:\033[0m"
echo -e "1. Review the changes: \033[0;37mgit status\033[0m"
echo -e "2. Commit the fix: \033[0;37mgit commit -m 'Fix: Remove broken submodule entry'\033[0m"
echo -e "3. Push to remote: \033[0;37mgit push\033[0m"
echo -e "\n\033[0;32mAfter pushing, Netlify should be able to build successfully!\033[0m"
