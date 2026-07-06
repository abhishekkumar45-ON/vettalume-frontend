import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { EXAMS, getExam, getSection, type Tone } from "@/app/learn/sectionData";

type PageParams = { exam: string; section: string };

export function generateStaticParams(): PageParams[] {
  return EXAMS.flatMap((exam) =>
    exam.sections.map((section) => ({ exam: exam.slug, section: section.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { exam: examSlug, section: sectionSlug } = await params;
  const exam = getExam(examSlug);
  const section = exam ? getSection(exam, sectionSlug) : undefined;
  if (!exam || !section) {
    return { title: "Section | VettaLume" };
  }
  return { title: `${section.name} · ${exam.label} | VettaLume` };
}

function Wave({ tone }: { tone: "rose" | "green" | "purple" }) {
  return (
    <svg className={`secMetricWave ${tone}`} viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 46 C 60 30, 120 62, 200 44 C 280 26, 340 58, 400 40 L400 90 L0 90 Z" />
    </svg>
  );
}

function MetricCard({
  label,
  value,
  sub,
  tone
}: {
  label: string;
  value: string;
  sub: string;
  tone: "rose" | "green" | "purple";
}) {
  return (
    <article className={`secMetricCard ${tone}`}>
      <span className="secMetricLabel">
        <i aria-hidden="true" /> {label}
      </span>
      <strong className="secMetricValue">{value}</strong>
      <span className="secMetricSub">{sub}</span>
      <Wave tone={tone} />
    </article>
  );
}

function ProgressBar({
  name,
  pct,
  variant,
  tone
}: {
  name: string;
  pct: number;
  variant: "rec" | "chapter";
  tone?: Tone;
}) {
  const className =
    variant === "rec" ? "progressBar rec" : `progressBar chapter ${tone ?? "green"}`;
  return (
    <div className={className}>
      <i className="progressFill" style={{ width: `${pct}%` }} aria-hidden="true" />
      <span className="progressName">{name}</span>
      <span
        className="progressPct"
        style={{ left: `clamp(240px, calc(${pct}% + 14px), calc(100% - 60px))` }}
      >
        {pct}%
      </span>
    </div>
  );
}

export default async function SectionDashboardPage({
  params
}: {
  params: Promise<PageParams>;
}) {
  const { exam: examSlug, section: sectionSlug } = await params;
  const exam = getExam(examSlug);
  const section = exam ? getSection(exam, sectionSlug) : undefined;

  if (!exam || !section) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="sectionDash">
        <div className="sectionInner">
          <div className="sectionDashTabs" role="tablist" aria-label={`${exam.label} sections`}>
            {exam.sections.map((item) => (
              <Link
                key={item.slug}
                href={`/learn/${exam.slug}/${item.slug}`}
                className={item.slug === section.slug ? "active" : ""}
                aria-current={item.slug === section.slug ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="sectionDashTitle">
            <h1>{section.name}</h1>
            <p>{section.full}</p>
          </div>

          <div className="secMetricGrid">
            <MetricCard label="Syllabus Covered" value={`${section.syllabus}%`} sub="Covered" tone="rose" />
            <MetricCard label="Ability Level" value={`${section.ability}`} sub="Out of 100" tone="green" />
            <MetricCard label="Concept Mastery" value={`${section.mastery}%`} sub="Mastered" tone="purple" />
          </div>

          <h2 className="sectionDashHeading">Vettalume Recommendations</h2>
          <div className="barList">
            {section.recommendations.map((rec) => (
              <ProgressBar key={rec.name} name={rec.name} pct={rec.pct} variant="rec" />
            ))}
          </div>

          {section.groups.map((group) => (
            <div key={group.title}>
              <h2 className="sectionDashHeading">
                {group.title} <span>{group.chapters.length} Chapters</span>
              </h2>
              <div className="barList">
                {group.chapters.map((chapter) => (
                  <ProgressBar
                    key={chapter.name}
                    name={chapter.name}
                    pct={chapter.pct}
                    variant="chapter"
                    tone={chapter.tone}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
