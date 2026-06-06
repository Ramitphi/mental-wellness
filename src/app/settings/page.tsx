"use client";

import { FormEvent, useState } from "react";
import { LogOut, Save } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/components/ProfileProvider";
import type { ExamPhase, ExamType } from "@/lib/types";
import { examPhases, examTypes } from "@/lib/wellness";

export default function SettingsPage() {
  const { signOutUser, isDemoMode, authActionLoading, authError } = useAuth();
  const { profile, upsertProfile } = useProfile();
  const [alias, setAlias] = useState(profile?.alias ?? "");
  const [examType, setExamType] = useState<ExamType>(profile?.examType ?? "JEE");
  const [examPhase, setExamPhase] = useState<ExamPhase>(profile?.examPhase ?? "preparing");
  const [reminderTime, setReminderTime] = useState(profile?.reminderTime ?? "21:30");
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;

    await upsertProfile({
      ...profile,
      alias: alias.trim() || profile.alias,
      examType,
      examPhase,
      reminderTime
    });
    setSaved(true);
  }

  return (
    <AppFrame>
      <form className="screen stack" onSubmit={(event) => void submit(event)}>
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Tune MindTrack.</h1>
        </div>

        <section className="card stack">
          <div className="field">
            <label htmlFor="alias">Alias</label>
            <input className="input" id="alias" value={alias} onChange={(event) => setAlias(event.target.value)} />
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
            <label htmlFor="examPhase">Phase</label>
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
            <label htmlFor="reminderTime">In-app reminder time</label>
            <input
              className="input"
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
            />
          </div>
          {saved ? <p className="muted">Saved.</p> : null}
          <button className="btn btn-primary" type="submit">
            <Save aria-hidden="true" size={18} />
            Save settings
          </button>
        </section>

        <section className="card stack">
          <h2>Privacy and safety</h2>
          <p className="muted">
            {isDemoMode
              ? "Demo data is stored in this browser only."
              : "Your profile and check-ins are stored under your authenticated Firebase user id."}
          </p>
          <p className="muted">
            This is a supportive wellness tool, not therapy or medical diagnosis. For urgent support in India, call Tele
            MANAS at 14416 or 1800-89-14416.
          </p>
          {authError ? (
            <p className="alert card" role="alert">
              {authError}
            </p>
          ) : null}
          <button className="btn btn-ghost" type="button" disabled={authActionLoading} onClick={() => void signOutUser()}>
            <LogOut aria-hidden="true" size={18} />
            {authActionLoading ? "Signing out..." : "Sign out"}
          </button>
        </section>
      </form>
    </AppFrame>
  );
}
