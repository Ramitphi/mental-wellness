"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AppFrame } from "@/components/AppFrame";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/components/ProfileProvider";
import { createDemoProfile } from "@/lib/storage";
import type { AgeBand, ExamPhase, ExamType } from "@/lib/types";
import { examPhases, examTypes } from "@/lib/wellness";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading, upsertProfile } = useProfile();
  const [alias, setAlias] = useState("steady-student");
  const [ageBand, setAgeBand] = useState<AgeBand>("18-21");
  const [examType, setExamType] = useState<ExamType>("JEE");
  const [examPhase, setExamPhase] = useState<ExamPhase>("preparing");
  const [supportPreference, setSupportPreference] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && profile) router.replace("/dashboard");
  }, [loading, profile, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;

    const cleanAlias = alias.trim();
    if (cleanAlias.length < 2) {
      setError("Choose an alias with at least two characters.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await upsertProfile({
        ...createDemoProfile(user.uid, user.email),
        alias: cleanAlias,
        ageBand,
        examType,
        examPhase,
        supportPreference: supportPreference.trim()
      });
      router.replace("/dashboard");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not create your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppFrame requireProfile={false}>
      <form className="screen stack" onSubmit={(event) => void submit(event)}>
        <div>
          <p className="eyebrow">The Intention</p>
          <h1>Set the context gently.</h1>
          <p className="muted">A few light details help MindTrack adapt without asking you to over-explain.</p>
        </div>

        <section className="bento-grid" aria-label="Onboarding progress">
          <div className="bento-tile">
            <h3>1. Alias</h3>
            <p className="muted">Pick the name MindTrack shows inside the app.</p>
          </div>
          <div className="bento-tile">
            <h3>2. Context</h3>
            <p className="muted">Choose exam, phase, and support style.</p>
          </div>
        </section>

        <section className="card hero-card stack">
          <div className="field">
            <label htmlFor="alias">Anonymous alias</label>
            <input
              className="input"
              id="alias"
              value={alias}
              minLength={2}
              maxLength={24}
              required
              onChange={(event) => setAlias(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="ageBand">Age group</label>
            <select
              className="select"
              id="ageBand"
              value={ageBand}
              onChange={(event) => setAgeBand(event.target.value as AgeBand)}
            >
              <option value="under-15">Under 15</option>
              <option value="15-17">15-17</option>
              <option value="18-21">18-21</option>
              <option value="22-plus">22+</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="examType">Exam</label>
            <select
              className="select"
              id="examType"
              value={examType}
              onChange={(event) => setExamType(event.target.value as ExamType)}
            >
              {examTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="examPhase">Current phase</label>
            <select
              className="select"
              id="examPhase"
              value={examPhase}
              onChange={(event) => setExamPhase(event.target.value as ExamPhase)}
            >
              {examPhases.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="supportPreference">Optional support preference</label>
            <textarea
              className="textarea"
              id="supportPreference"
              value={supportPreference}
              placeholder="Example: I prefer practical steps, not long advice."
              onChange={(event) => setSupportPreference(event.target.value)}
            />
          </div>
        </section>

        {error ? (
          <p className="alert card" role="alert">
            {error}
          </p>
        ) : null}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Creating your space..." : "Start tracking"}
        </button>
      </form>
    </AppFrame>
  );
}
