"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { useProfile } from "./ProfileProvider";
import { moodOptions, triggerOptions, validateCheckIn } from "@/lib/wellness";

export function CheckInForm() {
  const { addCheckIn } = useProfile();
  const [moodScore, setMoodScore] = useState(0);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [journalText, setJournalText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function toggleTrigger(trigger: string) {
    setTriggers((items) => (items.includes(trigger) ? items.filter((item) => item !== trigger) : [...items, trigger]));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const validation = validateCheckIn({ moodScore, journalText, triggers });
    if (validation) {
      setError(validation);
      return;
    }

    const mood = moodOptions.find((item) => item.score === moodScore);
    await addCheckIn({
      moodScore,
      moodEmoji: mood?.emoji ?? "😐",
      triggers,
      journalText: journalText.trim()
    });
    setMoodScore(0);
    setTriggers([]);
    setJournalText("");
    setError(null);
  }

  return (
    <form className="card stack" onSubmit={(event) => void submit(event)}>
      <div>
        <h2>Night check-in</h2>
        <p className="muted">Pick the closest feeling. No need to explain perfectly.</p>
      </div>

      <div className="mood-row" role="group" aria-label="Mood score">
        {moodOptions.map((mood) => (
          <button
            className="mood-button"
            type="button"
            key={mood.score}
            aria-pressed={moodScore === mood.score}
            aria-label={`${mood.label}, ${mood.score} out of 5`}
            onClick={() => setMoodScore(mood.score)}
          >
            <strong>{mood.emoji}</strong>
            <span>{mood.score}</span>
          </button>
        ))}
      </div>

      <div>
        <h3>Stress triggers</h3>
        <div className="chip-row" role="group" aria-label="Stress triggers">
          {triggerOptions.map((trigger) => (
            <button
              className="chip"
              type="button"
              key={trigger}
              aria-pressed={triggers.includes(trigger)}
              onClick={() => toggleTrigger(trigger)}
            >
              {trigger}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="journalText">Journal note</label>
        <textarea
          className="textarea"
          id="journalText"
          maxLength={800}
          placeholder="What made today feel this way?"
          value={journalText}
          onChange={(event) => setJournalText(event.target.value)}
        />
      </div>

      {error ? (
        <p className="alert card" role="alert">
          {error}
        </p>
      ) : null}

      <button className="btn btn-primary" type="submit">
        <Send aria-hidden="true" size={18} />
        Save check-in
      </button>
    </form>
  );
}
