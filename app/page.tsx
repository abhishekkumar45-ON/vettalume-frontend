"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Check,
  LockKeyhole,
  Sparkles,
  Target,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthModal, { type AuthModalMode } from "@/components/AuthModal";
import ExamShowcase, { type ExamKey } from "@/components/ExamShowcase";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useUser } from "@/components/UserContext";

const featureCards = [
  {
    icon: <Target size={20} aria-hidden="true" />,
    title: "One plan for everyone",
    text: "Identical schedules, whatever your start point."
  },
  {
    icon: <BookOpen size={20} aria-hidden="true" />,
    title: "Drilling what you know",
    text: "More repeats where the score can barely move."
  },
  {
    icon: <LockKeyhole size={20} aria-hidden="true" />,
    title: "No clear next step",
    text: "You finish a session unsure what to open next."
  }
];

type PricingPlan = {
  name: string;
  price: string;
  period: string;
  featured?: boolean;
  features: string[];
};

const examTabs: ExamKey[] = ["CAT", "GMAT", "GRE"];

const pricingByExam: Record<
  ExamKey,
  {
    startsAt: string;
    focus: string;
    plans: PricingPlan[];
  }
> = {
  CAT: {
    startsAt: "Rs 499",
    focus: "CAT plans emphasize DILR set selection, full-length mocks, and section-balanced review.",
    plans: [
      {
        name: "Spark",
        price: "Rs 499",
        period: "1 month",
        features: ["Adaptive CAT engine", "2 full-length mocks", "Unlimited sectional drills"]
      },
      {
        name: "Kindle",
        price: "Rs 999",
        period: "3 months",
        features: ["Full CAT question bank", "Personalized roadmap", "6 full-length mocks"]
      },
      {
        name: "Glow",
        price: "Rs 1,999",
        period: "6 months",
        featured: true,
        features: ["Root-cause analytics", "Mock review workflow", "DILR set-selection trainer"]
      },
      {
        name: "Blaze",
        price: "Rs 3,499",
        period: "12 months",
        features: ["Priority doubt support", "30 full-length mocks", "2 mentor strategy calls"]
      },
      {
        name: "Lumen",
        price: "Rs 5,999",
        period: "Till exam",
        features: ["Unlimited mocks", "Weekly mentor calls", "Valid till exam day"]
      }
    ]
  },
  GMAT: {
    startsAt: "Rs 999",
    focus: "GMAT plans focus on Quant, Verbal, and the new Data Insights formats.",
    plans: [
      {
        name: "Spark",
        price: "Rs 999",
        period: "1 month",
        features: ["Adaptive GMAT engine", "2 focus-edition mocks", "Quant and Verbal drills"]
      },
      {
        name: "Kindle",
        price: "Rs 1,999",
        period: "3 months",
        features: ["Full GMAT bank", "Personalized roadmap", "Data Insights practice sets"]
      },
      {
        name: "Glow",
        price: "Rs 3,999",
        period: "6 months",
        featured: true,
        features: ["Root-cause analytics", "Mock review workflow", "Data Insights engine"]
      },
      {
        name: "Blaze",
        price: "Rs 6,999",
        period: "12 months",
        features: ["Priority doubt support", "30 focus-edition mocks", "2 mentor strategy calls"]
      },
      {
        name: "Lumen",
        price: "Rs 11,999",
        period: "Till exam",
        features: ["Unlimited mocks", "Weekly mentor calls", "Application-season validity"]
      }
    ]
  },
  GRE: {
    startsAt: "Rs 799",
    focus: "GRE plans balance Quant, Verbal, vocabulary retention, and section-adaptive strategy.",
    plans: [
      {
        name: "Spark",
        price: "Rs 799",
        period: "1 month",
        features: ["Adaptive GRE engine", "2 full-length mocks", "Vocab recall queue"]
      },
      {
        name: "Kindle",
        price: "Rs 1,599",
        period: "3 months",
        features: ["Full GRE question bank", "Personalized roadmap", "Quant comparison drills"]
      },
      {
        name: "Glow",
        price: "Rs 2,999",
        period: "6 months",
        featured: true,
        features: ["Root-cause analytics", "Mock review workflow", "Vocabulary SRS in-engine"]
      },
      {
        name: "Blaze",
        price: "Rs 4,999",
        period: "12 months",
        features: ["Priority doubt support", "30 full-length mocks", "2 mentor strategy calls"]
      },
      {
        name: "Lumen",
        price: "Rs 8,999",
        period: "Till exam",
        features: ["Unlimited mocks", "Weekly mentor calls", "Valid till exam day"]
      }
    ]
  }
};

