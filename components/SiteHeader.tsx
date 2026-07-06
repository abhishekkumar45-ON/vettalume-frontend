"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, UserRound } from "lucide-react";
import AuthModal, { type AuthModalMode } from "@/components/AuthModal";
import Logo from "@/components/Logo";

type SiteHeaderProps = {
  showAnnouncement?: boolean;
};

export default function SiteHeader({ showAnnouncement = false }: SiteHeaderProps) {
  const [authMode, setAuthMode] = useState<AuthModalMode | null>(null);

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
            <button className="button primary navButton" type="button" onClick={() => setAuthMode("trial")}>
              Start Free Trial
            </button>
            <Link className="button dark navButton" href="/dashboard">
              Dashboard
            </Link>
            <Link className="iconButton" href="/cart" aria-label="Cart">
              <ShoppingCart size={24} aria-hidden="true" />
            </Link>
            <Link className="iconButton" href="/account" aria-label="Account">
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
      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />
    </>
  );
}
