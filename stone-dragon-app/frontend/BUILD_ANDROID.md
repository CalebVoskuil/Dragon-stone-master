# Building Android APK

## Important: Backend Deployment

**The APK only contains the mobile app (frontend). The backend must be deployed separately!**

The mobile app connects to your backend API server. Before building the APK:

1. **Deploy your backend** to a server (AWS EC2, Heroku, Railway, etc.)
2. **Update the API URL** in the frontend code (see below)
3. **Ensure the backend is accessible** from mobile devices

See `../backend/DEPLOYMENT.md` for backend deployment instructions.

---

## Option 1: EAS Build (Recommended - Cloud-based)

EAS Build is the easiest way to build an APK. It runs in the cloud and doesn't require Android Studio.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
(You'll need to create a free Expo account if you don't have one)

### Step 3: Configure Project ID
First, you need to get a real project ID. Run:
```bash
cd stone-dragon-app/frontend
eas init
```
This will generate a project ID and update `app.json`.

### Step 4: Build APK
```bash
# For a preview/test APK (faster, free tier)
eas build --platform android --profile preview

# Or for production APK
eas build --platform android --profile production
```

### Step 5: Download APK
After the build completes (usually 10-20 minutes), you'll get a download link. The APK will be in your Expo dashboard.

---

## Option 2: Local Build (Requires Android Studio)

If you prefer to build locally:

### Step 1: Install Android Studio
Download and install [Android Studio](https://developer.android.com/studio)

### Step 2: Set up Android SDK
- Open Android Studio
- Install Android SDK (API 33+ recommended)
- Set up environment variables:
  - `ANDROID_HOME` = path to Android SDK
  - Add `$ANDROID_HOME/platform-tools` to PATH

### Step 3: Generate Native Code
```bash
cd stone-dragon-app/frontend
npx expo prebuild --clean
```

### Step 4: Install Dependencies
Make sure expo-notifications is installed:
```bash
npx expo install expo-notifications
```

### Step 5: Build APK with Gradle
```bash
cd android
./gradlew assembleRelease
```

The APK will be at:
`android/app/build/outputs/apk/release/app-release.apk`

For debug APK (unsigned, easier to install):
```bash
./gradlew assembleDebug
```
Location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Installing the APK

### On Your Android Device:

1. Enable "Install from Unknown Sources" in Settings
2. Transfer the APK to your device (USB, email, cloud storage)
3. Open the APK file on your device
4. Tap "Install"

### Via ADB (if device connected):
```bash
adb install path/to/app.apk
```

---

## Configuring API URL for Production

Before building the APK, you **must** update the API URL in the frontend to point to your deployed backend.

### Option A: Update `src/services/api.ts` directly

Find the `baseURL` in `src/services/api.ts` and change it:

```typescript
baseURL: 'https://your-backend-domain.com/api',  // Production URL
```

### Option B: Use Environment Variables (Recommended)

1. Install `expo-constants` (already installed) and use environment variables
2. Create `.env` file in frontend directory:
   ```
   EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
   ```
3. Update `api.ts` to read from env:
   ```typescript
   baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api',
   ```

### Important Notes:
- Use `https://` for production (secure)
- Don't use `localhost` or local IPs - they won't work on physical devices
- Ensure CORS is configured on your backend to allow requests from your app
- Test the API connection before distributing the APK

---

## Notes

- **EAS Build** is recommended for beginners - no local setup needed
- **Local Build** requires Android Studio but gives you full control
- The APK will include all native modules (notifications, camera, etc.)
- For production releases, you may want to sign the APK (EAS handles this automatically)
- **Remember**: Backend must be deployed and accessible before the APK will work!

