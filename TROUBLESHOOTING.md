# Troubleshooting: App Not Running on iPhone

## Main Issue
Your app uses `expo-dev-client`, which means it requires a **custom development build**, not Expo Go.

## Solution Options

### Option 1: Build Development Client (Recommended)
1. **Build a development client for your iPhone:**
   ```bash
   npx eas build --profile development --platform ios
   ```
   
2. **Install the build on your iPhone:**
   - Download from EAS Build dashboard
   - Or use TestFlight if configured
   - Or install via Xcode if building locally

3. **Start the development server:**
   ```bash
   npm start
   # or
   npx expo start --dev-client
   ```

4. **Connect your iPhone:**
   - Make sure iPhone and computer are on same WiFi
   - Scan QR code with Camera app (if using tunnel)
   - Or enter the URL manually in the development client

### Option 2: Use Expo Go (Quick Test - Limited)
If you want to test quickly without building, you can temporarily modify the start script:

1. **Change package.json start script:**
   ```json
   "start": "expo start"
   ```
   (Remove `--dev-client` flag)

2. **Note:** This may not work if you have native dependencies that aren't compatible with Expo Go.

### Option 3: Local iOS Build
If you have Xcode installed:

```bash
npx expo run:ios
```

This will build and run directly on your connected iPhone.

## Common Issues

### 1. "Unable to connect to development server"
- Ensure iPhone and computer are on the same WiFi network
- Try using tunnel: `npx expo start --tunnel`
- Check firewall settings

### 2. "No development build found"
- You need to build a development client first (see Option 1)
- Make sure you're using the correct build profile

### 3. Build Errors
- Run `npx expo install --check` to fix dependency versions
- Clear cache: `npx expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Quick Fix Commands

```bash
# Fix dependency versions
npx expo install --check

# Clear cache and restart
npx expo start -c

# Build development client
npx eas build --profile development --platform ios
```




