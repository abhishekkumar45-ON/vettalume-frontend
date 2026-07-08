"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { learnApi, type ConceptDetail, type QuizQuestion } from "@/lib/api";

type Mode = "concept" | "video" | "material" | "quiz";

type SubtopicLearningProps = {
  examLabel: string;
  sectionHref: string;
  sectionName: string;
  groupTitle: string;
  chapterName: string;
  conceptId: string;
};

const LETTERS = ["A", "B", "C", "D", "E"];

export default function SubtopicLearning({
  examLabel,
  sectionHref,
  sectionName,
  groupTitle,
  chapterName,
  conceptId
}: SubtopicLearningProps) {
  const [mode, setMode] = useState<Mode>("concept");
  const [concept, setConcept] = useState<ConceptDetail | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  // quiz state
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.all([learnApi.concept(conceptId), learnApi.quiz(conceptId)])
      .then(([c, q]) => {
        if (!alive) return;
        setConcept(c);
        setQuestions(q.questions);
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : "Could not load this subtopic.");
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
          setRevealed(true);
        }
      });
    return () => {
      alive = false;
    };
  }, [conceptId]);

  function pick(next: Mode) {
    setMode(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const videos = concept?.content.videos ?? [];
  const masteryPct = Math.round((concept?.mastery ?? 0) * 100);

  const current = questions[qIndex];
  const modes = useMemo(
    () => [
      { id: "concept" as Mode, num: "01", label: "Concept" },
      { id: "material" as Mode, num: "02", label: "Material" },
      { id: "video" as Mode, num: "03", label: "Video" },
      { id: "quiz" as Mode, num: "04", label: "Quiz" }
    ],
    []
  );

  function submitAnswer() {
    if (!current || selected == null) return;
    setChecked(true);
    if (selected === current.correct_answer) setScore((s) => s + 1);
  }
  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  }
  function restartQuiz() {
    setQIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setFinished(false);
  }

  return (
    <div className="subtopicPage" data-exam={examLabel}>
      <div className="stWrap">
        <div className="subbar">
          <Link className="back" href={sectionHref}>
            ← {sectionName}
          </Link>
          <div className="crumb">
            {groupTitle} · {chapterName} · Subtopic
          </div>
        </div>
      </div>

      <div className="stWrap">
        <section className={`chero rev${revealed ? " in" : ""}`}>
          <div className="ck">{groupTitle} · Subtopic</div>
          <h1>{chapterName}</h1>
          <p className="lede">
            Work through the concept, watch the lesson, then test yourself. Your mastery updates as you
            practise.
          </p>
        </section>

        <nav className="modes">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mode${mode === m.id ? " on" : ""}`}
              onClick={() => pick(m.id)}
            >
              <span className="mnum">{m.num}</span>
              <span className="mlbl">{m.label}</span>
              <span className="mdot" />
            </button>
          ))}
        </nav>

        <div className="panels">
          {loading ? (
            <p className="prose" style={{ padding: "20px 0" }}>Loading…</p>
          ) : error ? (
            <p className="prose" style={{ padding: "20px 0" }}>{error}</p>
          ) : (
            <>
              {/* CONCEPT */}
              <section className={`panel${mode === "concept" ? " on" : ""}`}>
                <div className="grid2">
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{
                      __html: concept?.content.body || "<p>No concept notes yet.</p>"
                    }}
                  />
                  <aside className="rail">
                    <div className="rcard">
                      <div className="rc-h">Concept mastery</div>
                      <div className="mastery">
                        <div className="mv" style={{ color: "var(--course)" }}>
                          {masteryPct}
                          <small style={{ fontSize: "20px" }}>%</small>
                        </div>
                        <div className="ml">{concept?.attempts ? `${concept.attempts} attempts` : "not started"}</div>
                      </div>
                      <div className="mtrack">
                        <i style={{ width: `${masteryPct}%` }} />
                      </div>
                    </div>
                  </aside>
                </div>
              </section>

              {/* MATERIAL */}
              <section className={`panel${mode === "material" ? " on" : ""}`}>
                <div className="ex">
                  <div className="ex-h">Study material</div>
                  <p style={{ margin: 0 }}>
                    Downloadable notes and worksheets for this subtopic will appear here once an admin
                    uploads them from the content portal.
                  </p>
                </div>
              </section>

              {/* VIDEO */}
              <section className={`panel${mode === "video" ? " on" : ""}`}>
                <div className="grid2">
                  <div>
                    <div className="vplayer">
                      <div className="vgrid" />
                      <button className="vplay" type="button">
                        <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
                          <path d="M3 3 L23 14 L3 25 Z" fill="#181a18" />
                        </svg>
                      </button>
                      <div className="vmeta">
                        <span className="vt">{videos[0]?.title || `${chapterName} — Lecture`}</span>
                        <span className="vd">{videos[0]?.duration || "—"}</span>
                      </div>
                    </div>
                    {videos.length > 0 ? (
                      <div className="chapters">
                        {videos.map((v, i) => (
                          <div className={`vch${i === 0 ? " on" : ""}`} key={i}>
                            <span className="vts">{v.duration || "—"}</span>
                            <span className="vcn">{v.title || `Lesson ${i + 1}`}</span>
                            <span className="vpl">▶</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="prose" style={{ marginTop: 14 }}>No video added yet.</p>
                    )}
                  </div>
                  <aside className="rail">
                    <div className="rcard">
                      <div className="rc-h">Up next</div>
                      <div className="mrow cur">
                        <div className="mi">▢</div>
                        <div className="mt">
                          <b>Take the quiz</b>
                          <small>{questions.length} questions</small>
                        </div>
                        <button className="dl" style={{ color: "var(--course)" }} type="button" onClick={() => pick("quiz")}>
                          →
                        </button>
                      </div>
                    </div>
                  </aside>
                </div>
              </section>

              {/* QUIZ */}
              <section className={`panel${mode === "quiz" ? " on" : ""}`}>
                {questions.length === 0 ? (
                  <div className="ex">
                    <div className="ex-h">Quiz</div>
                    <p style={{ margin: 0 }}>No quiz questions added for this subtopic yet.</p>
                  </div>
                ) : finished ? (
                  <div className="qcard">
                    <div className="qtag">
                      <span>Result</span>
                    </div>
                    <div className="qstem">
                      You scored {score} / {questions.length}.
                    </div>
                    <div className="qfoot">
                      <button className="btn btn-primary" type="button" onClick={restartQuiz}>
                        Try again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="qhead">
                      <span className="qprog">
                        Question <b style={{ color: "var(--text)" }}>{qIndex + 1}</b> of {questions.length}
                      </span>
                    </div>
                    <div className="qcard">
                      <div className="qstem">{current?.stem}</div>
                      <div className="opts">
                        {current?.options.map((opt, i) => {
                          let cls = "opt";
                          if (selected === opt && !checked) cls += " sel";
                          if (checked && opt === current.correct_answer) cls += " correct";
                          if (checked && selected === opt && opt !== current.correct_answer) cls += " wrong";
                          return (
                            <button
                              key={opt}
                              type="button"
                              className={cls}
                              disabled={checked}
                              onClick={() => setSelected(opt)}
                            >
                              <div className="ol">{LETTERS[i]}</div>
                              <div className="otx">{opt}</div>
                            </button>
                          );
                        })}
                      </div>
                      {checked && current?.solution ? (
                        <div className="ex" style={{ marginTop: 18 }}>
                          <div className="ex-h">Solution</div>
                          <p style={{ margin: 0 }}>{current.solution}</p>
                        </div>
                      ) : null}
                      <div className="qfoot">
                        {!checked ? (
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled={selected == null}
                            onClick={submitAnswer}
                          >
                            Submit
                          </button>
                        ) : (
                          <button className="btn btn-primary" type="button" onClick={nextQuestion}>
                            {qIndex + 1 >= questions.length ? "Finish" : "Next →"}
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
