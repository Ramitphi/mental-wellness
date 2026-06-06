"use client";

import Link from "next/link";
import { AlarmClock, ArrowRight, BookOpenCheck, LifeBuoy, Sparkles } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { CheckInForm } from "@/components/CheckInForm";
import { useProfile } from "@/components/ProfileProvider";
import { getSevenDaySummary, getWellnessSuggestion, isHighDistress } from "@/lib/wellness";

export default function DashboardPage() {
  const { profile, checkins } = useProfile();
  const summary = getSevenDaySummary(checkins);
  const latest = checkins[0];
  const suggestion = getWellnessSuggestion({
    moodScore: latest?.moodScore ?? 3,
    examPhase: profile?.examPhase ?? "preparing",
    triggers: latest?.triggers ?? []
  });
  const showSafety = latest ? isHighDistress(latest.moodScore, latest.triggers) : false;

  return (
    <AppFrame>
      <div className="screen stack">
        <header className="topbar">
          <div>
            <p className="eyebrow">The Sanctuary</p>
            <h1>Hi, {profile?.alias ?? "student"}.</h1>
            <p className="muted">{profile?.examType} support, reminder at {profile?.reminderTime ?? "21:30"}.</p>
          </div>
          <AlarmClock aria-hidden="true" color="var(--blue)" size={30} />
        </header>

        <section className="metric-grid bento-band" aria-label="Seven day summary">
          <div className="metric">
            <span className="muted">Average mood</span>
            <strong>{summary.average || "—"}</strong>
          </div>
          <div className="metric">
            <span className="muted">Good days</span>
            <strong>{summary.goodDays}/7</strong>
          </div>
        </section>

        <section className="card hero-card stack">
          <div>
            <h2>Last 7 check-ins</h2>
            <p className="muted">{summary.checkInCount ? "Small patterns are enough to start." : "Your chart appears after the first check-in."}</p>
          </div>
          <div className="bars" aria-label="Mood bar chart">
            {Array.from({ length: 7 }).map((_, index) => {
              const item = summary.lastSeven[index];
              return (
                <div
                  className="bar"
                  key={index}
                  title={item ? `${item.moodScore} out of 5` : "No check-in"}
                  style={{
                    height: `${item ? 18 + item.moodScore * 13 : 12}px`,
                    opacity: item ? 1 : 0.18
                  }}
                />
              );
            })}
          </div>
        </section>

        {showSafety ? (
          <section className="card alert stack">
            <h2>Extra support may help tonight</h2>
            <p>
              If this feels unsafe or too heavy to carry alone, reach out to a trusted adult, mentor, or mental-health
              professional. India Tele MANAS is available at <strong>14416</strong> or <strong>1800-89-14416</strong>.
            </p>
            <a className="btn btn-secondary" href="tel:14416">
              <LifeBuoy aria-hidden="true" size={18} />
              Call Tele MANAS
            </a>
          </section>
        ) : null}

        <section className="card ritual-card stack">
          <div>
            <p className="eyebrow">Suggested ritual</p>
            <h2>{suggestion.title}</h2>
            <p className="muted">{suggestion.body}</p>
          </div>
          <Link className="btn btn-secondary" href={`/exercises?exercise=${suggestion.exerciseId}`}>
            {suggestion.actionLabel}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </section>

        <section className="bento-grid">
          <Link className="bento-tile link-tile" href="/journal">
            <BookOpenCheck aria-hidden="true" size={20} />
            <h3>Reflect</h3>
            <p className="muted">Read the last few emotional notes without judgment.</p>
          </Link>
          <Link className="bento-tile link-tile" href="/listener">
            <Sparkles aria-hidden="true" size={20} />
            <h3>Listener</h3>
            <p className="muted">Draft a gentle letter to what feels heavy.</p>
          </Link>
        </section>

        <CheckInForm />
      </div>
    </AppFrame>
  );
}
