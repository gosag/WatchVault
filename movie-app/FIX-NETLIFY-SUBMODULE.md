# Fix Netlify Submodule Error

## Problem
Netlify deployment is failing with:
```
Error checking out submodules: fatal: No url found for submodule path 'movie-project' in .gitmodules
```

This happens because there's a broken submodule entry in your Git repository.

## Quick Fix (Choose One Method)

### Method 1: Using the Fix Scripts (Recommended)

#### For Windows (PowerShell):
```powershell
.\fix-submodule.ps1
```

#### For Mac/Linux (Bash):
```bash
chmod +x fix-submodule.sh
./fix-submodule.sh
```

### Method 2: Manual Fix (Step by Step)

#### Step 1: Remove submodule from Git index
```bash
git rm --cached movie-project
```

#### Step 2: Fix or remove .gitmodules
If `.gitmodules` exists and has a broken entry, either:

**Option A:** Delete the entire file (if you don't need any submodules):
```bash
git rm .gitmodules
```

**Option B:** Edit `.gitmodules` and remove the `[submodule "movie-project"]` section:
```bash
# Open .gitmodules and remove the movie-project section
# Then stage it:
git add .gitmodules
```

**Option C:** Create an empty `.gitmodules` to override the remote:
```bash
touch .gitmodules
git add .gitmodules
```

#### Step 3: Remove local submodule directory (if it exists)
```bash
rm -rf movie-project
```

#### Step 4: Clean up Git metadata
```bash
git config -f .git/config --remove-section submodule.movie-project
rm -rf .git/modules/movie-project
```

#### Step 5: Commit and push
```bash
git add -A
git commit -m "Fix: Remove broken submodule entry"
git push
```

## After Fixing

1. **Verify the fix:**
   ```bash
   git status
   # Should show .gitmodules changes or removal
   ```

2. **Push to GitHub:**
   ```bash
   git push
   ```

3. **Redeploy on Netlify:**
   - Go to your Netlify dashboard
   - Trigger a new deployment
   - The build should now succeed!

## Verification

After pushing, check that:
- ✅ `.gitmodules` is either removed or doesn't contain `movie-project`
- ✅ No `movie-project` directory in your repo (unless you need it)
- ✅ Git status is clean

## Still Having Issues?

If the problem persists:
1. Check your GitHub repository directly: `https://github.com/gosag/movie-project`
2. Verify `.gitmodules` is not in the remote repository
3. Try deleting and re-adding your Netlify site connection