const dashboardByExam: Record<
  ExamKey,
  {
    plan: string;
    percentile: string;
    allocation: string;
    risk: string;
    chips: string[];
  }
> = {
  CAT: {
    plan: "Attempt 2 timed DILR sets, then review para jumbles at 4 PM.",
    percentile: "91.4",
    allocation: "DILR focus",
    risk: "Verbal accuracy",
    chips: ["Set selection", "Root cause", "Next action"]
  },
  GMAT: {
    plan: "Run 14 Data Insights prompts, then review critical reasoning misses.",
    percentile: "705",
    allocation: "Data Insights",
    risk: "Quant timing",
    chips: ["DI engine", "Focus edition", "Timing split"]
  },
  GRE: {
    plan: "Review vocab recall queue, then complete 18 quant comparison drills.",
    percentile: "326",
    allocation: "Verbal + Quant",
    risk: "Vocab retention",
    chips: ["SRS vocab", "Trap patterns", "First section"]
  }
};

const comparisonRows = [
  ["Same schedule for everyone", "A roadmap built from your diagnostic"],
  ["Fixed study plans", "A plan that adapts after every session"],
  ["Equal focus on every section", "Time allocated by where it pays off"],
  ["Tells you what you got wrong", "Tells you the root concept behind the miss"],
  ["More study hours", "Smarter study hours"]
];

const metrics = [
  ["5,500+", "questions mapped to atomic concepts"],
  ["3", "exams, one shared adaptive engine"],
  ["25 yrs", "of real papers ingested and analyzed"],
  ["184", "topics in the adaptive knowledge graph"]
];

