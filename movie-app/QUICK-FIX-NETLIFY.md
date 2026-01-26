# Quick Fix for Netlify Submodule Error

## The Problem
Your GitHub repository has a broken `.gitmodules` file that references `movie-project` without a URL, causing Netlify to fail.

## Easiest Solution: Fix on GitHub (No Local Git Needed)

### Step 1: Go to Your GitHub Repository
1. Open: `https://github.com/gosag/movie-project`
2. Navigate to the `.gitmodules` file (it should be in the root)

### Step 2: Delete or Fix the File

**Option A - Delete the file (if you don't need submodules):**
1. Click on `.gitmodules`
2. Click the trash icon (Delete file)
3. Commit with message: "Remove broken submodule configuration"
4. Click "Commit changes"

**Option B - Fix the file (if you need submodules later):**
1. Click on `.gitmodules`
2. Click the pencil icon (Edit)
3. Remove the entire `[submodule "movie-project"]` section
4. If the file becomes empty, delete it instead
5. Commit with message: "Fix: Remove broken movie-project submodule entry"

### Step 3: Redeploy on Netlify
1. Go to your Netlify dashboard
2. Click "Trigger deploy" → "Deploy site"
3. The build should now succeed!

---

## Alternative: Fix Using Git Commands

If you prefer to fix it locally, follow these steps:

### Step 1: Clone Your Repository
```bash
git clone https://github.com/gosag/movie-project.git
cd movie-project
```

### Step 2: Remove the Broken Submodule
```bash
# Remove submodule from Git
git rm --cached movie-project 2>/dev/null || true

# Remove or fix .gitmodules
if [ -f .gitmodules ]; then
    # Remove the movie-project section
    sed -i.bak '/\[submodule "movie-project"\]/,/^$/d' .gitmodules
    # If file is now empty, delete it
    if [ ! -s .gitmodules ]; then
        git rm .gitmodules
    else
        git add .gitmodules
    fi
else
    # Create empty file to override remote
    touch .gitmodules
    git add .gitmodules
fi

# Clean up metadata
git config -f .git/config --remove-section submodule.movie-project 2>/dev/null || true
rm -rf .git/modules/movie-project 2>/dev/null || true
```

### Step 3: Commit and Push
```bash
git commit -m "Fix: Remove broken submodule entry"
git push
```

### Step 4: Redeploy on Netlify
The build should now work!

---

## Verify the Fix

After fixing, verify:
1. Go to: `https://github.com/gosag/movie-project/blob/main/.gitmodules`
2. Either the file should be deleted, OR
3. It should NOT contain `[submodule "movie-project"]` without a URL

---

## Why This Happened

Someone (or a tool) accidentally added a submodule entry without specifying the URL. This is a common mistake when:
- Copying Git configurations
- Using Git commands incorrectly
- Accidentally staging submodule metadata

The fix is simple: remove the broken entry!
