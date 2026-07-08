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
import { learnApi, mockApi } from "@/lib/api";

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
  // Real per-section ability/coverage (from /learn/overview) and published-mock counts (from /mocks).
  // Both are 0/empty for a new learner and grow as they learn / as an admin publishes mocks.
  const [secStats, setSecStats] = useState<Record<string, { ability: number; syllabus: number }>>({});
  const [mockCounts, setMockCounts] = useState<{ sectional: number; full: number }>({ sectional: 0, full: 0 });
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

  // Pull real ability/coverage + mock availability for the active exam.
  useEffect(() => {
    if (!owned || !activeExam) return;
    let alive = true;
    learnApi
      .overview(activeExam)
      .then((ov) => {
        if (!alive) return;
        const map: Record<string, { ability: number; syllabus: number }> = {};
        (ov.sections || []).forEach((s) => {
          map[s.key.toLowerCase()] = { ability: s.ability, syllabus: s.syllabus };
        });
        setSecStats(map);
      })
      .catch(() => {});
    Promise.all([mockApi.list(activeExam, "sectional"), mockApi.list(activeExam, "full")])
      .then(([sec, full]) => {
        if (alive) setMockCounts({ sectional: sec.count, full: full.count });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [owned, activeExam]);

  const abilityCards = useMemo(() => {
    if (!exam) return [];
    return exam.sections.map((section, index) => {
      const st = secStats[section.slug.toLowerCase()];
      return {
        title: section.name,
        score: st ? st.ability : 0,
        coverage: st ? st.syllabus : 0,
        accent: ACCENTS[index % ACCENTS.length],
        href: `/learn/${activeExam}/${section.slug}`,
        action: `Enter ${section.name}`
      };
    });
  }, [exam, activeExam, secStats]);

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
    const withStats = exam.sections.map((s) => ({
      name: s.name,
      ability: secStats[s.slug.toLowerCase()]?.ability ?? 0
    }));
    if (!withStats.some((s) => s.ability > 0)) {
      return "Your dashboard is ready. Start learning or take a mock, and your ability will build here.";
    }
    const sorted = [...withStats].sort((a, b) => b.ability - a.ability);
    const top = sorted[0];
    const low = sorted[sorted.length - 1];
    return `Good progress overall — ${top.name} leads at ${top.ability}, while ${low.name} needs attention at ${low.ability} and is dragging the average.`;
  }, [owned, exam, catalog.label, secStats]);

  const sectionNames = exam?.sections.map((section) => section.name) ?? [];
  // No mock attempts are tracked yet (post-mock analysis is a later phase), so best/last scores start
  // empty. They fill once attempt history exists.
  const mockCards: Array<[string, string, string, string]> = [
    [`${sectionNames[0] ?? "Sectional"} SM`, "—", "Best Sectional Mock", "blue"],
    ["FLM", "—", "Best Full Length Mock", "gold"],
    [`${sectionNames[1] ?? "Sectional"} SM`, "—", "Last Sectional Mock", "rose"],
    ["FLM", "—", "Last Full Length Mock", "gold"]
  ];

  // Attempted / available. Attempts aren't tracked yet, so "attempted" is 0; the total is how many
  // mocks an admin has published (0 until they publish one).
  const practiceCards: Array<[string, string, string, string]> = [
    ["Sectional mocks", "0", `/${mockCounts.sectional}`, `/mocks/${activeExam}/sectional`],
    ["Full mocks", "0", `/${mockCounts.full}`, `/mocks/${activeExam}/full`]
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
