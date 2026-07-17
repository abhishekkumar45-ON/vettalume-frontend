"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass, LineChart, Radar, Repeat, ShieldCheck, Sparkles } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useUser } from "@/components/UserContext";

const offerings = [
  {
    icon: <Radar size={20} aria-hidden="true" />,
    title: "A diagnostic that tells the truth",
    text: "We start by measuring where you actually stand — subtopic by subtopic — instead of handing you a generic syllabus."
  },
  {
    icon: <Compass size={20} aria-hidden="true" />,
    title: "A roadmap built around you",
    text: "Your diagnostic becomes a personalised plan. Time goes where your score can move, not into what you already know."
  },
  {
    icon: <Sparkles size={20} aria-hidden="true" />,
    title: "Adaptive learning & practice",
    text: "Concept notes in the right order, and an engine that serves one question at a time at the edge of your ability."
  },
  {
    icon: <ShieldCheck size={20} aria-hidden="true" />,
    title: "Real exam-style mocks",
    text: "Sectional and full-length mocks in a distraction-free, exam-accurate interface — timers, palette, the works."
  },
  {
    icon: <LineChart size={20} aria-hidden="true" />,
    title: "Analysis, not just a score",
    text: "Every mock breaks down strong and weak topics, time-per-question, and exactly what to fix next."
  },
  {
    icon: <Repeat size={20} aria-hidden="true" />,
    title: "A loop that compounds",
    text: "Weak areas flow straight back into your plan. The roadmap recalibrates after every session, and your percentile climbs."
  }
];

const stats: Array<[string, string]> = [
  ["3", "Exams — CAT, GMAT & GRE"],
  ["100%", "Personalised study plans"],
  ["1", "Next step, always clear"],
  ["∞", "Adaptive practice questions"]
];

export default function AboutPage() {
  const router = useRouter();
  const { authed, openAuth } = useUser();

  function startDiagnostic() {
    if (authed) {
      router.push("/dashboard");
    } else {
      openAuth("login");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="policyPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>About Vettalume</h1>
            <p>
              We build prep that tells you the truth — personalised for CAT, GMAT and GRE, and designed to
              get you into the world&apos;s top B-schools.
            </p>
          </div>
        </section>

        <section className="howBody">
          <div className="howInner">
            <p className="howLede">
              Most aspirants follow the same study plan as everyone else and hope it works. We think that&apos;s
              backwards. Vettalume figures out where <em>you</em> actually stand, then guides you through
              learning, adaptive practice and full exam-style mocks &mdash; adjusting every step of the way.
              No two students get the same plan, because no two students learn the same way.
            </p>

            <div className="aboutBlock">
              <h2>What we&apos;re building</h2>
              <p>
                A single, honest prep platform for the exams that decide where you study next. Instead of
                pre-recorded lectures and one-size-fits-all problem sets, Vettalume runs on an adaptive engine
                that reacts to your performance in real time — so every hour you put in is aimed at the score
                that actually moves.
              </p>
            </div>

            <h2 className="aboutGridTitle">What you get</h2>
            <div className="aboutGrid">
              {offerings.map((item) => (
                <article className="aboutCard" key={item.title}>
                  <div className="aboutCardIcon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>

            <div className="aboutStats">
              {stats.map(([value, label]) => (
                <div className="aboutStat" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="howCta">
              <button className="button primary" type="button" onClick={startDiagnostic}>
                Start your diagnostic
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <Link className="button ghost" href="/how-it-works">
                See how it works
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
