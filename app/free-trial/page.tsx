import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Compass, PartyPopper, Sparkles } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

// Free-trial landing: a simple "you're on a trial" confirmation + the free resources a learner can
// access. NOTE (placeholder): the exact free resources are still to be finalised — swap the cards
// below for the real list. Authorization/sign-in gating for the trial will be wired in later.
const resources = [
  {
    icon: <Compass size={20} aria-hidden="true" />,
    title: "Free diagnostic test",
    text: "Find out exactly where you stand — subtopic by subtopic — and get a personalised starting point.",
    href: "/how-it-works",
    cta: "Learn how it works"
  },
  {
    icon: <BookOpen size={20} aria-hidden="true" />,
    title: "Sample lessons",
    text: "Work through a set of concept lessons with worked examples from each section.",
    href: "/courses/cat",
    cta: "Browse courses"
  },
  {
    icon: <ClipboardList size={20} aria-hidden="true" />,
    title: "Sample mocks",
    text: "Try exam-style sectional and full-length mocks in the real test interface.",
    href: "/pricing",
    cta: "See what's included"
  }
];

export default function FreeTrialPage() {
  return (
    <>
      <SiteHeader />
      <main className="policyPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <span className="trialConfirmBadge">
              <PartyPopper size={16} aria-hidden="true" /> You&apos;re on a free trial
            </span>
            <h1>Yay — your free trial is on!</h1>
            <p>
              You&apos;ve got free access to a taste of Vettalume. Jump into the free resources below and
              start your prep — no strings attached.
            </p>
          </div>
        </section>

        <section className="howBody">
          <div className="howInner">
            <h2 className="aboutGridTitle" style={{ marginTop: 0 }}>
              <Sparkles size={18} aria-hidden="true" style={{ verticalAlign: "-3px", marginRight: 8, color: "var(--gold-dark)" }} />
              Free resources you can access
            </h2>
            <div className="aboutGrid">
              {resources.map((r) => (
                <article className="aboutCard" key={r.title}>
                  <div className="aboutCardIcon">{r.icon}</div>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <Link className="button ghost" href={r.href} style={{ marginTop: 14 }}>
                    {r.cta} <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="howCta">
              <Link className="button primary" href="/pricing">
                Upgrade for full access <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button ghost" href="/">
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
