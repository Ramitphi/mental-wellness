"use client";

import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, googleProvider, hasFirebaseConfig } from "@/lib/firebase";

type AuthContextValue = {
  user: Pick<User, "uid" | "email" | "displayName"> | null;
  loading: boolean;
  authActionLoading: boolean;
  authError: string | null;
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
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      queueMicrotask(() => {
        const storedDemo = window.localStorage.getItem("mw-demo-user");
        setUser(storedDemo ? demoUser : null);
        setLoading(false);
      });
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
      authActionLoading,
      authError,
      isDemoMode: !hasFirebaseConfig,
      signIn: async () => {
        setAuthActionLoading(true);
        setAuthError(null);

        try {
          if (!auth) {
            window.localStorage.setItem("mw-demo-user", "true");
            setUser(demoUser);
            return;
          }

          await signInWithPopup(auth, googleProvider);
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
        } finally {
          setAuthActionLoading(false);
        }
      },
      signOutUser: async () => {
        setAuthActionLoading(true);
        setAuthError(null);

        try {
          if (!auth) {
            window.localStorage.removeItem("mw-demo-user");
            setUser(null);
            return;
          }

          await signOut(auth);
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Sign-out failed. Please try again.");
        } finally {
          setAuthActionLoading(false);
        }
      }
    }),
    [authActionLoading, authError, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
