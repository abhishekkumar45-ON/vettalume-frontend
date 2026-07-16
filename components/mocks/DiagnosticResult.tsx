"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { diagnosticApi, type DiagnosticResultData } from "@/lib/api";
import Loading from "@/components/Loading";

// Section accent colors, matched to the rest of the app.
const ACCENT: Record<string, string> = {
  VARC: "#8b8fb8",
  DILR: "var(--rose)",
  QA: "var(--green-dark)",
  Quant: "var(--green-dark)",
  Verbal: "#8b8fb8",
  "Data Insights": "var(--rose)",
  AWA: "var(--rose)"
};

export default function DiagnosticResult({ exam }: { exam: string }) {
  const [data, setData] = useState<DiagnosticResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    diagnosticApi
      .result(exam)
      .then((d) => alive && setData(d))
      .catch(() => alive && setError("No completed diagnostic for this exam yet."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [exam]);

  if (loading) return <Loading label="Loading your diagnostic result…" />;
  if (error || !data) return <p className="smNote sectionInner">{error}</p>;

  const sections = Object.entries(data.sections);
  const totRaw = sections.reduce((a, [, s]) => a + s.raw, 0);
  const totTotal = sections.reduce((a, [, s]) => a + s.total, 0);
  const overallPct = totTotal ? Math.round((totRaw / totTotal) * 100) : 0;

  return (
    <div className="sectionInner diagResult">
      <header className="smHero">
        <p className="smKicker">{exam.toUpperCase()} · Diagnostic</p>
        <h1>Your diagnostic result</h1>
        <p className="smSub">
          A one-time baseline across every section — it sets the starting point your roadmap and
          adaptive practice build on. You can take the diagnostic only once.
        </p>
      </header>

      <div className="diagOverall">
        <strong>{overallPct}%</strong>
        <span>
          {totRaw} / {totTotal} correct overall
        </span>
      </div>

      <div className="diagSecGrid">
        {sections.map(([name, s]) => {
          const pct = s.total ? Math.round((s.raw / s.total) * 100) : 0;
          return (
            <article className="diagSecCard" key={name} style={{ ["--acc"]: ACCENT[name] || "var(--gold)" } as CSSProperties}>
              <div className="diagSecHead">
                <h3>{name}</h3>
                <b>{pct}%</b>
              </div>
              <div className="diagSecBar">
                <i style={{ width: `${pct}%` }} aria-hidden="true" />
              </div>
              <p className="diagSecMeta">
                {s.raw} / {s.total} correct · ability {s.theta >= 0 ? "+" : ""}
                {s.theta.toFixed(2)}
              </p>
            </article>
          );
        })}
      </div>

      <div className="diagCta">
        <Link className="button primary" href="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
