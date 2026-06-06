"use client";

import { AppFrame } from "@/components/AppFrame";
import { useProfile } from "@/components/ProfileProvider";

export default function JournalPage() {
  const { checkins } = useProfile();

  return (
    <AppFrame>
      <div className="screen stack">
        <div>
          <p className="eyebrow">Journal</p>
          <h1>Your private pattern log.</h1>
          <p className="muted">Entries are ordered newest first and only visible to your account.</p>
        </div>

        {checkins.length === 0 ? (
          <section className="card">
            <h2>No entries yet</h2>
            <p className="muted">Add a night check-in from Today and your reflections will collect here.</p>
          </section>
        ) : (
          checkins.map((item) => (
            <article className="card stack" key={item.id}>
              <div className="topbar" style={{ marginBottom: 0 }}>
                <div>
                  <h2>
                    {item.moodEmoji} Mood {item.moodScore}/5
                  </h2>
                  <p className="muted">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {item.triggers.length ? <p className="muted">Triggers: {item.triggers.join(", ")}</p> : null}
              {item.journalText ? <p>{item.journalText}</p> : <p className="muted">No journal note added.</p>}
            </article>
          ))
        )}
      </div>
    </AppFrame>
  );
}
