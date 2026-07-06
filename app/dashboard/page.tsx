"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const abilityCards = [
  { title: "Quants", score: 40, accent: "blue", action: "Enter Quants", href: "/learn/cat/qa" },
  { title: "VARC", score: 40, accent: "rose", action: "Enter VARC", href: "/learn/cat/varc" },
  { title: "DILR", score: 40, accent: "green", action: "Enter DILR", href: "/learn/cat/dilr" }
];

const recommendations = [
  ["Sentence Correction", "DILR · lowest ability section", "62%", "blue"],
  ["Data Sufficiency", "DILR · lowest ability section", "62%", "rose"],
  ["Multi-Source Reasoning", "DILR · lowest ability section", "60%", "green"],
  ["Critical Reasoning", "DILR · lowest ability section", "62%", "rose"]
];

const mockCards = [
  ["Quants SM-1", "90%", "Best Sectional Mock", "blue"],
  ["FLM-1", "74%", "Best Full Length Mock", "gold"],
  ["Verbal SM-2", "78%", "Last Sectional Mock", "rose"],
  ["FLM-2", "68%", "Last Full Length Mock", "gold"]
];

const practiceCards = [
  ["Sectional mocks", "22", "/77", "/mocks/cat/sectional"],
  ["Full mocks", "7", "/100", "/mocks/cat/full"]
];

export default function DashboardPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [diagnostic, setDiagnostic] = useState<{ percentile: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vetta:diagnostic");
      if (raw) {
        setDiagnostic(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="dashboardPage">
        <section className="dashboardGreeting">
          <div className="sectionInner dashboardGreetingInner">
            <div className="greetingText">
              <h1>Good Evening, Aanya.</h1>
              <p>
                Good week overall, QA is carrying you at 82. But DILR needs you
                to buckle up, it&apos;s sitting at 54 and dragging the average.
              </p>
            </div>
            <div className="diagnosticBox">
              <small>PRACTICE</small>
              <h3>Diagnostic Test</h3>
              {diagnostic ? (
                <div className="diagScore">
                  <strong>
                    {diagnostic.percentile}
                    <em>ile</em>
                  </strong>
                  <a className="diagRetake" href="/mock-attempt.html?exam=cat&diagnostic=1">
                    Retake
                  </a>
                </div>
              ) : (
                <a className="diagBtn" href="/mock-attempt.html?exam=cat&diagnostic=1">
                  START MOCK
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="dashboardBody sectionInner">
          <div className="abilityGrid">
            {abilityCards.map((card) => (
              <article className={`abilityCard ${card.accent}`} key={card.title}>
                <div className="abilityGauge" aria-hidden="true">
                  <span>{card.title}</span>
                  <strong>{card.score}</strong>
                  <small>ABILITY</small>
                </div>
                <div className="coverage">
                  <span>SYLLABUS COVERAGE</span>
                  <b>40%</b>
                  <i />
                </div>
                <button type="button" onClick={() => router.push(card.href)}>
                  {card.action}
                  <ArrowRight size={34} aria-hidden="true" />
                </button>
              </article>
            ))}
            <aside className="recommendPanel">
              <h2>Recommended for you</h2>
              <div className="recommendList">
                {recommendations.map(([title, text, width, tone]) => (
                  <article className={`recommendItem ${tone}`} key={title}>
                    <b>{title}</b>
                    <span>{text}</span>
                    <i style={{ "--progress": width } as CSSProperties} />
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <div className="mockHead">
            <h2>Best Mock</h2>
            <h2>Last Mock</h2>
          </div>
          <div className="mockGrid">
            {mockCards.map(([title, value, label, tone]) => (
              <article className={`mockCard ${tone}`} key={title}>
                <span>{title}</span>
                <strong>{value}</strong>
                <p>{label}</p>
              </article>
            ))}
          </div>

          <div className="practiceTiles">
            {practiceCards.map(([title, done, total, href]) => (
              <article
                className="practiceTile"
                key={title}
                onClick={() => router.push(href)}
                style={{ cursor: "pointer" }}
              >
                <small>PRACTICE</small>
                <h3>{title}</h3>
                <div>
                  <strong>{done}</strong>
                  <span>{total}</span>
                </div>
                <i />
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    router.push(href);
                  }}
                >
                  START MOCK
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />

      {confirmOpen ? (
        <div className="confirmOverlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <section className="confirmDialog">
            <button className="confirmClose" type="button" aria-label="Close" onClick={() => setConfirmOpen(false)}>
              <X size={22} aria-hidden="true" />
            </button>
            <h2 id="confirm-title">Confirmation</h2>
            <div className="confirmIcon">!</div>
            <ul>
              <li>Do not press the back button or you will lose your progress</li>
              <li>Finish within the time limit</li>
              <li>You can retake the exam later</li>
            </ul>
            <button className="button primary confirmStart" type="button" onClick={() => setConfirmOpen(false)}>
              START EXAM
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
