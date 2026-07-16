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
import {
  diagnosticApi,
  learnApi,
  mockApi,
  type DiagnosticState,
  type MockCardData,
  type MockCardsSummary
} from "@/lib/api";

const ACCENTS = ["blue", "rose", "green"] as const;

function timeGreeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [diagState, setDiagState] = useState<DiagnosticState | null>(null);
  const [greeting, setGreeting] = useState("Good Evening");
  // Real per-section ability/coverage (from /learn/overview) and published-mock counts (from /mocks).
  // Both are 0/empty for a new learner and grow as they learn / as an admin publishes mocks.
  const [secStats, setSecStats] = useState<Record<string, { ability: number; syllabus: number }>>({});
  const [mockCounts, setMockCounts] = useState<{ sectional: number; full: number }>({ sectional: 0, full: 0 });
  const [mockSummary, setMockSummary] = useState<MockCardsSummary | null>(null);
  const router = useRouter();

  const { firstName, activeExam, isOwned } = useUser();
  const exam = getExam(activeExam);
  const catalog = EXAM_CATALOG[activeExam];
  const owned = isOwned(activeExam);

  useEffect(() => {
    setGreeting(timeGreeting(new Date().getHours()));
  }, []);

  // Real diagnostic state for the active exam (available | in_progress | completed | not_configured).
  useEffect(() => {
    if (!owned || !activeExam) {
      setDiagState(null);
      return;
    }
    let alive = true;
    diagnosticApi
      .status(activeExam)
      .then((s) => alive && setDiagState(s.state))
      .catch(() => alive && setDiagState(null));
    return () => {
      alive = false;
    };
  }, [owned, activeExam]);

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
    mockApi
      .summary(activeExam)
      .then((s) => {
        if (alive) setMockSummary(s);
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
    // From every section, nudge the learner to finish the next 2 chapters they left below 50%.
    // Highest-first among the sub-50% chapters, so the ones closest to done surface as quick wins.
    return exam.sections.flatMap((section, sIndex) => {
      const toFinish = section.groups
        .flatMap((group) => group.chapters)
        .filter((chapter) => chapter.pct < 50)
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 2);
      return toFinish.map((chapter) => ({
        key: `${section.slug}-${chapter.name}`,
        title: chapter.name,
        text: `${section.name} · ${chapter.pct}% done — finish this chapter`,
        width: `${chapter.pct}%`,
        tone: ACCENTS[sIndex % ACCENTS.length]
      }));
    });
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

  // Best / last sectional + full mock cards — every value comes from /mocks/summary. Empty until the
  // learner has attempts. Percentage = round(score / totalMarks * 100); the wave fills to it.
  const mockCard = (
    c: MockCardData | undefined,
    label: string,
    tone: string
  ): [string, string, string, string] => {
    if (!c || !c.marksTotal) return ["No Attempt Yet", "0%", label, tone];
    // clamp to 0–100 (a net-negative score → 0%, matching the empty-state behaviour)
    const pct = Math.max(0, Math.min(100, Math.round((c.score / c.marksTotal) * 100)));
    return [c.name, `${pct}%`, label, tone];
  };
  const mockCards: Array<[string, string, string, string]> = [
    mockCard(mockSummary?.bestSectional, "Best Sectional Mock", "blue"),
    mockCard(mockSummary?.bestFull, "Best Full Length Mock", "gold"),
    mockCard(mockSummary?.lastSectional, "Last Sectional Mock", "rose"),
    mockCard(mockSummary?.lastFull, "Last Full Length Mock", "gold")
  ];

  // Attempted / available: distinct mocks attempted (from /mocks/summary) over how many an admin has
  // published. The tile's bar fills to attempted / available.
  const secDone = mockSummary?.sectionalAttempted ?? 0;
  const fullDone = mockSummary?.fullAttempted ?? 0;
  const fillPct = (done: number, total: number) =>
    total > 0 ? Math.round((Math.min(done, total) / total) * 100) : 0;
  const practiceCards: Array<[string, string, string, string, number]> = [
    [
      "Sectional mocks",
      String(secDone),
      `/${mockCounts.sectional}`,
      `/mocks/${activeExam}/sectional`,
      fillPct(secDone, mockCounts.sectional)
    ],
    [
      "Full mocks",
      String(fullDone),
      `/${mockCounts.full}`,
      `/mocks/${activeExam}/full`,
      fillPct(fullDone, mockCounts.full)
    ]
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
                {firstName ? `, ${firstName}!` : "."}
              </h1>
              <p>{subtext}</p>
            </div>
            <div className="diagnosticBox">
              <small>ONE-TIME</small>
              <h3>Diagnostic Test</h3>
              {diagState === "completed" ? (
                <div className="diagScore">
                  <span className="diagDone">Completed</span>
                  <Link className="diagRetake" href={`/diagnostic/${activeExam}/result`}>
                    View result
                  </Link>
                </div>
              ) : diagState === "not_configured" ? (
                <span className="diagUnavailable">Not available yet</span>
              ) : (
                <Link className="diagBtn" href={`/diagnostic/${activeExam}`}>
                  {diagState === "in_progress" ? "RESUME" : "START"}
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
                  <div className="abilityGauge">
                    <svg className="gaugeArc" viewBox="0 0 100 100" aria-hidden="true">
                      <circle className="gaugeTrack" cx="50" cy="50" r="42" pathLength={100} />
                      <circle
                        className="gaugeValue"
                        cx="50"
                        cy="50"
                        r="42"
                        pathLength={100}
                        style={{ "--pct": Math.max(0, Math.min(100, card.score)) } as CSSProperties}
                      />
                    </svg>
                    <div className="gaugeText">
                      <span>{card.title}</span>
                      <strong>{card.score}</strong>
                      <small>ABILITY</small>
                    </div>
                  </div>
                  <div className="coverage">
                    <span>SYLLABUS COVERAGE</span>
                    <b>{card.coverage}%</b>
                    <i style={{ "--cov": `${Math.max(0, Math.min(100, card.coverage))}%` } as CSSProperties} />
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
                    <article className={`recommendItem ${rec.tone}`} key={rec.key}>
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
                  key={label}
                  style={{ "--v": `${parseInt(value, 10) || 0}%` } as CSSProperties}
                >
                  <span>{title}</span>
                  <strong>{value}</strong>
                  <p>{label}</p>
                  <i className="mockFill" aria-hidden="true" />
                </article>
              ))}
            </div>

            <div className="practiceTiles">
              {practiceCards.map(([title, done, total, href, pct]) => (
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
                  <i style={{ "--progress": `${pct}%` } as CSSProperties} />
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
