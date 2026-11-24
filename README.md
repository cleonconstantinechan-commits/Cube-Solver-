# Cube Solver★ Android

Android wrapper built with Capacitor; GitHub Actions builds a debug APK.

## Build APK on GitHub
1. Upload the contents of this folder to a GitHub repository on branch `main`.
2. Open the repository Actions tab.
3. Choose `Build Cube Solver APK` and click `Run workflow`.
4. When completed, open the workflow run and download artifact `Cube-Solver-Star-debug-apk`.


## Features
- Offline scramble generator (20-100 turns)
- Timer with start/stop/reset
- 3x3 sticker color entry with fixed center colors
- Solver powered by the `cubejs` npm package

## Build locally
Install Node.js 20 and Android Studio / Android SDK, then:
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```
APK path: `android/app/build/outputs/apk/debug/app-debug.apk`.
