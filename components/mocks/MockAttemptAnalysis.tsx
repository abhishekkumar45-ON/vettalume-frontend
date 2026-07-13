"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { mockApi, type AttemptAnalysis } from "@/lib/api";
import Loading from "@/components/Loading";

function fmtT(sec: number | null) {
  if (sec == null) return "--";
  sec = Math.round(sec);
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
}
function pct(n: number) {
  return Math.round((n || 0) * 100);
}
const DIFF_LABEL: Record<string, string> = { D1: "Easy", D2: "Easy", D3: "Medium", D4: "Hard", D5: "Hard" };
const DIFF_CLASS: Record<string, string> = { D1: "easy", D2: "easy", D3: "medium", D4: "hard", D5: "hard" };
const FILTERS = ["all", "correct", "wrong", "skipped"] as const;
type Filter = (typeof FILTERS)[number];

export default function MockAttemptAnalysis({
  exam,
  attemptId,
  backHref,
  backLabel
}: {
  exam: string;
  attemptId: string;
  backHref: string;
  backLabel: string;
}) {
  const [data, setData] = useState<AttemptAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    mockApi
      .attemptAnalysis(attemptId)
      .then((d) => alive && setData(d))
      .catch(() => alive && setError("Could not load this attempt."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [attemptId]);

  const ov = data?.overall;
  const questions = useMemo(() => data?.questions || [], [data]);
  const shown = questions.filter((q) => filter === "all" || q.result === filter);
  const maxT = Math.max(1, ...questions.map((q) => (q.time_ms || 0) / 1000));

  return (
    <main className="smPage maPage">
      <div className="sectionInner">
        <div className="smBack">
          <Link href={backHref}>
            <ArrowLeft size={15} aria-hidden="true" /> {backLabel}
          </Link>
        </div>

        {loading ? (
          <Loading label="Loading analysis…" />
        ) : error || !data || !ov ? (
          <p className="smNote">{error || "Attempt not found."}</p>
        ) : (
          <>
            <header className="smHero">
              <p className="smKicker">
                {exam.toUpperCase()}
                {data.section ? ` · ${data.section}` : ""} · Mock Analysis
              </p>
              <h1>{data.mockName}</h1>
              <p className="smSub">Stored permanently. Revisit this analysis any time.</p>
            </header>

            <section className="smStats">
              <div className="smStat">
                <div className="smNum">
                  {ov.score}
                  <small>/{ov.marks_total}</small>
                </div>
                <div className="smLab">Score</div>
              </div>
              <div className="smStat">
                <div className="smNum">{pct(ov.accuracy)}%</div>
                <div className="smLab">Accuracy</div>
              </div>
              <div className="smStat">
                <div className="smNum">{fmtT((data.timeMs || 0) / 1000)}</div>
                <div className="smLab">Total time</div>
              </div>
              <div className="smStat">
                <div className="smNum">{ov.total ? fmtT((data.timeMs || 0) / 1000 / ov.total) : "--"}</div>
                <div className="smLab">Avg / question</div>
              </div>
            </section>

            <div className="maBadges">
              <span className="maBadge">
                <b>{ov.attempted}</b> attempted
              </span>
              <span className="maBadge">
                <b>{ov.unattempted}</b> skipped
              </span>
              <span className="maBadge good">
                <b>{ov.raw}</b> correct
              </span>
              <span className="maBadge bad">
                <b>{ov.wrong}</b> wrong
              </span>
            </div>

            {data.sections.length > 1 ? (
              <section className="maSecScores">
                <div className="smBoxH">
                  <h3>Section performance</h3>
                </div>
                <div className="maSecGrid">
                  {data.sections.map((s) => (
                    <div className="maSecCard" key={s.name}>
                      <div className="maSecName">{s.name}</div>
                      <div className="maSecScore">
                        {s.score}
                        <small>/{s.marks_total ?? "—"}</small>
                      </div>
                      <div className="maSecMeta">
                        {s.raw}/{s.total} correct · {pct(s.accuracy)}% accuracy
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="maDiff">
              <div className="smBoxH">
                <h3>Accuracy by difficulty</h3>
                <span>Cleared % per band</span>
              </div>
              <div className="maDiffBars">
                {data.difficulty_spread.map((b) => (
                  <div className="maDiffCol" key={b.band}>
                    <div className="maDiffTrack">
                      <div
                        className="maDiffFill"
                        style={{ height: `${pct(b.cleared_pct)}%` }}
                        aria-hidden="true"
                      />
                      <span className="maDiffPct">{b.answered ? `${pct(b.cleared_pct)}%` : "—"}</span>
                    </div>
                    <span className="maDiffLab">{b.band}</span>
                  </div>
                ))}
              </div>
            </section>

            {data.strong.length || data.weak.length ? (
              <div className="maTopics">
                <section className="maTopicCard">
                  <div className="smBoxH">
                    <h3>Strong topics</h3>
                  </div>
                  {data.strong.length ? (
                    data.strong.map((t) => (
                      <div className="maTopicRow" key={t.name}>
                        <span className="maTopicDot strong" aria-hidden="true" />
                        <span className="maTopicName">{t.name}</span>
                        <span className="maTopicPct">{pct(t.accuracy)}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="smNote">No strong topics yet.</p>
                  )}
                </section>
                <section className="maTopicCard">
                  <div className="smBoxH">
                    <h3>Weak topics</h3>
                  </div>
                  {data.weak.length ? (
                    data.weak.map((t) => (
                      <div className="maTopicRow" key={t.name}>
                        <span className="maTopicDot weak" aria-hidden="true" />
                        <span className="maTopicName">{t.name}</span>
                        <span className="maTopicPct">{pct(t.accuracy)}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="smNote">No weak topics — nice work.</p>
                  )}
                </section>
              </div>
            ) : null}

            {data.recommendations.length ? (
              <section className="maRecs">
                <div className="smBoxH">
                  <h3>Recommendations</h3>
                  <span>What to fix before your next mock</span>
                </div>
                <div className="maRecList">
                  {data.recommendations.map((r) => (
                    <div className="maRecRow" key={r.name}>
                      <span className="maRecBang" aria-hidden="true">
                        !
                      </span>
                      <p>{r.tip}</p>
                      <Link
                        className="maRecBtn"
                        href={r.section ? `/learn/${exam}/${r.section.toLowerCase()}` : `/mocks/${exam}/full`}
                      >
                        Go practice <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="maReview">
              <div className="maReviewHead">
                <h3>Question review</h3>
                <div className="maFilters">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={filter === f ? "active" : ""}
                      onClick={() => setFilter(f)}
                    >
                      {f[0].toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="maQList">
                {shown.map((q, i) => {
                  const isOpen = !!open[q.id];
                  return (
                    <article className={`maQRow ${q.result}${isOpen ? " open" : ""}`} key={q.id}>
                      <button
                        type="button"
                        className="maQHead"
                        aria-expanded={isOpen}
                        onClick={() => setOpen((o) => ({ ...o, [q.id]: !o[q.id] }))}
                      >
                        <span className="maQNo">Q{questions.indexOf(q) + 1}</span>
                        {q.section ? <span className="maQSec">{q.section}</span> : null}
                        <span className={`maQDiff ${DIFF_CLASS[q.difficulty] || "medium"}`}>
                          {DIFF_LABEL[q.difficulty] || q.difficulty}
                        </span>
                        <span className={`maQRes ${q.result}`}>{q.result}</span>
                        <span className="maQTime">
                          {q.time_ms > 0 ? fmtT(q.time_ms / 1000) : "--"}
                          {q.benchmark_s ? <em> / {fmtT(q.benchmark_s)}</em> : null}
                        </span>
                        <ChevronDown className="maQChev" size={16} aria-hidden="true" />
                      </button>
                      {isOpen ? (
                        <div className="maQBody">
                          <p className="maQPrompt">{q.text}</p>
                          <div className="maQAns">
                            <span className="maAns correct">
                              <span className="lab">Answer</span>
                              {q.correct_answer}
                            </span>
                            {q.result === "wrong" && q.your_answer ? (
                              <span className="maAns yours">
                                <span className="lab">You</span>
                                {q.your_answer}
                              </span>
                            ) : null}
                          </div>
                          {q.solution ? (
                            <div className="maQSol">
                              <div className="maSolLab">Solution</div>
                              <p>{q.solution}</p>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
                {shown.length === 0 ? <p className="smNote">No questions in this filter.</p> : null}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
