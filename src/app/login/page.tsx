"use client";

import { DoorOpen, ShieldCheck, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppFrame } from "@/components/AppFrame";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/components/ProfileProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn, isDemoMode, authActionLoading, authError } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  useEffect(() => {
    if (!loading && !profileLoading && user) router.replace(profile ? "/dashboard" : "/onboarding");
  }, [loading, profile, profileLoading, router, user]);

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
          <button className="btn btn-primary" disabled={authActionLoading} onClick={() => void signIn()}>
            <ShieldCheck aria-hidden="true" size={20} />
            {authActionLoading ? "Opening..." : isDemoMode ? "Enter demo mode" : "Enter with Google"}
          </button>
          {authError ? (
            <p className="alert card" role="alert">
              {authError}
            </p>
          ) : null}
          {isDemoMode ? (
            <p className="muted">
              Firebase keys are not configured yet, so this button opens a local hackathon demo account.
            </p>
          ) : (
            <p className="muted">Google verifies your account; MindTrack shows only the alias you choose.</p>
          )}
        </section>

        <section className="card stack">
          <h2>Flow for the demo</h2>
          <div className="bento-grid">
            <div className="bento-tile">
              <Sprout aria-hidden="true" size={18} />
              <h3>1. Enter</h3>
              <p className="muted">Use Google auth or local demo mode without exposing your profile name in the app.</p>
            </div>
            <div className="bento-tile">
              <ShieldCheck aria-hidden="true" size={18} />
              <h3>2. Set alias</h3>
              <p className="muted">Choose exam context, current phase, and a private display name.</p>
            </div>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
