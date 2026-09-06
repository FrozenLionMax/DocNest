# DocNest — Standalone Android APK & Play Store Build Guide

> **Building `.apk` and `.aab` bundles using Expo Application Services (EAS)**

---

## 📱 1. Generate Direct Standalone Android APK (`.apk`)

To build an installable `.apk` file that you can install directly on any Android phone or share via WhatsApp:

```bash
# Navigate to mobile app directory
cd apps/mobile

# Trigger EAS preview APK build
npx eas build -p android --profile preview
```

> **Result**: Expo EAS Cloud will build the signed Android APK and return a direct download URL. Download it and install it on any phone!

---

## 🏪 2. Generate Play Store App Bundle (`.aab`)

When ready to publish DocNest on the Google Play Store:

```bash
# Trigger EAS production AAB build
cd apps/mobile
npx eas build -p android --profile production
```

> **Result**: Generates an `.aab` file ready to be uploaded to Google Play Console.

---

## 🛠️ Requirements
- **Expo Account**: Free account at [expo.dev](https://expo.dev)
- **Google Play Developer Account**: $25 one-time fee for official Play Store publishing.
