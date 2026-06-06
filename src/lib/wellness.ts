import type { CheckIn, ExamPhase, ExamType, WellnessSuggestion } from "./types";

export const examTypes: ExamType[] = ["Boards", "NEET", "JEE", "CUET", "CAT", "GATE", "UPSC", "Other"];

export const examPhases: { value: ExamPhase; label: string }[] = [
  { value: "preparing", label: "Preparing" },
  { value: "exam-week", label: "Exam week" },
  { value: "waiting-results", label: "Waiting for results" },
  { value: "post-result", label: "Post-result" }
];

export const moodOptions = [
  { score: 1, emoji: "😣", label: "Heavy" },
  { score: 2, emoji: "😟", label: "Low" },
  { score: 3, emoji: "😐", label: "Okay" },
  { score: 4, emoji: "🙂", label: "Good" },
  { score: 5, emoji: "😄", label: "Steady" }
];

export const triggerOptions = [
  "Syllabus pressure",
  "Mock-test score",
  "Family expectations",
  "Comparison",
  "Sleep",
  "Uncertainty",
  "Burnout",
  "Results"
];

export function sanitizeText(text: string): string {
  // Strip control characters except newline/tab, then trim
  return text.replace(/[^\x09\x0A\x20-\x7E -￿]/g, "").trim();
}

export function validateCheckIn(input: Pick<CheckIn, "moodScore" | "journalText" | "triggers">) {
  if (!Number.isInteger(input.moodScore) || input.moodScore < 1 || input.moodScore > 5) {
    return "Choose how you are feeling before saving.";
  }

  if (input.journalText.length > 800) {
    return "Keep today's journal under 800 characters.";
  }

  if (input.triggers.length > 6) {
    return "Choose up to six triggers.";
  }

  if (!input.triggers.every((t) => triggerOptions.includes(t))) {
    return "One or more selected triggers are not valid.";
  }

  return null;
}

export function getWellnessSuggestion(params: {
  moodScore: number;
  examPhase: ExamPhase;
  triggers: string[];
}): WellnessSuggestion {
  const hasSleep = params.triggers.includes("Sleep");
  const hasComparison = params.triggers.includes("Comparison");
  const hasBurnout = params.triggers.includes("Burnout");

  if (params.moodScore <= 2 || hasBurnout) {
    return {
      id: "reset-nervous-system",
      title: "Start with your body, not the whole problem",
      body: "For the next three minutes, your only job is to slow the loop. A short grounding reset can make the next study decision feel smaller.",
      actionLabel: "Try grounding",
      exerciseId: "grounding"
    };
  }

  if (params.examPhase === "exam-week") {
    return {
      id: "exam-week-breathing",
      title: "Keep the next block small",
      body: "Exam week is not the moment to solve everything. Pick one revision block, one break, and one breath cycle before you judge the day.",
      actionLabel: "Do box breathing",
      exerciseId: "box-breathing"
    };
  }

  if (params.examPhase === "waiting-results") {
    return {
      id: "results-uncertainty",
      title: "Uncertainty needs a container",
      body: "Give result thoughts a fixed window, then return to something concrete: food, movement, sleep, or one conversation with someone safe.",
      actionLabel: "Use self-compassion",
      exerciseId: "self-compassion"
    };
  }

  if (hasComparison) {
    return {
      id: "comparison-soften",
      title: "Compare less, measure closer",
      body: "Notice one thing that improved since last week. Even a small revision habit counts more than someone else's highlight reel.",
      actionLabel: "Reflect kindly",
      exerciseId: "self-compassion"
    };
  }

  if (hasSleep) {
    return {
      id: "sleep-first",
      title: "Protect tonight's recovery",
      body: "A tired brain makes every chapter look bigger. Set a gentle stopping point and keep one wind-down action before sleep.",
      actionLabel: "Do box breathing",
      exerciseId: "box-breathing"
    };
  }

  return {
    id: "steady-study-day",
    title: "Keep the rhythm realistic",
    body: "You do not need a perfect day. Choose one focused study block and one real recovery break so your pace can last.",
    actionLabel: "Start a reset",
    exerciseId: "box-breathing"
  };
}

export function getSevenDaySummary(checkins: CheckIn[]) {
  const sorted = [...checkins].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const lastSeven = sorted.slice(-7);
  const average =
    lastSeven.length === 0
      ? 0
      : Number((lastSeven.reduce((total, item) => total + item.moodScore, 0) / lastSeven.length).toFixed(1));
  const goodDays = lastSeven.filter((item) => item.moodScore >= 4).length;

  return {
    lastSeven,
    average,
    goodDays,
    checkInCount: lastSeven.length
  };
}

export function isHighDistress(moodScore: number, triggers: string[]) {
  return moodScore <= 2 || triggers.includes("Burnout");
}
