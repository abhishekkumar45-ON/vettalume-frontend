"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AuthModal, { type AuthModalMode } from "@/components/AuthModal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useUser } from "@/components/UserContext";

const steps = [
  {
    title: "Take a quick diagnostic",
    body:
      "You start with a short diagnostic instead of a generic syllabus. It measures where you actually stand across every section — VARC, DILR and QA for CAT, and the equivalent areas for GMAT and GRE.",
    points: [
      "No preparation needed — just answer honestly.",
      "We map your real strengths and gaps, subtopic by subtopic.",
      "Takes minutes, and sets the starting point for everything that follows."
    ]
  },
  {
    title: "Get a roadmap built around you",
    body:
      "The engine turns your diagnostic into a personalised roadmap. Two aspirants with the same target get two different plans — because they don't have the same strengths or the same time.",
    points: [
      "Time is spent where your score can actually move, not on what you already know.",
      "Every session opens with a clear next step — no more wondering what to study.",
      "The plan keeps adapting as your ability changes."
    ]
  },
  {
    title: "Learn concepts, guided step by step",
    body:
      "For each topic you work through concept notes and worked examples in the right order. The platform decides what to teach next based on what you've mastered and what you're ready to learn.",
    points: [
      "Guided “learn-next” picks the concept you're prepared for — never too easy, never a wall.",
      "Topics you cross the mastery bar on are marked learnt and stop crowding your queue.",
      "Everything you do here feeds your live ability score for the chapter."
    ]
  },
  {
    title: "Practice that adapts to you",
    body:
      "Practice isn't a fixed problem set. An adaptive engine serves one question at a time, mixing across subtopics and stepping up the difficulty for each subtopic as you get answers right.",
    points: [
      "Questions mix across subtopics so you don't grind one thing for an hour.",
      "Each subtopic climbs its own easy → hard ladder as you improve.",
      "Once you've mastered a subtopic, its questions drop out — every question is one you can still learn from."
    ]
  },
  {
    title: "Take sectional & full-length mocks",
    body:
      "When you're ready, sit real exam-style mocks in a distraction-free, CAT-style interface — section timers, question palette, on-screen calculator, and two-pane reading passages.",
    points: [
      "Sectional mocks to drill one area; full-length mocks that run sections in sequence, just like the real test.",
      "Timers auto-submit each section, so you build the pacing the exam demands.",
      "Everything you attempt is saved for analysis."
    ]
  },
  {
    title: "Review deep analysis, then loop back",
    body:
      "After every mock you get a full breakdown — not just a score. See which subtopics are strong and weak, how long each question cost you, and exactly what to fix next.",
    points: [
      "Strong / weak topics ranked by coverage, plus concrete recommendations.",
      "Time-per-question chart shows where you're bleeding minutes.",
      "Weak areas flow straight back into your roadmap and practice — the loop repeats and your percentile climbs."
    ]
  }
];

export default function HowItWorksPage() {
  const router = useRouter();
  const { authed, signIn } = useUser();
  const [authMode, setAuthMode] = useState<AuthModalMode | null>(null);

  function startDiagnostic() {
    if (authed) {
      router.push("/dashboard");
    } else {
      setAuthMode("login");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="policyPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>How Vettalume works</h1>
            <p>
              Diagnose, learn, practise, and mock &mdash; on a plan built around your strengths, weaknesses, and the
              time you actually have.
            </p>
          </div>
        </section>

        <section className="howBody">
          <div className="howInner">
            <p className="howLede">
              Most aspirants follow the same study plan and hope it works. Vettalume does the opposite: it figures out
              where you stand, then guides you through learning, adaptive practice, and full exam-style mocks &mdash;
              adjusting every step of the way. Here&apos;s the journey from your first session to your target percentile.
            </p>

            <div className="howSteps">
              {steps.map((step, index) => (
                <article className="howStep" key={step.title}>
                  <div className="howStepNum">{index + 1}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <ul>
                      {step.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <div className="howCta">
              <button className="button primary" type="button" onClick={startDiagnostic}>
                Start your diagnostic
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <Link className="button ghost" href="/pricing">
                See pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onModeChange={setAuthMode}
        onSignIn={signIn}
      />
    </>
  );
}
