"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { mockApi, type AttemptAnalysis, type AttemptQuestion, type MockTopic } from "@/lib/api";
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
const BANDS = ["D1", "D2", "D3", "D4", "D5"];
const FILTERS = ["all", "correct", "wrong", "skipped"] as const;
type Filter = (typeof FILTERS)[number];
const TIME_MAX = 200; // seconds — chart ceiling

function qState(q: AttemptQuestion): "correct" | "slow" | "wrong" | "skipped" {
  if (q.result === "skipped") return "skipped";
  if (q.result === "wrong") return "wrong";
  return q.benchmark_s && q.time_ms / 1000 > q.benchmark_s ? "slow" : "correct";
}

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
  const [activeSection, setActiveSection] = useState<string | null>(null); // null = whole mock

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
  const allQuestions = useMemo(() => data?.questions || [], [data]);
  const allTopics = useMemo<MockTopic[]>(() => data?.topics || [], [data]);
  const multiSection = (data?.sections.length || 0) > 1;

  // Everything below scopes to the selected section (or the whole mock when null).
  const secQuestions = useMemo(
    () => (activeSection ? allQuestions.filter((q) => q.section === activeSection) : allQuestions),
    [allQuestions, activeSection]
  );
  const secTopics = useMemo(
    () => (activeSection ? allTopics.filter((t) => t.section === activeSection) : allTopics),
    [allTopics, activeSection]
  );
  const strong = useMemo(
    () => secTopics.filter((t) => t.score >= 0.7).sort((a, b) => b.score - a.score).slice(0, 5),
    [secTopics]
  );
  const weak = useMemo(
    () => secTopics.filter((t) => t.score < 0.7).sort((a, b) => a.score - b.score).slice(0, 5),
    [secTopics]
  );
  const badges = useMemo(() => {
    let attempted = 0, skipped = 0, correct = 0, wrong = 0;
    secQuestions.forEach((q) => {
      if (q.result === "skipped") skipped++;
      else {
        attempted++;
        if (q.result === "correct") correct++;
        else wrong++;
      }
    });
    return { attempted, skipped, correct, wrong };
  }, [secQuestions]);
  const diffSpread = useMemo(
    () =>
      BANDS.map((band) => {
        const qs = secQuestions.filter((q) => q.difficulty === band);
        const answered = qs.filter((q) => q.result !== "skipped").length;
        const correct = qs.filter((q) => q.result === "correct").length;
        return { band, answered, cleared: answered ? correct / answered : 0 };
      }),
    [secQuestions]
  );
  const secScore = activeSection ? data?.sections.find((s) => s.name === activeSection) : null;
  const secTimeMs = useMemo(
    () => (activeSection ? secQuestions.reduce((a, q) => a + (q.time_ms || 0), 0) : data?.timeMs || 0),
    [activeSection, secQuestions, data]
  );
  const shown = secQuestions.filter((q) => filter === "all" || q.result === filter);

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

            {/* Whole-mock stats */}
            <p className="maScopeLabel">{multiSection ? "Overall · whole mock" : `Section · ${data.section || ""}`}</p>
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

            {/* Section switcher (full mock only) */}
            {multiSection ? (
              <div className="maSecTabs">
                <button
                  type="button"
                  className={activeSection === null ? "active" : ""}
                  onClick={() => setActiveSection(null)}
                >
                  Overall
                </button>
                {data.sections.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    className={activeSection === s.name ? "active" : ""}
                    onClick={() => setActiveSection(s.name)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Section stats when a section is selected */}
            {activeSection && secScore ? (
              <>
                <p className="maScopeLabel">Section · {activeSection}</p>
                <section className="smStats">
                  <div className="smStat">
                    <div className="smNum">
                      {secScore.score}
                      <small>/{secScore.marks_total ?? "—"}</small>
                    </div>
                    <div className="smLab">Score</div>
                  </div>
                  <div className="smStat">
                    <div className="smNum">{pct(secScore.accuracy)}%</div>
                    <div className="smLab">Accuracy</div>
                  </div>
                  <div className="smStat">
                    <div className="smNum">{fmtT(secTimeMs / 1000)}</div>
                    <div className="smLab">Total time</div>
                  </div>
                  <div className="smStat">
                    <div className="smNum">
                      {secQuestions.length ? fmtT(secTimeMs / 1000 / secQuestions.length) : "--"}
                    </div>
                    <div className="smLab">Avg / question</div>
                  </div>
                </section>
              </>
            ) : null}

            <div className="maBadges">
              <span className="maBadge">
                <b>{badges.attempted}</b> attempted
              </span>
              <span className="maBadge">
                <b>{badges.skipped}</b> skipped
              </span>
              <span className="maBadge good">
                <b>{badges.correct}</b> correct
              </span>
              <span className="maBadge bad">
                <b>{badges.wrong}</b> wrong
              </span>
            </div>

            <section className="maDiff">
              <div className="smBoxH">
                <h3>Accuracy by difficulty</h3>
                <span>Cleared % per band</span>
              </div>
              <div className="maDiffBars">
                {diffSpread.map((b) => (
                  <div className="maDiffCol" key={b.band}>
                    <div className="maDiffTrack">
                      <div className="maDiffFill" style={{ height: `${pct(b.cleared)}%` }} aria-hidden="true" />
                      <span className="maDiffPct">{b.answered ? `${pct(b.cleared)}%` : "—"}</span>
                    </div>
                    <span className="maDiffLab">{b.band}</span>
                  </div>
                ))}
              </div>
            </section>

            {strong.length || weak.length ? (
              <div className="maTopics">
                <section className="maTopicCard">
                  <div className="smBoxH">
                    <h3>Strong topics</h3>
                  </div>
                  {strong.length ? (
                    strong.map((t) => (
                      <div className="maTopicRow" key={t.name}>
                        <span className="maTopicDot strong" aria-hidden="true" />
                        <span className="maTopicName">{t.name}</span>
                        <span className="maTopicPct">{pct(t.score)}%</span>
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
                  {weak.length ? (
                    weak.map((t) => (
                      <div className="maTopicRow" key={t.name}>
                        <span className="maTopicDot weak" aria-hidden="true" />
                        <span className="maTopicName">{t.name}</span>
                        <span className="maTopicPct">
                          {pct(t.score)}%
                          {t.attempted < t.total ? (
                            <em className="maTopicCov"> · {t.correct}/{t.total}</em>
                          ) : null}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="smNote">No weak topics — nice work.</p>
                  )}
                </section>
              </div>
            ) : null}

            {weak.length ? (
              <section className="maRecs">
                <div className="smBoxH">
                  <h3>Recommendations</h3>
                  <span>What to fix before your next mock</span>
                </div>
                <div className="maRecList">
                  {weak.map((t) => (
                    <div className="maRecRow" key={t.name}>
                      <span className="maRecBang" aria-hidden="true">
                        !
                      </span>
                      <p>
                        {pct(t.score)}% of <b>{t.name}</b> solved ({t.correct}/{t.total}) — attempt and
                        master the rest before your next mock.
                      </p>
                      <Link
                        className="maRecBtn"
                        href={t.section ? `/learn/${exam}/${t.section.toLowerCase()}` : `/mocks/${exam}/full`}
                      >
                        Go practice <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Time per question — scoped to the selected section */}
            {secQuestions.length ? (
              <section className="maTime">
                <div className="smBoxH">
                  <h3>Time per question</h3>
                  <span>{activeSection || "Whole mock"}</span>
                </div>
                <div className="maTimeChart">
                  <div className="maTimeYaxis">
                    {[TIME_MAX, 150, 100, 50, 0].map((v) => (
                      <span key={v}>{v}s</span>
                    ))}
                  </div>
                  <div className="maTimeBars">
                    {secQuestions.map((q, i) => {
                      const s = qState(q);
                      const secs = (q.time_ms || 0) / 1000;
                      const h = Math.min(100, (secs / TIME_MAX) * 100);
                      return (
                        <div className={`maTimeCol ${s}`} key={q.id}>
                          <div className="maTimeTrack">
                            <div className="maTimeFill" style={{ height: `${h}%` }} aria-hidden="true" />
                            <span className="maTimeVal">
                              {q.result === "skipped" || secs === 0 ? "--" : fmtT(secs)}
                            </span>
                          </div>
                          <span className="maTimeLab">Q{i + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="maTimeLegend">
                  <span className="correct">Correct</span>
                  <span className="slow">Correct, slow</span>
                  <span className="wrong">Wrong</span>
                  <span className="skipped">Skipped</span>
                </div>
              </section>
            ) : null}

            <section className="maReview">
              <div className="maReviewHead">
                <h3>Question review{activeSection ? ` · ${activeSection}` : ""}</h3>
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
                {shown.map((q) => {
                  const isOpen = !!open[q.id];
                  return (
                    <article className={`maQRow ${q.result}${isOpen ? " open" : ""}`} key={q.id}>
                      <button
                        type="button"
                        className="maQHead"
                        aria-expanded={isOpen}
                        onClick={() => setOpen((o) => ({ ...o, [q.id]: !o[q.id] }))}
                      >
                        <span className="maQNo">Q{secQuestions.indexOf(q) + 1}</span>
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
