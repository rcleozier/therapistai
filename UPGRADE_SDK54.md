# Upgrading to Expo SDK 54

## ⚠️ Important: Node.js Version Requirement

**Expo SDK 54 requires Node.js >= 20.19.4**

Your current Node.js version is 18.19.0. You must upgrade Node.js before completing the upgrade.

## Steps to Complete the Upgrade

### 1. Upgrade Node.js

**Using nvm (recommended):**
```bash
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js 20
nvm install 20
nvm use 20
```

**Or download from nodejs.org:**
- Visit https://nodejs.org/
- Download and install Node.js 20.x LTS

**Verify installation:**
```bash
node --version
# Should show v20.x.x or higher
```

### 2. Install Dependencies

After upgrading Node.js, run:

```bash
# Remove old lock files (you have both yarn.lock and package-lock.json)
rm yarn.lock package-lock.json

# Install dependencies
npm install

# Fix any remaining version mismatches
npx expo install --fix
```

### 3. Update Native Projects

**For iOS:**
```bash
cd ios
pod install
cd ..
```

**For Android:**
- The Android project will be regenerated on next build if using Continuous Native Generation

### 4. Clear Cache and Rebuild

```bash
# Clear Metro bundler cache
npx expo start -c

# Or clear everything
rm -rf node_modules
npm install
```

## What Changed in SDK 54

- **React Native 0.81.5** (upgraded from 0.79.5)
- **React 19.1.0** (upgraded from 19.0.0)
- **Precompiled React Native for iOS** - Faster iOS builds
- **All Expo packages updated** to SDK 54 compatible versions

## Breaking Changes to Watch For

1. **react-native-reanimated** upgraded from v3 to v4 - May require code updates
2. **expo-av** upgraded from v15 to v16 - Check audio playback code
3. **expo-notifications** upgraded from v0.31 to v0.32 - Verify notification setup
4. **@sentry/react-native** upgraded from v6 to v7 - May require Sentry config updates

## After Upgrade

1. Test all features, especially:
   - Audio playback
   - Notifications
   - Haptic feedback
   - Navigation

2. Build a new development client:
   ```bash
   npx eas build --profile development --platform ios
   ```

3. Test on device to ensure everything works

## Rollback (if needed)

If you encounter issues, you can rollback:
```bash
git checkout package.json
npm install
```




