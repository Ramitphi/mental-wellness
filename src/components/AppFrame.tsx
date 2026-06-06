"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BookOpen, Dumbbell, MessageCircle, Settings } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useProfile } from "./ProfileProvider";

const navItems = [
  { href: "/dashboard", label: "Sanctuary", icon: Activity },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/exercises", label: "Breath", icon: Dumbbell },
  { href: "/listener", label: "Listener", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppFrame({ children, requireProfile = true }: { children: React.ReactNode; requireProfile?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requireProfile && !profile && !profileError) router.replace("/onboarding");
  }, [authLoading, profileError, profileLoading, profile, requireProfile, router, user]);

  if (authLoading || profileLoading) {
    return (
      <main className="page-shell">
        <section className="phone-frame">
          <div className="screen">
            <p className="eyebrow">MindTrack</p>
            <h1>Opening your calm space</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="phone-frame">
        {user && profileError ? (
          <div className="screen stack">
            <div>
              <p className="eyebrow">Firebase setup</p>
              <h1>MindTrack could not reach Firestore.</h1>
              <p className="muted">{profileError}</p>
            </div>
            <section className="card alert stack">
              <h2>Check these before retrying</h2>
              <p>Make sure Firestore is created, Google auth is enabled, and the rules in this repo are deployed.</p>
            </section>
          </div>
        ) : (
          children
        )}
        {requireProfile && user && profile ? (
          <nav className="bottom-nav" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} className="nav-link" href={item.href} data-active={pathname === item.href}>
                  <Icon aria-hidden="true" size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        ) : null}
      </section>
    </main>
  );
}
