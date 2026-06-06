# MindTrack Project Context

## Product Goal

MindTrack is a mobile-first web app for Indian board and competitive exam students to privately monitor and improve mental well-being during high-pressure academic seasons.

The core problem: students preparing for exams such as Boards, NEET, JEE, CUET, CAT, GATE, UPSC, and result seasons often face stress, anxiety, burnout, self-doubt, comparison, and uncertainty. MindTrack should help them track mood, identify triggers, reflect privately, and receive simple supportive guidance without pretending to be therapy.

The app should feel calm, minimal, and mobile-app-like in the browser. Current visual direction is a zen minimalist bento-box interface using sage greens, warm parchment creams, soft cards, and reduced cognitive load.

## MVP Scope

Implemented MVP flow:

1. Login
   - Google auth through Firebase.
   - Local demo mode fallback only when Firebase env vars are missing.
   - Students authenticate with Google but use an anonymous alias inside the app.

2. Onboarding
   - Collects alias, age band, exam type, exam phase, and optional support preference.
   - Light, low-friction, non-clinical context gathering.

3. Dashboard
   - Mobile bento-style hub.
   - Shows exam context, reminder time, seven-day mood summary, mood bars, personalized suggestion, and daily check-in form.
   - Check-in captures 5-point emoji mood, stress triggers, and short journal note.

4. Journal
   - Private list of past check-ins and journal notes.

5. Breath / Rituals
   - Box breathing, grounding, and self-compassion exercises.
   - Larger breathing orb, reduced-motion support.

6. Listener
   - Static/prototype “AI companion” screen.
   - Letter-style prompt and canned empathetic response.
   - Explicit safety boundary: not therapy, diagnosis, or crisis support.

7. Settings
   - Edit alias, exam type, exam phase, reminder time.
   - Sign out flow.

## Safety Position

MindTrack is supportive and non-clinical.

It must not:

- diagnose
- claim to provide therapy
- replace professional help
- provide crisis counseling as if it is sufficient

High-distress support currently directs users toward trusted adults/professionals and India Tele MANAS:

- `14416`
- `1800-89-14416`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Firebase Auth
- Firestore
- Lucide React icons
- Vitest
- ESLint with Next core web vitals

Important scripts:

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Key Files

- `src/app/login/page.tsx`: Login / Threshold screen.
- `src/app/onboarding/page.tsx`: Alias and context setup.
- `src/app/dashboard/page.tsx`: Main hub and check-in summary.
- `src/components/CheckInForm.tsx`: Daily mood, trigger, and journal form.
- `src/app/journal/page.tsx`: Past entries.
- `src/app/exercises/page.tsx`: Breathing and grounding rituals.
- `src/app/listener/page.tsx`: Listener prototype.
- `src/app/settings/page.tsx`: Profile settings and sign out.
- `src/components/AuthProvider.tsx`: Firebase/demo auth state.
- `src/components/ProfileProvider.tsx`: Profile/check-in loading and mutation state.
- `src/components/AppFrame.tsx`: Protected route shell and bottom nav.
- `src/lib/firebase.ts`: Firebase initialization from env vars.
- `src/lib/storage.ts`: Firestore/local persistence layer.
- `src/lib/wellness.ts`: Mood validation, trigger logic, suggestions, summary helpers.
- `src/lib/wellness.test.ts`: Logic tests.
- `src/lib/firebase.rules`: Firestore security rules.
- `firebase.json`: Firestore rules/index deploy config.
- `firestore.indexes.json`: Empty index config.
- `.env.local.example`: Firebase env template.
- `.firebaserc`: Firebase project alias.

## Firebase Status

Firebase project configured by user:

- Project ID: `mindtrack-9e3ad`
- Google Auth: enabled
- Web app config has been added locally to `.env.local`
- `.env.local` is gitignored and should not be committed
- `.firebaserc` targets `mindtrack-9e3ad`

