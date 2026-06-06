# MindTrack

A mobile-first Next.js + Firebase web app for Indian board and competitive exam students to privately track mood, journal stress triggers, practice short grounding rituals, and spot recent wellness patterns.

## Getting Started

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Firebase Setup

Create `.env.local` with:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

When Firebase values are not present, the app uses a local demo profile so the interface can be previewed immediately.

## Safety

This app is supportive and non-clinical. It does not diagnose or provide therapy. High-distress check-ins surface trusted-person guidance and India Tele MANAS support: `14416` / `1800-89-14416`.
