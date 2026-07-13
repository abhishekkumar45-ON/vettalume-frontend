"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Check, Lock, Maximize2 } from "lucide-react";
import { mockApi, type MockPaper, type MockQuestion } from "@/lib/api";
import { useUser } from "@/components/UserContext";
import Loading from "@/components/Loading";
import MockCalculator from "@/components/mocks/MockCalculator";

type Q = MockQuestion & { passage?: string };
type Status = "answered" | "markedAnswered" | "marked" | "notAnswered" | "notVisited";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function fmtClock(sec: number) {
  sec = Math.max(0, Math.round(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m} : ${s < 10 ? "0" : ""}${s}`;
}
function isTita(q: Q) {
  return q.format === "tita" || !(q.options && q.options.length);
}

export default function MockRunner({ exam, mockId }: { exam: string; mockId: string }) {
  const router = useRouter();
  const { firstName, fullName, email } = useUser();
  const candidateName =
    fullName || firstName || (email ? email.split("@")[0] : "") || "Candidate";
  const initials =
    candidateName
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  const [paper, setPaper] = useState<MockPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"instructions" | "exam">("instructions");
  const [agreed, setAgreed] = useState(false);

  const [secIdx, setSecIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [secLeft, setSecLeft] = useState<number[]>([]);
  const [secDone, setSecDone] = useState<boolean[]>([]); // sections already submitted (CAT: no return)
  const [calcOpen, setCalcOpen] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // per-question + total timing
  const durRef = useRef<Record<string, number>>({});
  const qStartRef = useRef(0);
  const qIdRef = useRef<string | null>(null);
  const examStartRef = useRef(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    let alive = true;
    mockApi
      .paper(mockId)
      .then((p) => {
        if (!alive) return;
        setPaper(p);
        setSecLeft((p.sections || []).map((s) => (Number(s.time) || 40) * 60));
        setSecDone((p.sections || []).map(() => false));
      })
      .catch(() => alive && setError("Could not load this mock."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [mockId]);

  const sections = paper?.sections || [];
  const section = sections[secIdx];
  const questions = (section?.questions || []) as Q[];
  const current = questions[qIdx];

  const bankTime = useCallback(() => {
    if (qIdRef.current && qStartRef.current) {
      durRef.current[qIdRef.current] =
        (durRef.current[qIdRef.current] || 0) + (Date.now() - qStartRef.current);
    }
  }, []);

  // mark visited + start timing the shown question
  useEffect(() => {
    if (phase !== "exam" || !current) return;
    bankTime();
    qIdRef.current = current.id;
    qStartRef.current = Date.now();
    setVisited((v) => (v[current.id] ? v : { ...v, [current.id]: true }));
  }, [phase, current, bankTime]);

  const doSubmit = useCallback(async () => {
    if (submittedRef.current || !paper) return;
    submittedRef.current = true;
    setSubmitting(true);
    bankTime();
    const timeMs = examStartRef.current ? Date.now() - examStartRef.current : 0;
    try {
      const res = await mockApi.submit(mockId, answers, durRef.current, timeMs);
      const attempt = res.attemptId;
      if (paper.type === "sectional") {
        const sec = (paper.sections?.[0]?.name || "").toLowerCase();
        router.push(`/mocks/${exam}/sectional/${sec}/${attempt}`);
      } else {
        router.push(`/mocks/${exam}/full/${attempt}`);
      }
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
      setError("Could not submit — check your connection and try again.");
    }
  }, [paper, mockId, answers, exam, router, bankTime]);

  // CAT full-mock flow: submit the current section, lock it, and move to the next in order — you
  // can't return. The last section's submit grades the whole test.
  const advanceSection = useCallback(() => {
    if (submittedRef.current) return;
    bankTime();
    setSecDone((prev) => {
      const n = [...prev];
      n[secIdx] = true;
      return n;
    });
    if (secIdx + 1 < sections.length) {
      setSecIdx(secIdx + 1);
      setQIdx(0);
    } else {
      doSubmit();
    }
  }, [secIdx, sections.length, doSubmit, bankTime]);
  const advanceRef = useRef(advanceSection);
  advanceRef.current = advanceSection;

  // section timer — the active section counts down; at zero it auto-submits that section.
  useEffect(() => {
    if (phase !== "exam") return;
    const t = setInterval(() => {
      setSecLeft((prev) => {
        const next = [...prev];
        if (next[secIdx] > 0) next[secIdx] -= 1;
        if (next[secIdx] <= 0) advanceRef.current();
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, secIdx]);

  function start() {
    examStartRef.current = Date.now();
    setPhase("exam");
    try {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } catch {
      /* ignore */
    }
  }

  const setAnswer = (qid: string, val: string) => setAnswers((a) => ({ ...a, [qid]: val }));
  const locked = secLeft[secIdx] <= 0;

  function goNext() {
    if (qIdx < questions.length - 1) setQIdx(qIdx + 1);
  }
  function saveNext() {
    if (current) setVisited((v) => ({ ...v, [current.id]: true }));
    goNext();
  }
  function markNext() {
    if (current) setMarked((m) => ({ ...m, [current.id]: true }));
    goNext();
  }
  function clearResponse() {
    if (!current) return;
    setAnswers((a) => {
      const n = { ...a };
      delete n[current.id];
      return n;
    });
  }

  function statusOf(q: Q): Status {
    const ans = answers[q.id] != null && answers[q.id] !== "";
    const mk = !!marked[q.id];
    if (ans && mk) return "markedAnswered";
    if (mk) return "marked";
    if (ans) return "answered";
    if (visited[q.id]) return "notAnswered";
    return "notVisited";
  }

  const counts = useMemo(() => {
    const c = { answered: 0, notAnswered: 0, marked: 0, markedAnswered: 0, notVisited: 0 };
    questions.forEach((q) => {
      c[statusOf(q)]++;
    });
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, answers, marked, visited]);

  if (loading) return <Loading label="Loading the mock…" />;
  if (error && !paper) return <p className="smNote sectionInner">{error}</p>;
  if (!paper) return null;

  // ---------- Instructions ----------
  if (phase === "instructions") {
    const secRows = sections.map((s) => {
      const n = (s.questions || []).length;
      return { name: s.name, n, marks: n * 3, time: Number(s.time) || 40 };
    });
    const totalQ = secRows.reduce((a, r) => a + r.n, 0);
    const totalMarks = totalQ * 3;
    const totalTime = secRows.reduce((a, r) => a + r.time, 0);
    return (
      <main className="mrInstr">
        <div className="sectionInner">
          <p className="mrInstrKicker">{paper.type === "full" ? "Full Mock" : "Sectional Mock"}</p>
          <h1>{paper.name}</h1>
          <p className="mrInstrLead">
            Read the instructions carefully. The test opens in a CAT-style interface. Your timer
            starts as soon as you begin.
          </p>

          <div className="mrInstrGrid">
            <div className="mrInstrStat">
              <b>{totalQ}</b>
              <span>Total questions</span>
            </div>
            <div className="mrInstrStat">
              <b>{totalMarks}</b>
              <span>Total marks</span>
            </div>
            <div className="mrInstrStat">
              <b>{paper.type === "full" ? totalTime : secRows[0]?.time || 40}</b>
              <span>Minutes</span>
            </div>
            <div className="mrInstrStat">
              <b>{sections.length}</b>
              <span>Section{sections.length === 1 ? "" : "s"}</span>
            </div>
          </div>

          <h3>Sections &amp; timing</h3>
          <table className="mrInstrTable">
            <thead>
              <tr>
                <th>Section</th>
                <th>Questions</th>
                <th>Marks</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {secRows.map((r) => (
                <tr key={r.name}>
                  <td>{r.name}</td>
                  <td>{r.n}</td>
                  <td>{r.marks}</td>
                  <td>{r.time} min</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Marking scheme</h3>
          <ul className="mrInstrList">
            <li>
              <span className="mrPos">+3</span> for every correct answer.
            </li>
            <li>
              <span className="mrNeg">−1</span> for every incorrect MCQ answer.
            </li>
            <li>
              <b>No negative marking</b> for TITA (Type-In-The-Answer) questions or unanswered
              questions.
            </li>
          </ul>

          <h3>Question palette</h3>
          <div className="mrLegend mrLegendInstr">
            <span className="mrLeg answered"><i>0</i> Answered</span>
            <span className="mrLeg notAnswered"><i>0</i> Not Answered</span>
            <span className="mrLeg marked"><i>0</i> Marked for Review</span>
            <span className="mrLeg markedAnswered"><i>0</i> Answered &amp; Marked</span>
            <span className="mrLeg notVisited"><i>0</i> Not Visited</span>
          </div>

          <h3>Navigation &amp; rules</h3>
          <ul className="mrInstrList">
            <li>Use <b>Save &amp; Next</b> to record your answer and move on; the palette on the right jumps to any question.</li>
            <li><b>Mark for Review &amp; Next</b> flags a question to revisit; <b>Clear Response</b> removes your answer.</li>
            {sections.length > 1 ? (
              <li>Each section has its own timer. When a section&apos;s time runs out it locks and the next section opens automatically.</li>
            ) : (
              <li>The section timer counts down; when it reaches zero the test submits automatically.</li>
            )}
            <li>A basic <b>Calculator</b> is available from the header (top-right).</li>
            <li>When the timer expires the test is <b>submitted automatically</b>. You can also submit any time with <b>Submit</b>.</li>
          </ul>

          <label className="mrAgree">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            I have read and understood the instructions and am ready to begin.
          </label>

          <div className="mrInstrBtns">
            <button type="button" className="mrBtn" onClick={() => router.back()}>
              Back
            </button>
            <button type="button" className="mrBtn primary" disabled={!agreed || totalQ === 0} onClick={start}>
              Start Test
            </button>
          </div>
          {totalQ === 0 ? <p className="smNote">This mock has no questions yet.</p> : null}
        </div>
      </main>
    );
  }

  // ---------- Exam ----------
  const tita = current ? isTita(current) : false;
  const passage = current?.passage;
  const twoPane = !!passage;
  // In a full mock, submitting a non-final section only submits THAT section and advances; the
  // final section (and any sectional mock) submits the whole test.
  const isLastSection = secIdx === sections.length - 1;
  const sectionSubmit = paper.type === "full" && !isLastSection;

  return (
    <div className="mrExam">
      <header className="mrHeader">
        <div className="mrGroup">Group 1</div>
        <div className="mrSectionLabel">Section</div>
        <div className="mrClock">
          Time Left: <b>{fmtClock(secLeft[secIdx] || 0)}</b>
        </div>
        <div className="mrHeaderTools">
          <button type="button" onClick={() => setCalcOpen((v) => !v)} aria-label="Calculator" title="Calculator">
            <Calculator size={18} />
          </button>
          <button
            type="button"
            aria-label="Fullscreen"
            title="Fullscreen"
            onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </header>

      <nav className="mrTabs">
        {sections.map((s, i) => {
          // CAT rule: sections are attempted in order — done sections lock, later sections are
          // locked until you reach them. Only the current section is active. No manual switching.
          const state = secDone[i] ? "done" : i === secIdx ? "active" : "locked";
          return (
            <span key={s.id || s.name} className={`mrTab ${state}`}>
              {s.name}
              {state === "done" ? <Check size={13} aria-hidden="true" /> : null}
              {state === "locked" ? <Lock size={12} aria-hidden="true" /> : null}
            </span>
          );
        })}
      </nav>

      <div className="mrMarking">
        Type: {tita ? "TITA" : "MCQ"} | Marks: <span className="mrPos">+3</span>{" "}
        <span className="mrNeg">{tita ? "0" : "−1"}</span>
      </div>

      <div className="mrBody">
        <div className={`mrQArea${twoPane ? " two" : ""}`}>
          {twoPane ? (
            <div className="mrPassage">
              <p className="mrPassageText">{passage}</p>
            </div>
          ) : null}
          <div className="mrQuestion">
            <div className="mrQNo">Question No. {qIdx + 1}</div>
            {current ? (
              <>
                {current.image ? <img className="mrQImg" src={current.image} alt="" /> : null}
                <div className="mrQStem">{current.text}</div>
                {tita ? (
                  <input
                    className="mrTita"
                    type="text"
                    placeholder="Type your answer"
                    value={answers[current.id] ?? ""}
                    disabled={locked}
                    onChange={(e) => setAnswer(current.id, e.target.value)}
                  />
                ) : (
                  <div className="mrOptions">
                    {(current.options || []).map((o, i) => (
                      <label className={`mrOpt${answers[current.id] === String(i) ? " sel" : ""}`} key={i}>
                        <input
                          type="radio"
                          name={`q-${current.id}`}
                          checked={answers[current.id] === String(i)}
                          disabled={locked}
                          onChange={() => setAnswer(current.id, String(i))}
                        />
                        <span className="mrOptLetter">{LETTERS[i] || i + 1}</span>
                        <span className="mrOptText">{o}</span>
                      </label>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="smNote">No question.</p>
            )}
          </div>
        </div>

        <aside className="mrPalette">
          <div className="mrCandidate">
            <span className="mrAvatar" aria-hidden="true">{initials}</span>
            <span className="mrCandName">{candidateName}</span>
          </div>
          <button type="button" className="mrSubmit top" onClick={() => setConfirmSubmit(true)}>
            {sectionSubmit ? `Submit ${section?.name || "Section"}` : "Submit Test"}
          </button>
          <div className="mrLegend">
            <span className="mrLeg answered"><i>{counts.answered}</i> Answered</span>
            <span className="mrLeg notAnswered"><i>{counts.notAnswered}</i> Not Answered</span>
            <span className="mrLeg notVisited"><i>{counts.notVisited}</i> Not Visited</span>
            <span className="mrLeg marked"><i>{counts.marked}</i> Marked for Review</span>
            <span className="mrLeg markedAnswered"><i>{counts.markedAnswered}</i> Answered &amp; Marked</span>
          </div>
          <div className="mrPaletteHead">{section?.name}</div>
          <div className="mrPaletteSub">Choose a Question</div>
          <div className="mrGrid">
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                className={`mrCell ${statusOf(q)}${i === qIdx ? " cur" : ""}`}
                onClick={() => setQIdx(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <footer className="mrFooter">
        <div className="mrFootLeft">
          <button type="button" className="mrBtn" onClick={markNext}>
            Mark for Review &amp; Next
          </button>
          <button type="button" className="mrBtn" onClick={clearResponse}>
            Clear Response
          </button>
        </div>
        <div className="mrFootRight">
          <button type="button" className="mrBtn saveNext" onClick={saveNext}>
            Save &amp; Next
          </button>
        </div>
      </footer>

      {calcOpen ? <MockCalculator onClose={() => setCalcOpen(false)} /> : null}

      {confirmSubmit ? (
        <div className="mrOverlay">
          <div className="mrDialog">
            <h3>{sectionSubmit ? `Submit the ${section?.name} section?` : "Submit the test?"}</h3>
            <p>
              You have answered {counts.answered + counts.markedAnswered} of {questions.length} in this
              section.{" "}
              {sectionSubmit
                ? "You won't be able to return to it — the next section opens once you submit."
                : "Once submitted you can't change your answers."}
            </p>
            <div className="mrDialogBtns">
              <button type="button" className="mrBtn" onClick={() => setConfirmSubmit(false)}>
                Keep going
              </button>
              <button
                type="button"
                className="mrBtn primary"
                disabled={submitting}
                onClick={() => {
                  setConfirmSubmit(false);
                  if (sectionSubmit) advanceSection();
                  else doSubmit();
                }}
              >
                {submitting
                  ? "Submitting…"
                  : sectionSubmit
                    ? `Submit ${section?.name}`
                    : "Submit test"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
