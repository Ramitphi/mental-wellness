"use client";

import { DoorOpen, ShieldCheck, Sprout } from "lucide-react";
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
            <p className="eyebrow">The Threshold</p>
            <h1>MindTrack</h1>
            <p className="muted">A quiet, anonymous entry point before exam pressure follows you in.</p>
          </div>
          <DoorOpen aria-hidden="true" color="var(--green)" size={34} />
        </div>

        <section className="card hero-card stack">
          <h2>Step in without performing</h2>
          <p className="muted">
            A mobile-first tracker for board and competitive exam students to track mood, notice triggers, and return
            to steady focus.
          </p>
          <button className="btn btn-primary" onClick={() => void signIn()}>
            <ShieldCheck aria-hidden="true" size={20} />
            Enter with Google
          </button>
          {isDemoMode ? (
            <p className="muted">
              Firebase is not configured yet, so this button opens a local hackathon demo account.
            </p>
          ) : null}
        </section>

        <section className="card stack">
          <h2>Built for honest check-ins</h2>
          <div className="bento-grid">
            <div className="bento-tile">
              <Sprout aria-hidden="true" size={18} />
              <h3>Alias first</h3>
              <p className="muted">The app uses a private display name instead of showing your Google profile.</p>
            </div>
            <div className="bento-tile">
              <ShieldCheck aria-hidden="true" size={18} />
              <h3>Non-clinical</h3>
              <p className="muted">Supportive tools, no diagnosis, and clear guidance for high distress.</p>
            </div>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
