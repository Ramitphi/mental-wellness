"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createDemoProfile, getCheckins, getProfile, saveCheckIn, saveProfile } from "@/lib/storage";
import { getWellnessSuggestion } from "@/lib/wellness";
import type { CheckIn, UserProfile } from "@/lib/types";
import { useAuth } from "./AuthProvider";

type ProfileContextValue = {
  profile: UserProfile | null;
  checkins: CheckIn[];
  loading: boolean;
  refresh: () => Promise<void>;
  upsertProfile: (profile: UserProfile) => Promise<void>;
  addCheckIn: (input: Pick<CheckIn, "moodScore" | "moodEmoji" | "triggers" | "journalText">) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setCheckins([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const nextProfile = await getProfile(user.uid);
    setProfile(nextProfile);
    setCheckins(await getCheckins(user.uid));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      checkins,
      loading,
      refresh,
      upsertProfile: async (nextProfile) => {
        const saved = await saveProfile(nextProfile);
        setProfile(saved);
      },
      addCheckIn: async (input) => {
        if (!user) return;
        const fallbackProfile = profile ?? createDemoProfile(user.uid, user.email);
        const suggestion = getWellnessSuggestion({
          moodScore: input.moodScore,
          examPhase: fallbackProfile.examPhase,
          triggers: input.triggers
        });
        const saved = await saveCheckIn(user.uid, {
          ...input,
          suggestedSupportId: suggestion.id,
          createdAt: new Date().toISOString()
        });
        setCheckins((items) => [saved, ...items]);
      }
    }),
    [checkins, loading, profile, refresh, user]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const value = useContext(ProfileContext);
  if (!value) throw new Error("useProfile must be used inside ProfileProvider");
  return value;
}
