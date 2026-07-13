import Link from "next/link";
import Logo from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footerInner">
        <div className="footerIntro">
          <Logo />
          <p>Prep that tells you the truth. CAT, GMAT and GRE, into the top B-schools.</p>
        </div>
        <div className="footerLinks">
          <div>
            <strong>For Students</strong>
            <Link href="/dashboard">Learner Dashboard</Link>
            <Link href="/dashboard">Sectional Mock</Link>
            <Link href="/dashboard">Full Length Mock</Link>
          </div>
          <div>
            <strong>Vettalume</strong>
            <Link href="/">About us</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/pricing">Testimonials</Link>
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
