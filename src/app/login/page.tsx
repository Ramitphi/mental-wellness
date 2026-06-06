"use client";

import { HeartPulse, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppFrame } from "@/components/AppFrame";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/components/ProfileProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn, isDemoMode } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    if (!loading && user) router.replace(profile ? "/dashboard" : "/onboarding");
  }, [loading, profile, router, user]);

  return (
    <AppFrame requireProfile={false}>
      <div className="screen stack">
        <div className="topbar">
          <div>
            <p className="eyebrow">MindTrack Exams</p>
            <h1>Private check-ins for exam season.</h1>
          </div>
          <HeartPulse aria-hidden="true" color="var(--green)" size={34} />
        </div>

        <section className="card stack">
          <h2>Track the pressure before it piles up</h2>
          <p className="muted">
            Built for Indian board and competitive exam students to notice mood, triggers, and recovery habits in a
            simple mobile web app.
          </p>
          <button className="btn btn-primary" onClick={() => void signIn()}>
            <ShieldCheck aria-hidden="true" size={20} />
            Continue with Google
          </button>
          {isDemoMode ? (
            <p className="muted">
              Firebase is not configured yet, so this button opens a local hackathon demo account.
            </p>
          ) : null}
        </section>

        <section className="card stack">
          <h2>Why students can be honest here</h2>
          <div className="grid-two">
            <div>
              <h3>Alias first</h3>
              <p className="muted">The app uses a private display name instead of showing your Google profile.</p>
            </div>
            <div>
              <h3>Non-clinical</h3>
              <p className="muted">Supportive tools, no diagnosis, and clear guidance for high distress.</p>
            </div>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