Current `.env.local` contains:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mindtrack-9e3ad.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mindtrack-9e3ad
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mindtrack-9e3ad.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=490348175754
NEXT_PUBLIC_FIREBASE_APP_ID=1:490348175754:web:35da8afec3216672a3a873
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3ZFTDXQYQ4
```

Firebase CLI deploy attempted:

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

It failed because Firebase CLI was not authenticated:

```text
HTTP Error: 401, Request had invalid authentication credentials.
```

Needed next Firebase steps:

1. Run:

```bash
npx firebase-tools login
```

2. Ensure Firestore Database is created in Firebase Console.
3. Deploy rules:

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

4. Ensure Firebase Auth authorized domains include:
   - `localhost`
   - deployed production domain later

## Current Firestore Data Shape

Profiles:

```text
users/{uid}
```

Fields:

- `uid`
- `alias`
- `email`
- `ageBand`
- `examType`
- `examPhase`
- `supportPreference`
- `reminderTime`
- `createdAt`
- `updatedAt`

Check-ins:

```text
users/{uid}/checkins/{checkinId}
```

Fields:

- `moodScore`
- `moodEmoji`
- `triggers`
- `journalText`
- `suggestedSupportId`
- `createdAt`

Rules currently:

- Users can read/create/update only their own profile.
- Users cannot delete profiles.
- Users can read/create only their own check-ins.
- Check-ins cannot be updated or deleted.
- Basic validation exists for profile and check-in fields.
- `wellnessContent` is readable by signed-in users and not writable from client.

## Verification Status

Most recent successful checks:

```bash
npm run lint
npm run test
npm run build
```

All passed.

`npm audit --audit-level=moderate` previously returned zero vulnerabilities after dependency updates and a `postcss` override.

The dev server was restarted after Firebase env setup and ran at:

```text
http://localhost:3001
```

It showed real Firebase mode:

- Login button text: `Enter with Google`
- Demo fallback message not shown

## Important Current Changes Not Yet Committed

There are modified/untracked files from multiple rounds of work. Before pushing, inspect:

```bash
git status --short
git diff --stat
```

Expected modified/new items include:

- `README.md`
- `package.json`
- `src/app/*`
- `src/components/*`
- `src/lib/firebase.rules`
- `src/lib/firebase.ts`
- `.env.local.example`
- `.firebaserc`
- `eslint.config.mjs`
- `firebase.json`
- `firestore.indexes.json`
- `src/app/listener/`

Do not commit `.env.local`.

## What Is Missing / Next Steps

Highest priority:

1. Complete Firebase CLI login and deploy Firestore rules.
2. Manually test Google login in browser:
   - login
   - onboarding
   - profile creation in Firestore
   - daily check-in save
   - journal reads saved check-in
   - sign out and sign back in
3. If Firestore save fails, inspect browser console and Firebase rules.

Product/demo polish:

1. Add a short demo script or pitch section in README:
   - Problem
   - Solution
   - Why private alias matters
   - Safety stance
   - Demo flow
2. Add screenshots or short screen descriptions for hackathon judges.
3. Consider a small “courses/learning tiles” screen later, but it is not in current MVP.
4. AI Listener is currently static/canned. Real AI chatbot is deferred and should require stronger safety guardrails.
5. Browser notifications/email reminders are not implemented; current reminders are in-app preference/nudge only.

Testing gaps:

1. No E2E tests yet.
2. No automated Firestore rules tests yet.
3. No Firebase emulator setup yet.
4. No automated visual regression tests.

Security/privacy gaps:

1. Firebase rules are stricter now, but should be validated with emulator tests.
2. Email is stored in profile if available. If privacy is prioritized, consider storing an email hash or omitting email.
3. App uses client-side Firebase SDK only; this is fine for MVP but means rules are the main security boundary.

Deployment gaps:

1. No hosting provider selected.
2. Need production domain added to Firebase Auth authorized domains.
3. Need env vars added to hosting platform.
4. Need rules deployed before a public demo.

## Suggested Handoff Order For Another Agent

1. Run `npm install` if dependencies are missing.
2. Run `npm run lint`, `npm run test`, `npm run build`.
3. Run `npx firebase-tools login`.
4. Confirm Firestore database exists in Firebase Console.
5. Run `npx firebase-tools deploy --only firestore:rules,firestore:indexes`.
6. Start app with `npm run dev`.
7. Test full Google auth and Firestore journey.
8. Fix any rules/schema mismatches.
9. Commit and push to `origin` (`git@github.com:Ramitphi/mental-wellness.git`).

## Repository Remote

Remote origin is configured as:

```text
git@github.com:Ramitphi/mental-wellness.git
```

