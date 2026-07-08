"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, UserRound } from "lucide-react";
import AuthModal, { type AuthModalMode } from "@/components/AuthModal";
import ExamSwitcher from "@/components/ExamSwitcher";
import Logo from "@/components/Logo";
import { useUser } from "@/components/UserContext";

type SiteHeaderProps = {
  showAnnouncement?: boolean;
  showExamSwitcher?: boolean;
};

export default function SiteHeader({
  showAnnouncement = false,
  showExamSwitcher = false
}: SiteHeaderProps) {
  const [authMode, setAuthMode] = useState<AuthModalMode | null>(null);
  const { signIn, authed, hydrated } = useUser();

  return (
    <>
      <header className="siteHeader">
        <nav className="navShell" aria-label="Main navigation">
          <Logo compact />
          <div className="navLinks">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/courses/cat">Explore courses</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div className="navActions">
            {showExamSwitcher && authed ? <ExamSwitcher /> : null}
            {hydrated && !authed ? (
              <button className="button ghost navButton" type="button" onClick={() => setAuthMode("login")}>
                Log in
              </button>
            ) : null}
            <button className="button primary navButton" type="button" onClick={() => setAuthMode("trial")}>
              Start Free Trial
            </button>
            {authed ? (
              <Link className="button dark navButton" href="/dashboard">
                Dashboard
              </Link>
            ) : null}
            <Link className="iconButton" href="/cart" aria-label="Cart">
              <ShoppingCart size={24} aria-hidden="true" />
            </Link>
            <Link
              className="iconButton"
              href={authed ? "/account" : "#"}
              aria-label="Account"
              onClick={(event) => {
                if (!authed) {
                  event.preventDefault();
                  setAuthMode("login");
                }
              }}
            >
              <UserRound size={24} aria-hidden="true" />
            </Link>
          </div>
        </nav>
        {showAnnouncement ? (
          <Link className="announcement" href="/pricing">
            Get flat 25% discount using coupon NEWLUME25. Valid for limited time only.
          </Link>
        ) : null}
      </header>
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onModeChange={setAuthMode}
        onSignIn={signIn}
      />
    </>
  );
}
