"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronDown, Lock } from "lucide-react";
import { mockApi, billingApi, type FullAnalysis, type MockSummary } from "@/lib/api";
import Loading from "@/components/Loading";
import TrendChart from "@/components/mocks/TrendChart";

const SECTION_ACCENT: Record<string, string> = {
  VARC: "#b2847a",
  DILR: "#7d9a84",
  QA: "#797ea4",
  Quant: "#797ea4",
  Verbal: "#b2847a",
  "Data Insights": "#7d9a84",
  AWA: "#7d9a84"
};

function pct(n: number) {
  return Math.round((n || 0) * 100);
}

export default function FullMockDashboard({ exam }: { exam: string }) {
  const router = useRouter();
  const [data, setData] = useState<FullAnalysis | null>(null);
  const [mocks, setMocks] = useState<MockSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [fullLocked, setFullLocked] = useState(false); // full-mock quota reached on this plan

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    // Whether the learner can still START a full mock (quota not exhausted / unlimited).
    billingApi
      .trialStatus(exam)
      .then((s) => {
        if (!alive) return;
        const lim = s.limits.full_mocks;
        setFullLocked(lim != null && s.used.full_mocks >= lim);
      })
      .catch(() => {});
    Promise.all([
      mockApi.fullAnalysis(exam),
      mockApi.list(exam, "full").catch(() => ({ mocks: [] as MockSummary[] }))
    ])
      .then(([analysis, list]) => {
        if (!alive) return;
        setData(analysis);
        setMocks(list.mocks || []);
      })
      .catch(() => alive && setError("Could not load your full-mock history."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [exam]);

  const latestByMock = useMemo(() => {
    const m: Record<string, FullAnalysis["attempts"][number]> = {};
    (data?.attempts || []).forEach((a) => {
      m[a.mockId] = a;
    });
    return m;
  }, [data]);

  const marksTotal = data?.marksTotal || 0;
  const sectionNames = data ? Object.keys(data.sections) : [];

  return (
    <main className="smPage">
      <div className="sectionInner">
        <div className="smBack">
          <Link href="/dashboard">
            <ArrowLeft size={15} aria-hidden="true" /> Dashboard
          </Link>
        </div>

        <header className="smHero">
          <p className="smKicker">{exam.toUpperCase()} · Full Mocks</p>
          <h1>Full Mocks</h1>
          <p className="smSub">
            Full-length {exam.toUpperCase()} papers across every section. Every attempt is aggregated
            here — your history is never deleted.
          </p>
        </header>

        {loading ? (
          <Loading label="Loading your full-mock history…" />
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
                  {data?.avgScore ?? 0}
                  <small>/{marksTotal}</small>
                </div>
                <div className="smLab">Avg score</div>
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
              <>
                <div className="smTrendGrid">
                  <div className="smTrendBox">
                    <div className="smBoxH">
                      <h3>Score trend</h3>
                      <span>Score across mocks</span>
                    </div>
                    <TrendChart
                      yMax={marksTotal || 1}
                      current={`${data?.attempts.length ? data.attempts[data.attempts.length - 1].score : 0}/${marksTotal}`}
                      points={(data?.scoreTrend || []).map((p) => ({ label: p.label, value: p.score }))}
                    />
                  </div>
                  <div className="smTrendBox">
                    <div className="smBoxH">
                      <h3>Accuracy trend</h3>
                      <span>Correct rate by mock</span>
                    </div>
                    <TrendChart
                      yMax={100}
                      current={`${
                        (data?.accuracyTrend || []).length
                          ? pct(data!.accuracyTrend[data!.accuracyTrend.length - 1].accuracy)
                          : 0
                      }%`}
                      points={(data?.accuracyTrend || []).map((p) => ({ label: p.label, value: pct(p.accuracy) }))}
                    />
                  </div>
                  <div className="smTrendBox">
                    <div className="smBoxH">
                      <h3>Time management</h3>
                      <span>Avg sec per question</span>
                    </div>
                    <TrendChart
                      yMax={Math.max(10, ...(data?.timeTrend || []).map((p) => p.avgTimePerQ))}
                      current={`${
                        (data?.timeTrend || []).length
                          ? Math.round(data!.timeTrend[data!.timeTrend.length - 1].avgTimePerQ)
                          : 0
                      }s`}
                      points={(data?.timeTrend || []).map((p) => ({ label: p.label, value: p.avgTimePerQ }))}
                    />
                  </div>
                </div>

                {sectionNames.length ? (
                  <section className="smMocks">
                    <div className="smBoxH">
                      <h3>Section-wise score trend</h3>
                      <span>Score per section over mocks</span>
                    </div>
                    <div className="smTrendGrid">
                      {sectionNames.map((name) => {
                        const s = data!.sections[name];
                        const accent = SECTION_ACCENT[name] || "var(--gold)";
                        const secMax = Math.max(1, ...s.scoreTrend.map((p) => p.marksTotal || p.score));
                        return (
                          <div className="smTrendBox" key={name} style={{ ["--sm-accent" as string]: accent }}>
                            <div className="smBoxH">
                              <h3>{name}</h3>
                              <span>
                                avg {s.avgScore} · {pct(s.avgAccuracy)}%
                              </span>
                            </div>
                            <TrendChart
                              accent={accent}
                              yMax={secMax}
                              current={`${s.bestScore}`}
                              points={s.scoreTrend.map((p) => ({ label: p.label, value: p.score }))}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </>
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
                  <span className="smMockName">No full mocks published yet</span>
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
                            onClick={() => router.push(`/mocks/${exam}/full/${at.attemptId}`)}
                          >
                            View analysis <ArrowRight size={14} aria-hidden="true" />
                          </button>
                        ) : fullLocked ? (
                          <button
                            type="button"
                            className="smMockBtn lock"
                            onClick={() => router.push("/pricing")}
                            title="Upgrade to unlock more full mocks"
                          >
                            <Lock size={13} aria-hidden="true" /> Locked
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
