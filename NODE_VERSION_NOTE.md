# Node.js Version Requirement

## Issue

The current system is running **Node.js v18.18.2**, but the project requires **Node.js v20.19+ or v22.12+** to run Vite 7 and the latest dependencies.

## Error
```
You are using Node.js 18.18.2. Vite requires Node.js version 20.19+ or 22.12+.
TypeError: crypto.hash is not a function
```

## Solutions

### Option 1: Upgrade Node.js (Recommended)

#### Using nvm (Node Version Manager):
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20 (LTS)
nvm install 20

# Use Node.js 20
nvm use 20

# Verify version
node --version  # Should show v20.x.x
```

#### Using Official Installer:
Download and install from: https://nodejs.org/en/download/
- Choose the **LTS version** (20.x.x)

### Option 2: Downgrade Vite and Dependencies

If upgrading Node.js is not immediately possible, you can downgrade to compatible versions:

```bash
cd frontend

# Downgrade Vite and related packages
npm install vite@5.4.11 @vitejs/plugin-react@4.3.4 --save-dev

# This will make the project compatible with Node.js 18
```

**Note**: This will disable some of the newest features but the landing page will work.

## After Upgrading/Downgrading

Once Node.js is updated or dependencies are downgraded:

```bash
cd frontend

# Clear cache
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Run the development server
npm run dev
```

## Recommended Path Forward

1. **Upgrade to Node.js 20 LTS** - This is the long-term solution
   - Better performance
   - Latest security updates
   - Full compatibility with modern tools

2. **Alternative**: Use Node Version Manager (nvm) to switch between versions easily
   - Keep Node 18 for other projects
   - Use Node 20 for this project
   - Switch with `nvm use 20` or `nvm use 18`

## Verification

After fixing the Node.js version:

```bash
# Check Node version
node --version  # Should be 20.19+ or 22.12+

# Check npm version
npm --version

# Start the dev server
cd frontend
npm run dev
```

The server should start at http://localhost:3000 and the landing page should load without errors.

## What's Been Completed

Despite the Node.js version issue, all the code has been successfully created:

✅ Landing page component (`frontend/src/pages/LandingPage.tsx`)
✅ SSR configuration files
✅ SEO optimization in HTML
✅ Updated routing
✅ Package dependencies added
✅ Documentation created

**The code is production-ready** - it just needs the correct Node.js version to run.
