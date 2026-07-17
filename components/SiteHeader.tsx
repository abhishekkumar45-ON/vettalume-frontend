"use client";

import Link from "next/link";
import { ShoppingCart, UserRound } from "lucide-react";
import ExamSwitcher from "@/components/ExamSwitcher";
import Logo from "@/components/Logo";
import { useUser } from "@/components/UserContext";
import { useCart } from "@/components/CartContext";

type SiteHeaderProps = {
  showAnnouncement?: boolean;
  showExamSwitcher?: boolean;
};

export default function SiteHeader({
  showAnnouncement = false,
  showExamSwitcher = false
}: SiteHeaderProps) {
  const { authed, hydrated, openAuth } = useUser();
  const { count } = useCart();

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
              <button className="button ghost navButton" type="button" onClick={() => openAuth("login")}>
                Log in
              </button>
            ) : null}
            <button className="button primary navButton" type="button" onClick={() => openAuth("trial")}>
              Start Free Trial
            </button>
            <Link className="iconButton cartIconButton" href="/cart" aria-label="Cart">
              <ShoppingCart size={24} aria-hidden="true" />
              {count > 0 ? <span className="cartCount">{count}</span> : null}
            </Link>
            <Link
              className="iconButton"
              href={authed ? "/account" : "#"}
              aria-label="Account"
              onClick={(event) => {
                if (!authed) {
                  event.preventDefault();
                  openAuth("login");
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
    </>
  );
}
