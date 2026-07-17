"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useUser } from "@/components/UserContext";

export default function SiteFooter() {
  const router = useRouter();
  const { authed, hydrated, activeExam, openAuth } = useUser();

  // Mock areas are gated: signed-in learners go straight to the mock page for their
  // active exam; everyone else is prompted to log in first.
  function goMock(kind: "sectional" | "full") {
    if (hydrated && authed) {
      router.push(`/mocks/${activeExam}/${kind}`);
    } else {
      openAuth("login");
    }
  }

  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerIntro">
          <Logo />
          <p>Prep that tells you the truth. Personalized for CAT, GMAT, and GRE. Built to get you into the world&apos;s top B-schools.</p>
        </div>
        <div className="footerLinks">
          <div>
            <strong>For Students</strong>
            <Link href="/dashboard">Learner Dashboard</Link>
            <button type="button" className="footerLinkButton" onClick={() => goMock("sectional")}>
              Sectional Mock
            </button>
            <button type="button" className="footerLinkButton" onClick={() => goMock("full")}>
              Full Length Mock
            </button>
          </div>
          <div>
            <strong>Vettalume</strong>
            <Link href="/about">About us</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/#testimonials">Testimonials</Link>
          </div>
          <div>
            <strong>Courses</strong>
            <Link href="/courses/cat">CAT</Link>
            <Link href="/courses/gre">GRE</Link>
            <Link href="/courses/gmat">GMAT</Link>
          </div>
        </div>
      </div>
      <div className="legalLinks">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
        <Link href="/content-license">Content License</Link>
        <Link href="/how-it-works">How it works</Link>
        <Link href="/return-refund-policy">Return &amp; Refund Policy</Link>
        <Link href="/contact">Contact us</Link>
      </div>
    </footer>
  );
}
