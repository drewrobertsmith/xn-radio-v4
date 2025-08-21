# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture

- **Website:** Expo Router website with Tailwind.
- **Native app:** Expo Router app with CNG.
- **Backend:** Expo API routes WinterTC-compliant. Routes are in `src/app/api/` directory. API routes use `+api.ts` suffix (`chat+api.ts`).
- **Secrets:** Use .env files and API routes for secret management. Never use `EXPO_PUBLIC_` prefix for sensitive data.

## Common Commands

- **Install dependencies:** `npm install`
- **Start the app:** `npx expo start`
- **Run on Android:** `npx expo run:android`
- **Run on iOS:** `npx expo run:ios`
- **Run on web:** `npx expo start --web`
- **Lint the code:** `npx expo lint`
- **Deploy to TestFlight:** `npx testflight`
- **Deploy to Android:** `eas build -p android -s`
- **Deploy web and server:** `npx expo export -p web && eas deploy`

