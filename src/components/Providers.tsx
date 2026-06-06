"use client";

import { AuthProvider } from "./AuthProvider";
import { ProfileProvider } from "./ProfileProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>{children}</ProfileProvider>
    </AuthProvider>
  );
}
