"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowRight } from "lucide-react";

const exams = {
  CAT: {
    rest: "with VettaLume",
    blurb:
      "The IIM gateway. 120 minutes, three sections, and a DILR block that quietly decides who gets the call.",
    stats: [
      ["120 min", "Test length"],
      ["3", "Sections"],
      ["99%", "What we aim at"]
    ],
    rows: [
      ["VARC", "Reading comprehension and verbal ability."],
      ["DILR", "Data interpretation and logical reasoning. The cutoff decider since 2020."],
      ["QA", "Quantitative aptitude, mostly arithmetic, algebra and geometry."]
    ],
    trap:
      "DILR decides your percentile, and the real skill is set selection, not knowledge. Most students sink time into the wrong set and finish none. Nothing on the market trains that judgment.",
    instead:
      "Adaptive learning across all three sections, with mock review built into the loop instead of left to your willpower.",
    only: {
      title: "DILR set-selection trainer",
      body: "We drill the one meta-skill nothing else teaches: reading a set in seconds and deciding attempt or skip."
    }
  },
  GMAT: {
    rest: "with VettaLume",
    blurb:
      "Computer-adaptive and unforgiving early. A shared IRT core keeps your ability estimate honest, question by question.",
    stats: [
      ["2h 15m", "Test length"],
      ["3", "Sections"],
      ["705+", "What we aim at"]
    ],
    rows: [
      ["QUANT", "Problem solving with timed pattern detection."],
      ["VERBAL", "Critical reasoning and reading comprehension."],
      ["DATA", "Data insights from tables, charts and multi-source prompts."]
    ],
    trap:
      "Pacing and early accuracy dominate the score, yet most prep ignores how the adaptive engine actually moves.",
    instead:
      "Practice against a real IRT engine so the difficulty you see matches the difficulty on test day.",
    only: {
      title: "Adaptive pacing trainer",
      body: "Live ability tracking that shows when to push and when to protect a lead."
    }
  },
  GRE: {
    rest: "with VettaLume",
    blurb:
      "Section-adaptive with a wide score band. The win is knowing where a few points actually come from.",
    stats: [
      ["1h 58m", "Test length"],
      ["5", "Sections"],
      ["330+", "What we aim at"]
    ],
    rows: [
      ["VERBAL", "Text completion and sentence equivalence."],
      ["QUANT", "Quantitative comparison and problem solving."],
      ["VOCAB", "Adaptive vocabulary review before retention drops."]
    ],
    trap:
      "Vocabulary drilling feels productive but rarely moves the sections that carry the score.",
    instead:
      "Effort weighted to your highest-leverage sections, verified against real outcomes.",
    only: {
      title: "Section-leverage planner",
      body: "Shows the few question types where your next points are hiding."
    }
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
          <h2 id="exam-heading">
            Same engine.
            <br />
            Tuned for your test.
          </h2>
          <p>
            The adaptive core is shared. What changes is the question bank, the
            section weighting, and the one feature each exam needs. Switch
            anytime, your profile carries over.
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
            <h3>
              <span className="examKey">{active}</span> {exam.rest}
            </h3>
            <p>{exam.blurb}</p>

            <div className="statPills">
              {exam.stats.map(([value, label]) => (
                <div className="statPill" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="examInsights" aria-label={`${active} sections`}>
            {exam.rows.map(([code, desc]) => (
              <div className="insightRow" key={code}>
                <span className="code">{code}</span>
                <span className="desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="examBoxes">
          <article className="examBox">
            <span className="label">The trap</span>
            <p>{exam.trap}</p>
          </article>
          <article className="examBox">
            <span className="label">What we do instead</span>
            <p>{exam.instead}</p>
          </article>
          <article className="examBox only">
            <span className="label">Only on VettaLume</span>
            <h4>{exam.only.title}</h4>
            <p>{exam.only.body}</p>
          </article>
        </div>

        <div className="examActions">
          <a className="button primary small" href="#trial">
            Start Free {active} Diagnostic
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
