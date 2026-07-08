"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, X } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useUser } from "@/components/UserContext";
import { EXAM_CATALOG } from "@/app/examCatalog";
import { getExam } from "@/app/learn/sectionData";

const ACCENTS = ["blue", "rose", "green"] as const;

function timeGreeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [diagnostic, setDiagnostic] = useState<{ percentile: number } | null>(null);
  const [greeting, setGreeting] = useState("Good Evening");
  const router = useRouter();

  const { firstName, activeExam, isOwned } = useUser();
  const exam = getExam(activeExam);
  const catalog = EXAM_CATALOG[activeExam];
  const owned = isOwned(activeExam);

  useEffect(() => {
    setGreeting(timeGreeting(new Date().getHours()));
  }, []);

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

  const abilityCards = useMemo(() => {
    if (!exam) return [];
    return exam.sections.map((section, index) => ({
      title: section.name,
      score: section.ability,
      coverage: section.syllabus,
      accent: ACCENTS[index % ACCENTS.length],
      href: `/learn/${activeExam}/${section.slug}`,
      action: `Enter ${section.name}`
    }));
  }, [exam, activeExam]);

  const recommendations = useMemo(() => {
    if (!exam) return [];
    return exam.sections
      .flatMap((section, sIndex) =>
        section.recommendations.map((rec) => ({
          title: rec.name,
          text: `${section.name} · focus area`,
          width: `${rec.pct}%`,
          tone: ACCENTS[sIndex % ACCENTS.length]
        }))
      )
      .slice(0, 4);
  }, [exam]);

  const subtext = useMemo(() => {
    if (!owned) {
      return `You haven't unlocked ${catalog.label} yet. Unlock the course to start your adaptive prep.`;
    }
    if (!exam || exam.sections.length === 0) return "";
    const sorted = [...exam.sections].sort((a, b) => b.ability - a.ability);
    const top = sorted[0];
    const low = sorted[sorted.length - 1];
    return `Good week overall, ${top.name} is carrying you at ${top.ability}. But ${low.name} needs you to buckle up, it's sitting at ${low.ability} and dragging the average.`;
  }, [owned, exam, catalog.label]);

  const sectionNames = exam?.sections.map((section) => section.name) ?? [];
  const mockCards: Array<[string, string, string, string]> = [
    [`${sectionNames[0] ?? "Sectional"} SM-1`, "90%", "Best Sectional Mock", "blue"],
    ["FLM-1", "74%", "Best Full Length Mock", "gold"],
    [`${sectionNames[1] ?? "Sectional"} SM-2`, "78%", "Last Sectional Mock", "rose"],
    ["FLM-2", "68%", "Last Full Length Mock", "gold"]
  ];

  const practiceCards: Array<[string, string, string, string]> = [
    ["Sectional mocks", "22", "/77", `/mocks/${activeExam}/sectional`],
    ["Full mocks", "7", "/100", `/mocks/${activeExam}/full`]
  ];

  return (
    <>
      <SiteHeader showExamSwitcher />
      <main className="dashboardPage">
        <section className="dashboardGreeting">
          <div className="sectionInner dashboardGreetingInner">
            <div className="greetingText">
              <h1>
                {greeting}
                {firstName ? `, ${firstName}` : ""}.
              </h1>
              <p>{subtext}</p>
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
                  <Link className="diagRetake" href={`/mocks/${activeExam}/full/start`}>
                    Retake
                  </Link>
                </div>
              ) : (
                <Link className="diagBtn" href={`/mocks/${activeExam}/full/start`}>
                  START MOCK
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </section>

        {owned ? (
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
                    <b>{card.coverage}%</b>
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
                  {recommendations.map((rec) => (
                    <article className={`recommendItem ${rec.tone}`} key={rec.title}>
                      <b>{rec.title}</b>
                      <span>{rec.text}</span>
                      <i style={{ "--progress": rec.width } as CSSProperties} />
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
                <article
                  className={`mockCard ${tone}`}
                  key={title}
                  style={{ "--v": `${parseInt(value, 10) || 0}%` } as CSSProperties}
                >
                  <span>{title}</span>
                  <strong>{value}</strong>
                  <p>{label}</p>
                  <i className="mockBar" aria-hidden="true" />
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
        ) : (
          <section className="dashboardBody sectionInner">
            <div className="lockedCourse">
              <span className="lockedIcon" aria-hidden="true">
                <Lock size={26} />
              </span>
              <h2>{catalog.label} is locked</h2>
              <p>
                You own the {EXAM_CATALOG.cat.label} course. Unlock {catalog.label} to access its adaptive
                learning, mocks, and analytics.
              </p>
              <Link className="button primary" href={`/courses/${activeExam}`}>
                Unlock {catalog.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}
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
