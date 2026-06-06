"use client";

import { FormEvent, useState } from "react";
import { LifeBuoy, Send, Sparkles } from "lucide-react";
import { AppFrame } from "@/components/AppFrame";
import { useProfile } from "@/components/ProfileProvider";

const prompts = [
  "What is the thought that keeps returning?",
  "What would feel 10% lighter tonight?",
  "Who is one safe person you could update?"
];

function buildReply(alias: string, letter: string): string {
  const text = letter.toLowerCase();
  const name = alias || "student";

  if (text.includes("fail") || text.includes("disappoint") || text.includes("not good enough")) {
    return `Dear ${name}, the fear of disappointing the people we love is one of the heaviest things to carry into an exam. That fear says nothing about your actual worth. Tonight, set the result aside and ask: what is one small thing I can do well in the next hour? Just one. That is enough for now.`;
  }
  if (text.includes("sleep") || text.includes("tired") || text.includes("exhausted")) {
    return `Dear ${name}, rest is not wasted study time — it is the part of preparation that makes everything else stick. If sleep is escaping you tonight, try the box breathing exercise: 4 counts in, hold 4, out 4, hold 4. Your brain genuinely needs this. Protect it.`;
  }
  if (text.includes("compet") || text.includes("rank") || text.includes("topper") || text.includes("everyone else")) {
    return `Dear ${name}, comparison is exhausting partly because it is always unfair — you see their highlight and your full reality. The only meaningful contest right now is between yesterday's version of you and today's. What did you understand today that you did not yesterday?`;
  }
  if (text.includes("family") || text.includes("parents") || text.includes("pressure") || text.includes("expect")) {
    return `Dear ${name}, carrying someone else's expectations on top of your own is a double weight. You cannot control what others hope for, only what you do today. Is there one trusted person — a parent, sibling, or friend — you could tell one honest sentence to tonight? Sometimes saying it out loud makes it smaller.`;
  }
  if (text.includes("alone") || text.includes("lonely") || text.includes("nobody") || text.includes("no one")) {
    return `Dear ${name}, feeling unseen during exam season is more common than the silence around it suggests. You are not the only one sitting with this. If reaching out feels too hard right now, write one more line in this space — it counts as speaking.`;
  }

  return `Dear ${name}, I hear that this exam season is asking a lot from you. For tonight, let us make the next step smaller: name the feeling, choose one recovery action, and tell one trusted person if it feels too heavy to hold alone.`;
}

export default function ListenerPage() {
  const { profile } = useProfile();
  const [letter, setLetter] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = letter.trim();
    if (!trimmed) return;

    setReply(buildReply(profile?.alias ?? "student", trimmed));
  }

  return (
    <AppFrame>
      <form className="screen stack" onSubmit={submit}>
        <div className="topbar">
          <div>
            <p className="eyebrow">The Listener</p>
            <h1>A gentle letter space.</h1>
            <p className="muted">A future AI companion pattern with visible safety boundaries for the hackathon demo.</p>
          </div>
          <Sparkles aria-hidden="true" color="var(--gold)" size={30} />
        </div>

        <section className="card letter-card stack">
          <h2>Write what feels loud</h2>
          <div className="chip-row" aria-label="Reflection prompts">
            {prompts.map((prompt) => (
              <button
                className="chip"
                type="button"
                key={prompt}
                onClick={() => setLetter((current) => (current ? `${current}\n${prompt}` : prompt))}
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="field">
            <label htmlFor="listener-letter">Letter</label>
            <textarea
              className="textarea listener-textarea"
              id="listener-letter"
              placeholder="I am worried that..."
              value={letter}
              onChange={(event) => setLetter(event.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            <Send aria-hidden="true" size={18} />
            Ask the Listener
          </button>
        </section>

        {reply ? (
          <section className="card listener-reply stack" aria-live="polite">
            <p className="eyebrow">Listener note</p>
            <p>{reply}</p>
          </section>
        ) : null}

        <section className="card alert stack">
          <h2>Safety boundary</h2>
          <p>
            The Listener is not therapy, diagnosis, or crisis support. If you feel unsafe or at risk, contact a trusted
            adult, local emergency service, or India Tele MANAS at <strong>14416</strong>.
          </p>
          <a className="btn btn-secondary" href="tel:14416">
            <LifeBuoy aria-hidden="true" size={18} />
            Call Tele MANAS
          </a>
        </section>
      </form>
    </AppFrame>
  );
}
