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

1. Create a Firebase project at `console.firebase.google.com`.
2. In Firebase Console, add a Web app and copy the Firebase config values.
3. Enable Authentication:
   - Go to Authentication > Sign-in method.
   - Enable Google.
   - Add your local and deployed domains to Authorized domains.
4. Enable Firestore Database:
   - Create a Firestore database.
   - Start in production mode.
   - Deploy the rules in `src/lib/firebase.rules`.
5. Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

When Firebase values are not present, the app uses a local demo profile so the interface can be previewed immediately.

Deploy Firestore rules with the Firebase CLI:

```bash
npx firebase-tools login
npx firebase-tools use <your-project-id>
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

## Safety

This app is supportive and non-clinical. It does not diagnose or provide therapy. High-distress check-ins surface trusted-person guidance and India Tele MANAS support: `14416` / `1800-89-14416`.
