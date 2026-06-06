"use client";

import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider, hasFirebaseConfig } from "@/lib/firebase";

type AuthContextValue = {
  user: Pick<User, "uid" | "email" | "displayName"> | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isDemoMode: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const demoUser = {
  uid: "demo-student",
  email: "student@example.com",
  displayName: "Demo Student"
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextValue["user"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      const storedDemo = window.localStorage.getItem("mw-demo-user");
      setUser(storedDemo ? demoUser : null);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isDemoMode: !hasFirebaseConfig,
      signIn: async () => {
        if (!auth) {
          window.localStorage.setItem("mw-demo-user", "true");
          setUser(demoUser);
          return;
        }

        await signInWithPopup(auth, googleProvider);
      },
      signOutUser: async () => {
        if (!auth) {
          window.localStorage.removeItem("mw-demo-user");
          setUser(null);
          return;
        }

        await signOut(auth);
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
