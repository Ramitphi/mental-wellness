import { describe, expect, it } from "vitest";
import { getSevenDaySummary, getWellnessSuggestion, isHighDistress, validateCheckIn } from "./wellness";
import type { CheckIn } from "./types";

describe("wellness suggestion logic", () => {
  it("prioritizes grounding for low mood", () => {
    expect(
      getWellnessSuggestion({ moodScore: 1, examPhase: "preparing", triggers: ["Syllabus pressure"] }).exerciseId
    ).toBe("grounding");
  });

  it("uses exam-week specific breathing support", () => {
    expect(getWellnessSuggestion({ moodScore: 4, examPhase: "exam-week", triggers: [] }).id).toBe(
      "exam-week-breathing"
    );
  });

  it("responds to comparison triggers with self-compassion", () => {
    expect(getWellnessSuggestion({ moodScore: 3, examPhase: "preparing", triggers: ["Comparison"] }).exerciseId).toBe(
      "self-compassion"
    );
  });
});

describe("check-in validation", () => {
  it("requires a valid mood score", () => {
    expect(validateCheckIn({ moodScore: 0, journalText: "", triggers: [] })).toMatch(/feeling/);
  });

  it("allows optional journal and triggers", () => {
    expect(validateCheckIn({ moodScore: 3, journalText: "", triggers: [] })).toBeNull();
  });
});

describe("summary and distress helpers", () => {
  const checkins: CheckIn[] = Array.from({ length: 8 }).map((_, index) => ({
    id: String(index),
    moodScore: index < 4 ? 3 : 5,
    moodEmoji: "🙂",
    triggers: [],
    journalText: "",
    suggestedSupportId: "steady-study-day",
    createdAt: `2026-06-0${index + 1}T20:00:00.000Z`
  }));

  it("summarizes only the latest seven entries", () => {
    expect(getSevenDaySummary(checkins).checkInCount).toBe(7);
    expect(getSevenDaySummary(checkins).goodDays).toBe(4);
  });

  it("flags burnout or low mood as high distress", () => {
    expect(isHighDistress(4, ["Burnout"])).toBe(true);
    expect(isHighDistress(2, [])).toBe(true);
    expect(isHighDistress(4, [])).toBe(false);
  });
});
