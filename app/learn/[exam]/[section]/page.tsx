"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Lock } from "lucide-react";
import Loading from "@/components/Loading";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { learnApi, type Overview, type OverviewSection } from "@/lib/api";

const TONES = ["green", "purple", "rose"] as const;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

export default function SectionDashboardPage() {
  const params = useParams();
  const exam = String(params.exam || "");
  const sectionSlug = String(params.section || "");

  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    learnApi
      .overview(exam)
      .then((data) => {
        if (alive) setOverview(data);
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : "Could not load this section.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [exam]);

  const section: OverviewSection | undefined = overview?.sections.find(
    (s) => s.key.toLowerCase() === sectionSlug.toLowerCase()
  );

  return (
    <>
      <SiteHeader />
      <main className="sectionDash">
        <div className="sectionInner">
          {overview ? (
            <div className="sectionDashTabs" role="tablist" aria-label={`${overview.exam} sections`}>
              {overview.sections.map((item) => (
                <Link
                  key={item.key}
                  href={`/learn/${exam}/${item.key.toLowerCase()}`}
                  className={item.key === section?.key ? "active" : ""}
                  aria-current={item.key === section?.key ? "page" : undefined}
                >
                  {item.key}
                </Link>
              ))}
            </div>
          ) : null}

          {loading ? (
            <Loading label="Loading your section…" />
          ) : error ? (
            <p className="sectionDashHeading" style={{ marginTop: 24 }}>{error}</p>
          ) : !section ? (
            <p className="sectionDashHeading" style={{ marginTop: 24 }}>Section not found.</p>
          ) : (
            <>
              <div className="sectionDashTitle">
                <h1>{section.key}</h1>
                <p>{section.name}</p>
              </div>

              <div className="secMetricGrid">
                <MetricCard label="Syllabus Covered" value={`${section.syllabus}%`} sub="Covered" tone="rose" />
                <MetricCard label="Ability Level" value={`${section.ability}`} sub="Out of 100" tone="green" />
                <MetricCard label="Concept Mastery" value={`${section.mastery}%`} sub="Mastered" tone="purple" />
              </div>

              <h2 className="sectionDashHeading">
                Chapters <span>{section.chapters.length} Chapters</span>
              </h2>
              {section.chapters.length === 0 ? (
                <p className="sectionDashTitle" style={{ opacity: 0.7 }}>
                  No chapters yet — an admin can add them from the content portal.
                </p>
              ) : (
                <div className="barList">
                  {section.chapters.map((chapter, index) => {
                    const tone = TONES[index % TONES.length];
                    // Locked chapters (not on the learner's plan) show a lock and go to pricing.
                    if (chapter.locked) {
                      return (
                        <Link
                          key={chapter.id}
                          href="/pricing"
                          className="chapterLink locked"
                          title="Upgrade to unlock this chapter"
                        >
                          <div className={`progressBar chapter ${tone} locked`}>
                            <i className="progressFill" style={{ width: `${chapter.pct}%` }} aria-hidden="true" />
                            <span className="progressName">{chapter.name}</span>
                            <span className="progressPct">{chapter.pct}%</span>
                            <span className="progressGo lockGo" aria-hidden="true">
                              <Lock size={15} />
                            </span>
                          </div>
                        </Link>
                      );
                    }
                    return (
                      <Link
                        key={chapter.id}
                        href={`/learn/${exam}/${sectionSlug}/${slugify(chapter.name)}`}
                        className="chapterLink"
                      >
                        <div className={`progressBar chapter ${tone} clickable`}>
                          <i className="progressFill" style={{ width: `${chapter.pct}%` }} aria-hidden="true" />
                          <span className="progressName">{chapter.name}</span>
                          <span className="progressPct">{chapter.pct}%</span>
                          <span className="progressGo" aria-hidden="true">
                            →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
