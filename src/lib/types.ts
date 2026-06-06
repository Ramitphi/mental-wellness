export type ExamType =
  | "Boards"
  | "NEET"
  | "JEE"
  | "CUET"
  | "CAT"
  | "GATE"
  | "UPSC"
  | "Other";

export type ExamPhase = "preparing" | "exam-week" | "waiting-results" | "post-result";

export type AgeBand = "under-15" | "15-17" | "18-21" | "22-plus";

export type UserProfile = {
  uid: string;
  alias: string;
  email?: string | null;
  ageBand: AgeBand;
  examType: ExamType;
  examPhase: ExamPhase;
  supportPreference?: string;
  reminderTime: string;
  createdAt: string;
  updatedAt: string;
};

export type CheckIn = {
  id: string;
  moodScore: number;
  moodEmoji: string;
  triggers: string[];
  journalText: string;
  suggestedSupportId: string;
  createdAt: string;
};

export type WellnessSuggestion = {
  id: string;
  title: string;
  body: string;
  actionLabel: string;
  exerciseId: "box-breathing" | "grounding" | "self-compassion";
};
