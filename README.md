# MindTrack

> Private mental wellness for Indian exam students.

---

## The Problem

Students preparing for JEE, NEET, UPSC, CUET, CAT, GATE, and Board exams face months of compounding pressure — performance anxiety, comparison, burnout, and self-doubt with very little space to process it.

Most wellness tools are too clinical, too generic, or too social. Students stay silent.

## What MindTrack Does

MindTrack gives students a private, low-friction space to:

- **Track mood** daily with a 5-point emoji scale
- **Name stress triggers** (academic, family, social, sleep, health)
- **Journal privately** — no audience, no judgment
- **Spot patterns** in a 7-day mood chart
- **Access short rituals** — box breathing, grounding, self-compassion reset
- **Write to the Listener** — a safe, reflective space (prototype AI companion with explicit safety boundaries)

### Why an alias matters

Students sign in with Google but are shown only by a self-chosen alias inside the app. Nothing clinical. No real name in the interface. Lower barrier to honest reflection.

---

## Demo Flow (Hackathon Judges)

1. **Open the app** → `http://localhost:3001`
2. **Log in** with Google (or use demo mode if no Firebase env vars present)
3. **Onboarding** → set an alias, exam type (e.g. JEE), phase (e.g. Revision), support preference
4. **Dashboard** → see the bento sanctuary layout; notice exam context and reminder time in the header
5. **Check-in** → submit a mood (try score 1 with "academic pressure" trigger to see the safety card)
6. **Journal** → entries appear here ordered newest first
7. **Exercises** → open box breathing or the grounding ritual
8. **Listener** → write a letter about what feels heavy; receive a gentle, non-clinical response
9. **Settings** → edit alias, exam type, sign out

---

## Safety Stance

MindTrack is **supportive, not clinical**.

It does not diagnose, provide therapy, or act as crisis support.

High-distress check-ins (mood 1/5 + distress triggers) surface a visible safety card directing students toward trusted adults and:

- **India Tele MANAS:** `14416` / `1800-89-14416`

The Listener screen repeats this boundary explicitly on every session.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Auth | Firebase Authentication (Google) |
| Database | Firestore |
| Icons | Lucide React |
| Tests | Vitest |
| Lint | ESLint + Next.js core web vitals |

---

## Getting Started

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. Without Firebase env vars, the app runs in local demo mode so the full UI can be explored immediately.

---

## Firebase Setup

1. Create a project at `console.firebase.google.com`.
2. Add a Web app and copy the config.
3. Enable **Authentication → Google** sign-in.
4. Add `localhost` (and your production domain) to **Authorized domains**.
5. Create a **Firestore Database** (production mode).
6. Copy `.env.local.example` → `.env.local` and fill in the values.
7. Deploy Firestore security rules:

```bash
npx firebase-tools login
npx firebase-tools use mindtrack-9e3ad
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

---

## Scripts

```bash
npm run dev      # local dev server
npm run build    # production build
npm run lint     # ESLint
npm run test     # Vitest unit tests
```

---

## Privacy Notes

- Alias is used throughout the app, not the Google display name.
- Check-ins are stored under `users/{uid}/checkins/` — readable only by the owning user per Firestore rules.
- `.env.local` is gitignored and must never be committed.
