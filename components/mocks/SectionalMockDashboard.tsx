"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, Lock } from "lucide-react";
import { mockApi, type MockSummary, type SectionAnalysis } from "@/lib/api";
import Loading from "@/components/Loading";
import TrendChart from "@/components/mocks/TrendChart";

const ACCENT: Record<string, string> = {
  varc: "#b2847a",
  dilr: "#7d9a84",
  qa: "#797ea4",
  quant: "#797ea4",
  verbal: "#b2847a",
  data: "#7d9a84",
  awa: "#7d9a84"
};

function pct(n: number) {
  return Math.round((n || 0) * 100);
}

export default function SectionalMockDashboard({
  exam,
  section,
  sectionName,
  sectionFull
}: {
  exam: string;
  section: string;
  sectionName: string;
  sectionFull: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<SectionAnalysis | null>(null);
  const [mocks, setMocks] = useState<MockSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const accent = ACCENT[section.toLowerCase()] || "var(--gold)";

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all([
      mockApi.sectionAnalysis(exam, section),
      mockApi.list(exam, "sectional").catch(() => ({ mocks: [] as MockSummary[] }))
    ])
      .then(([analysis, list]) => {
        if (!alive) return;
        setData(analysis);
        setMocks(
          (list.mocks || []).filter(
            (m) => (m.sections?.[0]?.name || "").toLowerCase() === section.toLowerCase()
          )
        );
      })
      .catch(() => alive && setError("Could not load your mock history."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [exam, section]);

  // Latest attempt per mock (attempts arrive oldest→newest, so the last one wins).
  const latestByMock = useMemo(() => {
    const m: Record<string, SectionAnalysis["attempts"][number]> = {};
    (data?.attempts || []).forEach((a) => {
      m[a.mockId] = a;
    });
    return m;
  }, [data]);

  const marksTotal = data?.marksTotal || 0;

  return (
    <main className="smPage" style={{ ["--sm-accent" as string]: accent }}>
      <div className="sectionInner">
        <div className="smBack">
          <Link href={`/mocks/${exam}/sectional`}>
            <ArrowLeft size={15} aria-hidden="true" /> Sectional Mocks
          </Link>
        </div>

        <header className="smHero">
          <p className="smKicker">
            {sectionName} · Sectional Mocks
          </p>
          <h1>{sectionName} Mocks</h1>
          <p className="smSub">
            {sectionFull}. The dashboard aggregates every attempt, so your history is never deleted.
          </p>
        </header>

        {loading ? (
          <Loading label="Loading your mock history…" />
        ) : error ? (
          <p className="smNote">{error}</p>
        ) : (
          <>
            <section className="smStats">
              <div className="smStat">
                <div className="smNum">
                  {data?.attempted ?? 0}
                  <small>/{data?.available ?? 0}</small>
                </div>
                <div className="smLab">Mocks attempted</div>
              </div>
              <div className="smStat">
                <div className="smNum">
                  {data?.latestScore ?? 0}
                  <small>/{marksTotal}</small>
                </div>
                <div className="smLab">Latest score</div>
              </div>
              <div className="smStat">
                <div className="smNum">
                  {data?.bestScore ?? 0}
                  <small>/{marksTotal}</small>
                </div>
                <div className="smLab">Best score</div>
              </div>
              <div className="smStat">
                <div className="smNum">{pct(data?.avgAccuracy ?? 0)}%</div>
                <div className="smLab">Avg accuracy</div>
              </div>
            </section>

            <button
              className={`smAnaToggle${showAnalysis ? " open" : ""}`}
              type="button"
              aria-expanded={showAnalysis}
              onClick={() => setShowAnalysis((v) => !v)}
            >
              {showAnalysis ? "Hide analysis" : "Show analysis"}
              <ChevronDown size={16} aria-hidden="true" />
            </button>

            {showAnalysis ? (
              <div className="smTrendGrid">
                <div className="smTrendBox">
                  <div className="smBoxH">
                    <h3>Score trend</h3>
                    <span>Score across mocks</span>
                  </div>
                  <TrendChart
                    accent={accent}
                    yMax={marksTotal || 1}
                    current={`${data?.latestScore ?? 0}/${marksTotal}`}
                    points={(data?.scoreTrend || []).map((p) => ({ label: p.label, value: p.score }))}
                  />
                </div>
                <div className="smTrendBox">
                  <div className="smBoxH">
                    <h3>Accuracy trend</h3>
                    <span>Correct rate by mock</span>
                  </div>
                  <TrendChart
                    accent={accent}
                    yMax={100}
                    current={`${
                      (data?.accuracyTrend || []).length
                        ? pct(data!.accuracyTrend[data!.accuracyTrend.length - 1].accuracy)
                        : 0
                    }%`}
                    points={(data?.accuracyTrend || []).map((p) => ({
                      label: p.label,
                      value: pct(p.accuracy)
                    }))}
                  />
                </div>
                <div className="smTrendBox">
                  <div className="smBoxH">
                    <h3>Time management</h3>
                    <span>Avg sec per question</span>
                  </div>
                  <TrendChart
                    accent={accent}
                    yMax={Math.max(10, ...(data?.timeTrend || []).map((p) => p.avgTimePerQ))}
                    current={`${
                      (data?.timeTrend || []).length
                        ? Math.round(data!.timeTrend[data!.timeTrend.length - 1].avgTimePerQ)
                        : 0
                    }s`}
                    points={(data?.timeTrend || []).map((p) => ({
                      label: p.label,
                      value: p.avgTimePerQ
                    }))}
                  />
                </div>
              </div>
            ) : null}

            <section className="smMocks">
              <div className="smBoxH">
                <h3>Mocks</h3>
                <span>
                  {mocks.length} paper{mocks.length === 1 ? "" : "s"}, history kept
                </span>
              </div>
              {mocks.length === 0 ? (
                <div className="smMockRow locked">
                  <Lock size={14} aria-hidden="true" />
                  <span className="smMockName">No mocks published in this section yet</span>
                </div>
              ) : (
                <div className="smMockList">
                  {mocks.map((m) => {
                    const at = latestByMock[m.id];
                    const fill = at && at.marksTotal ? Math.round((at.score / at.marksTotal) * 100) : 0;
                    return (
                      <div className={`smMockRow${at ? "" : " next"}`} key={m.id}>
                        <i
                          className="smMockFill"
                          style={{ width: `${Math.max(0, Math.min(100, fill))}%` }}
                          aria-hidden="true"
                        />
                        <span className="smMockName">{m.name}</span>
                        {at ? (
                          <span className="smMockScore">
                            {at.score}/{at.marksTotal}
                          </span>
                        ) : (
                          <span className="smMockScore muted">Not attempted</span>
                        )}
                        {at ? (
                          <button
                            type="button"
                            className="smMockBtn"
                            onClick={() =>
                              router.push(`/mocks/${exam}/sectional/${section}/${at.attemptId}`)
                            }
                          >
                            View analysis <ArrowRight size={14} aria-hidden="true" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="smMockBtn go"
                            onClick={() => router.push(`/mocks/${exam}/take/${m.id}`)}
                          >
                            Start <ArrowRight size={14} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