function ProgressMeter({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="meter">
      <span>{label}</span>
      <div className="meterTrack">
        <i
          className={`meterFill ${accent}`}
          style={{ "--value": `${value}%` } as CSSProperties}
        />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function StudentCard({
  name,
  variant
}: {
  name: string;
  variant: "green" | "rose";
}) {
  const scores =
    variant === "green"
      ? [
          ["QA", 2],
          ["LR", 7],
          ["VARC", 4]
        ]
      : [
          ["QA", 7],
          ["LR", 2],
          ["VARC", 4]
        ];

  return (
    <article className="studentCard">
      <div className="studentHeader">
        <span>{name}</span>
        <small>Baseline</small>
      </div>
      <ProgressMeter label="Concept retention" value={variant === "green" ? 86 : 74} accent="green" />
      <ProgressMeter label="Speed" value={variant === "green" ? 63 : 48} accent="rose" />
      <ProgressMeter label="Risk" value={variant === "green" ? 42 : 56} accent="gold" />
      <div className="scoreTiles">
        {scores.map(([label, value]) => (
          <div className="scoreTile" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function PracticeCard({
  title,
  gain,
  variant
}: {
  title: string;
  gain: string;
  variant: "even" | "adaptive";
}) {
  return (
    <article className={`practiceCard ${variant}`}>
      <div className="practiceHeader">
        <span>{title}</span>
        <small>{variant === "even" ? "Fixed schedule" : "Weighted to gap"}</small>
      </div>
      <div className="stackedBar">
        <span style={{ width: variant === "even" ? "33%" : "12%" }} />
        <span style={{ width: variant === "even" ? "34%" : "20%" }} />
        <span style={{ width: variant === "even" ? "33%" : "68%" }} />
      </div>
      <div className="gain">Percentile shift {gain}</div>
    </article>
  );
}

function DashboardPreview({ exam }: { exam: ExamKey }) {
  const dashboard = dashboardByExam[exam];

  return (
    <div className="dashboardPreview" aria-label="Adaptive prep dashboard preview">
      <div className="windowBar">
        <span>{exam}</span>
        <b>commander center</b>
        <small>As of 4:13</small>
      </div>
      <div className="dashboardGrid">
        <div className="dashPanel large">
          <small>Today plan</small>
          <strong>{dashboard.plan}</strong>
          <div className="chipRow">
            {dashboard.chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>
        <div className="dashPanel">
          <small>{exam === "GMAT" ? "Predicted score" : "Predicted percentile"}</small>
          <strong>{dashboard.percentile}</strong>
        </div>
        <div className="dashPanel">
          <small>Allocation mix</small>
          <strong>{dashboard.allocation}</strong>
        </div>
        <div className="dashPanel">
          <small>Risk alert</small>
          <strong>{dashboard.risk}</strong>
        </div>
      </div>
      <div className="chartPanel">
        <small>Projected percentile climb</small>
        <svg viewBox="0 0 660 260" role="img" aria-label="Projected score improvement chart">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--gold)" stopOpacity="0.45" />
              <stop offset="1" stopColor="var(--panel)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M40 220 C 155 180, 210 148, 320 126 C 430 104, 520 72, 620 48 L620 240 L40 240 Z"
            fill="url(#chartFill)"
          />
          <path
            d="M40 220 C 155 180, 210 148, 320 126 C 430 104, 520 72, 620 48"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {[40, 320, 620].map((x, index) => (
            <circle key={x} cx={x} cy={[220, 126, 48][index]} r="7" fill="var(--dark)" />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeExam, setActiveExam] = useState<ExamKey>("CAT");
  const pricing = pricingByExam[activeExam];
  const router = useRouter();
  const { authed, signIn } = useUser();
  const [authMode, setAuthMode] = useState<AuthModalMode | null>(null);

  // Diagnostic CTA: send signed-in learners to their dashboard; prompt everyone else to log in first.
  function startDiagnostic() {
    if (authed) {
      router.push("/dashboard");
    } else {
      setAuthMode("login");
    }
  }

  return (
    <main id="top">
      <SiteHeader showAnnouncement />

      <section className="hero" aria-labelledby="hero-heading">
        <div className="heroGrid" aria-hidden="true" />
        <div className="heroInner">
          <div className="heroCopy">
            <h1 id="hero-heading">
              Fastest path to your <span>target</span> percentile
            </h1>
            <p>
              Most aspirants follow the same study plan. We build one around
              your strengths, weaknesses, and available time.
            </p>
            <div className="heroActions">
              <button className="button primary" type="button" onClick={startDiagnostic}>
                Start diagnostic
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <Link className="button outlineOnDark" href="/how-it-works">
                How it works
              </Link>
            </div>
          </div>
          <div className="heroVisual" aria-hidden="true">
            <Image
              src="/hero-art.png"
              alt=""
              width={1204}
              height={745}
              priority
            />
          </div>
        </div>
      </section>

      <section className="section painSection" aria-labelledby="pain-heading">
        <div className="sectionInner">
          <div className="sectionHeader centered">
            <h2 id="pain-heading">Most students waste hundreds of hours</h2>
          </div>
          <div className="featureGrid">
            {featureCards.map((card) => (
              <article className="featureCard" key={card.title}>
                <div className="cardIcon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="roadmapSection" id="how-it-works" aria-labelledby="roadmap-heading">
        <div className="roadmapPattern" aria-hidden="true" />
        <div className="sectionInner">
          <div className="roadmapCopy">
            <p className="eyebrow">Adaptive roadmaps</p>
            <h2 id="roadmap-heading">Personalised Roadmap for every student</h2>
            <p>
              Two aspirants, same target, different strengths. The engine sends
              each one somewhere different.
            </p>
          </div>
          <div className="studentGrid">
            <StudentCard name="Student A" variant="green" />
            <StudentCard name="Student B" variant="rose" />
          </div>
        </div>
      </section>

      <ExamShowcase active={activeExam} onChange={setActiveExam} />

      <section className="section gainsSection" aria-labelledby="gains-heading">
        <div className="sectionInner narrow">
          <div className="sectionHeader centered">
            <h2 id="gains-heading">Hours go where the gains are</h2>
            <p>
              Same 100 hours. One splits them evenly. We aim them where the
              percentile actually moves.
            </p>
          </div>
          <div className="practiceGrid">
            <PracticeCard title="Traditional prep" gain="+4%" variant="even" />
            <PracticeCard title="VettaLume" gain="+12%" variant="adaptive" />
          </div>
        </div>
      </section>

      <section className="section adaptSection" aria-labelledby="adapt-heading">
        <div className="sectionInner">
          <div className="sectionHeader centered">
            <h2 id="adapt-heading">Your prep adapts after every session</h2>
            <p>Every test and drill feeds back in. The plan you start with is never the one you finish.</p>
          </div>
          <div className="timeline">
            {["Diagnose", "Prioritize", "Practice", "Analyze", "Adapt"].map((item, index) => (
              <div className="timelineStep" key={item}>
                <span>{index + 1}</span>
                <strong>{item}</strong>
                <p>
                  {[
                    "Pin down where you stand.",
                    "Rank skills by score impact.",
                    "Drill at the edge of ability.",
                    "Find the root concept.",
                    "Rebuild the plan."
                  ][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dashboardSection" id="dashboard" aria-labelledby="dashboard-heading">
        <div className="sectionInner">
          <div className="sectionHeader centered">
            <h2 id="dashboard-heading">Know what to do today, and where it leads</h2>
            <p>The day's decision is already made. Below it, a forecast recalibrates.</p>
          </div>
          <DashboardPreview exam={activeExam} />
        </div>
      </section>

      <section className="section dataSection" aria-labelledby="data-heading">
        <div className="sectionInner">
          <div className="sectionHeader centered">
            <h2 id="data-heading">Built on real exam data</h2>
          </div>
          <div className="metricGrid">
            {metrics.map(([value, label]) => (
              <div className="metricCard" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="comparisonSection" aria-labelledby="comparison-heading">
        <div className="comparisonGridBg" aria-hidden="true" />
        <div className="sectionInner">
          <div className="sectionHeader centered">
            <h2 id="comparison-heading">Traditional Prep vs Adaptive Prep</h2>
          </div>
          <div className="comparisonTable">
            <div className="comparisonHead traditional">Traditional Prep</div>
            <div className="comparisonHead adaptive">VettaLume</div>
            {comparisonRows.map(([oldPrep, adaptive]) => (
              <div className="comparisonRow" key={oldPrep}>
                <div>
                  <X size={16} aria-hidden="true" />
                  <span>{oldPrep}</span>
                </div>
                <div>
                  <Check size={16} aria-hidden="true" />
                  <span>{adaptive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricingSection" id="pricing" aria-labelledby="pricing-heading">
        <div className="sectionInner">
          <div className="sectionHeader centered">
            <p className="eyebrow">Pricing</p>
            <h2 id="pricing-heading">{activeExam} plans that move with your prep</h2>
            <p>
              Classroom coaching runs Rs 50,000 and up. VettaLume starts at{" "}
              <strong>{pricing.startsAt}</strong>. {pricing.focus}
            </p>
          </div>
          <div className="pricingTabs" role="tablist" aria-label="Pricing exam selection">
            {examTabs.map((exam) => (
              <button
                className={exam === activeExam ? "active" : ""}
                key={exam}
                type="button"
                role="tab"
                aria-selected={exam === activeExam}
                onClick={() => setActiveExam(exam)}
              >
                {exam}
              </button>
            ))}
          </div>
          <div className="pricingGrid">
            {pricing.plans.map((plan) => (
              <article className={plan.featured ? "priceCard featured" : "priceCard"} key={plan.name}>
                {plan.featured ? <span className="popularBadge">Most popular</span> : null}
                <p>{plan.name}</p>
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
                <button className="button priceButton" type="button">
                  Choose {plan.name}
                </button>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={14} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="pricingBanner">
            <span>Only the first 100 people join the waitlist at founding access.</span>
            <a href="#trial">Join our waitlist</a>
          </div>
        </div>
      </section>

      <section className="ctaSection" id="trial" aria-labelledby="trial-heading">
        <div className="sectionInner centered">
          <Sparkles size={26} aria-hidden="true" />
          <h2 id="trial-heading">Find your fastest route to 99%</h2>
          <p>Take the diagnostic, get a personalized roadmap in minutes.</p>
          <div className="ctaActions">
            <button className="button primary" type="button" onClick={startDiagnostic}>
              Start free diagnostic
            </button>
            <Link className="button ghost" href="/how-it-works">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onModeChange={setAuthMode}
        onSignIn={signIn}
      />
    </main>
  );
}
