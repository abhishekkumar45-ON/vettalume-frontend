"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, BarChart3, BookOpen, Brain, CheckCircle2 } from "lucide-react";

const exams = {
  CAT: {
    title: "CAT with VettaLume",
    summary:
      "The IIM gateway: 120 minutes, three sections, and a DILR block that quietly decides who gets the call.",
    stats: [
      ["120 min", "Test length"],
      ["3", "Sections"],
      ["99%", "Avg. target"],
      ["4x", "Prep speed"]
    ],
    insights: [
      "Reading comprehension and verbal ability",
      "Data interpretation and logical reasoning",
      "Quantitative aptitude across arithmetic and algebra"
    ],
    cards: [
      "Adaptive learning arms all three sections, with micro routes built from logged misses.",
      "DILR set selection trainer shows when to skip, solve, or return.",
      "Drill with section timers that mirror actual CAT pressure."
    ]
  },
  GMAT: {
    title: "GMAT Focus with VettaLume",
    summary:
      "A compact adaptive plan for Quant, Verbal, and Data Insights with daily calibration.",
    stats: [
      ["2h 15m", "Test length"],
      ["3", "Sections"],
      ["705+", "Target band"],
      ["18", "Skill lanes"]
    ],
    insights: [
      "Quant fundamentals with timed pattern detection",
      "Critical reasoning and reading comprehension",
      "Data insights from tables, charts, and multi-source prompts"
    ],
    cards: [
      "Diagnostic routing highlights the next highest-return topic.",
      "Error logs separate concept gaps from timing mistakes.",
      "Mock review turns every miss into one focused drill set."
    ]
  },
  GRE: {
    title: "GRE with VettaLume",
    summary:
      "Build balanced verbal and quant performance with a plan that keeps vocabulary, timing, and accuracy in sync.",
    stats: [
      ["1h 58m", "Test length"],
      ["2", "Core areas"],
      ["330+", "Top target"],
      ["30", "Daily mins"]
    ],
    insights: [
      "Text completion and sentence equivalence",
      "Quant comparison and problem solving",
      "Adaptive vocabulary review before retention drops"
    ],
    cards: [
      "Vocabulary queues reorder based on recall strength.",
      "Quant sets target the exact trap patterns behind misses.",
      "Score forecasts show which gains affect the final band."
    ]
  }
} as const;

export type ExamKey = keyof typeof exams;

type ExamShowcaseProps = {
  active: ExamKey;
  onChange: (exam: ExamKey) => void;
};

export default function ExamShowcase({ active, onChange }: ExamShowcaseProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const exam = exams[active];

  const tabItems = useMemo(() => Object.keys(exams) as ExamKey[], []);

  useEffect(() => {
    const bar = barRef.current;
    const sentinel = sentinelRef.current;
    const spacer = spacerRef.current;

    if (!bar || !sentinel || !spacer) {
      return;
    }

    const syncBar = () => {
      const headerHeight =
        document.querySelector(".siteHeader")?.getBoundingClientRect().height ?? 96;
      const barHeight = bar.offsetHeight;
      const pricingTop =
        document.getElementById("pricing")?.getBoundingClientRect().top ?? Infinity;
      const shouldFix =
        sentinel.getBoundingClientRect().top <= headerHeight &&
        pricingTop > headerHeight + barHeight + 4;

      bar.style.setProperty("--sticky-top", `${headerHeight}px`);

      if (shouldFix) {
        spacer.style.height = `${barHeight}px`;
        bar.classList.add("fixed");
      } else {
        spacer.style.height = "0px";
        bar.classList.remove("fixed");
      }
    };

    syncBar();
    window.addEventListener("scroll", syncBar, { passive: true });
    window.addEventListener("resize", syncBar);

    return () => {
      window.removeEventListener("scroll", syncBar);
      window.removeEventListener("resize", syncBar);
    };
  }, []);

  const selectExam = (item: ExamKey) => {
    onChange(item);

    if (barRef.current?.classList.contains("fixed") && panelRef.current) {
      const headerHeight =
        document.querySelector(".siteHeader")?.getBoundingClientRect().height ?? 96;
      const barHeight = barRef.current.offsetHeight;
      const panelTop = panelRef.current.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: panelTop - headerHeight - barHeight - 18,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="section examSection" id="courses" aria-labelledby="exam-heading">
      <div className="sectionInner">
        <div className="sectionHeader compactHeader">
          <p className="eyebrow">Same engine</p>
          <h2 id="exam-heading">Tuned for your test.</h2>
          <p>
            The adaptive core is shared. What changes is the question bank,
            section weighting, and the one feature each exam needs.
          </p>
        </div>

      </div>

      <div ref={sentinelRef} className="examSentinel" aria-hidden="true" />
      <div ref={barRef} className="examTabsShell">
        <div className="sectionInner">
          <div className="tabs" role="tablist" aria-label="Exam selection">
          {tabItems.map((item) => (
            <button
              className={item === active ? "tab active" : "tab"}
              key={item}
              type="button"
              role="tab"
              aria-selected={item === active}
              onClick={() => selectExam(item)}
            >
              {item}
            </button>
          ))}
          </div>
        </div>
      </div>
      <div ref={spacerRef} className="examBarSpacer" aria-hidden="true" />

      <div ref={panelRef} className="sectionInner">
        <div className="examGrid">
          <div className="examMain">
            <p className="eyebrow">{active} prep</p>
            <h3>{exam.title}</h3>
            <p>{exam.summary}</p>

            <div className="statPills">
              {exam.stats.map(([value, label]) => (
                <div className="statPill" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="examActions">
              <a className="button primary small" href="#trial">
                Start Free {active} Diagnostic
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="button ghost small" href="#how-it-works">
                See how the engine works
              </a>
            </div>
          </div>

          <div className="examInsights" aria-label={`${active} insights`}>
            <div className="insightTop">
              <BarChart3 size={24} aria-hidden="true" />
              <span>VAIQ</span>
              <p>{exam.insights[0]}.</p>
            </div>
            {exam.insights.map((item, index) => (
              <div className="insightRow" key={item}>
                {index === 0 ? (
                  <BookOpen size={20} aria-hidden="true" />
                ) : index === 1 ? (
                  <Brain size={20} aria-hidden="true" />
                ) : (
                  <CheckCircle2 size={20} aria-hidden="true" />
                )}
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="miniCards">
          {exam.cards.map((card) => (
            <article className="miniCard" key={card}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <p>{card}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
