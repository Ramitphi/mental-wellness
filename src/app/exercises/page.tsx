"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppFrame } from "@/components/AppFrame";

const exercises = {
  "box-breathing": {
    title: "Box breathing",
    duration: "4 minutes",
    steps: ["Inhale for 4", "Hold for 4", "Exhale for 4", "Hold for 4"]
  },
  grounding: {
    title: "5-4-3-2-1 grounding",
    duration: "3 minutes",
    steps: ["Name 5 things you see", "Touch 4 things near you", "Notice 3 sounds", "Find 2 smells", "Name 1 steady thought"]
  },
  "self-compassion": {
    title: "Self-compassion reset",
    duration: "5 minutes",
    steps: ["Name what feels hard", "Say what you would tell a friend", "Choose one small next action", "Let the rest wait"]
  }
} as const;

function ExercisesContent() {
  const searchParams = useSearchParams();
  const selected = searchParams.get("exercise");
  const exercise = exercises[(selected as keyof typeof exercises) || "box-breathing"] ?? exercises["box-breathing"];

  return (
    <AppFrame>
      <div className="screen stack">
        <div>
          <p className="eyebrow">The Breath</p>
          <h1>{exercise.title}</h1>
          <p className="muted">{exercise.duration}. A full-screen ritual before returning to study or sleep.</p>
        </div>

        <section className="card breath-stage stack">
          <div className="exercise-orb" aria-hidden="true">
            Breathe
          </div>
          <ol className="stack" aria-label={`${exercise.title} steps`}>
            {exercise.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="card stack">
          <h2>Choose another reset</h2>
          {Object.entries(exercises).map(([id, item]) => (
            <a className="btn btn-secondary" key={id} href={`/exercises?exercise=${id}`}>
              {item.title}
            </a>
          ))}
        </section>
      </div>
    </AppFrame>
  );
}

export default function ExercisesPage() {
  return (
    <Suspense
      fallback={
        <AppFrame>
          <div className="screen">
            <p className="eyebrow">Reset exercises</p>
            <h1>Loading exercise</h1>
          </div>
        </AppFrame>
      }
    >
      <ExercisesContent />
    </Suspense>
  );
}
