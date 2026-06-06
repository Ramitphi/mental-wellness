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

export default function ListenerPage() {
  const { profile } = useProfile();
  const [letter, setLetter] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = letter.trim();
    if (!trimmed) return;

    setReply(
      `Dear ${profile?.alias ?? "student"}, I hear that this exam season is asking a lot from you. For tonight, let us make the next step smaller: name the feeling, choose one recovery action, and tell one trusted person if it feels too heavy to hold alone.`
    );
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
