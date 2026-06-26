"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight, X } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const abilityCards = [
  { title: "Quants", score: 40, accent: "blue", action: "Enter Quants" },
  { title: "VARC", score: 40, accent: "rose", action: "Enter VARC" },
  { title: "DILR", score: 40, accent: "green", action: "Enter DILR" }
];

const recommendations = [
  ["Sentence Correction", "DILR · lowest ability section", "62%"],
  ["Data Sufficiency", "DILR · lowest ability section", "62%"],
  ["Multi-Source Reasoning", "DILR · lowest ability section", "60%"],
  ["Critical Reasoning", "DILR · lowest ability section", "62%"]
];

const mockCards = [
  ["Quants SM-1", "90%", "Best Sectional Mock", "blue"],
  ["FLM-1", "74%", "Best Full Length Mock", "gold"],
  ["Verbal SM-2", "78%", "Last Sectional Mock", "rose"],
  ["FLM-2", "68%", "Last Full Length Mock", "gold"]
];

const practiceCards = [
  ["Sectional mocks", "22", "/77"],
  ["Full mocks", "7", "/100"],
  ["Topic Practice", "38", "/184"]
];

export default function DashboardPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <SiteHeader />
      <main className="dashboardPage">
        <section className="dashboardGreeting">
          <div className="sectionInner">
            <h1>Good Evening, Aanya.</h1>
            <p>
              Good week overall, QA is carrying you at 82. But DILR needs you
              to buckle up, it&apos;s sitting at 54 and dragging the average.
            </p>
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
                <button type="button">
                  {card.action}
                  <ArrowRight size={34} aria-hidden="true" />
                </button>
              </article>
            ))}
            <aside className="recommendPanel">
              <h2>Recommended for you</h2>
              <div className="recommendList">
                {recommendations.map(([title, text, width]) => (
                  <article className="recommendItem" key={title}>
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
            {practiceCards.map(([title, done, total]) => (
              <article className="practiceTile" key={title}>
                <small>PRACTICE</small>
                <h3>{title}</h3>
                <div>
                  <strong>{done}</strong>
                  <span>{total}</span>
                </div>
                <i />
                <button type="button" onClick={() => setConfirmOpen(true)}>
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
