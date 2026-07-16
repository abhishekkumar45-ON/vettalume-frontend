"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { learnApi, mediaUrl, type ConceptDetail, type QuizQuestion } from "@/lib/api";
import Loading from "@/components/Loading";
import { VirtualNotesViewer } from "@/components/VirtualNotesViewer";

type Mode = "concept" | "video" | "quiz";

type SubtopicLearningProps = {
  examLabel: string;
  exam: string;
  sectionSlug: string;
  chapterSlug: string;
  subtopicSlug: string;
  sectionHref: string;
  // fallbacks shown instantly; the real names replace them once the backend resolves
  sectionName: string;
  groupTitle: string;
  chapterName: string;
};

const LETTERS = ["A", "B", "C", "D", "E"];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Turn a pasted video link into something embeddable. Gumlet watch/share links become the
// play.gumlet.io embed; YouTube/Vimeo get their player URLs; direct files play in <video>.
function toEmbed(url: string): { kind: "iframe" | "file" | "none"; src: string } {
  const u = (url || "").trim();
  if (!u) return { kind: "none", src: "" };
  let m = u.match(/gumlet\.(?:tv|io)\/(?:watch|embed)\/([a-zA-Z0-9]+)/);
  if (m) return { kind: "iframe", src: `https://play.gumlet.io/embed/${m[1]}` };
  if (/play\.gumlet\.io\/embed\//.test(u)) return { kind: "iframe", src: u };
  m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
  if (m) return { kind: "iframe", src: `https://www.youtube.com/embed/${m[1]}` };
  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (m) return { kind: "iframe", src: `https://player.vimeo.com/video/${m[1]}` };
  if (/\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(u)) return { kind: "file", src: u };
  return { kind: "iframe", src: u };
}

// The MCQ correct answer may be stored as a letter ("A") or the option text — resolve to the value.
function mcqCorrect(q: QuizQuestion): string {
  const ca = (q.correct_answer || "").trim();
  const idx = "ABCDE".indexOf(ca.toUpperCase());
  if (ca.length === 1 && idx >= 0 && q.options[idx] != null) return q.options[idx];
  return ca;
}

function normalizeAnswer(s: string): string {
  return (s || "").trim().toLowerCase().replace(/\s+/g, "").replace(/,/g, "");
}

// Numerical (TITA) check: exact-string OR numeric equality.
function titaCorrect(typed: string, correct: string): boolean {
  const a = normalizeAnswer(typed);
  const b = normalizeAnswer(correct);
  if (a && a === b) return true;
  const na = parseFloat(a);
  const nb = parseFloat(b);
  return Number.isFinite(na) && Number.isFinite(nb) && na === nb;
}

function isTitaQ(q: QuizQuestion): boolean {
  return (q.format || "mcq").toLowerCase() === "tita";
}

function diffLabel(d: number): string {
  if (d <= 0) return "Easy";
  if (d === 1) return "Medium";
  return "Hard";
}

// Render a multi-line solution as steps ("Step 1: …", "Key point: …").
function SolutionSteps({ text }: { text: string }) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <div className="solSteps">
      {lines.map((line, i) => {
        const m = line.match(/^(Step\s*\d+|Key point|Answer|Note|Hint)\s*[:.\-]?\s*(.*)$/i);
        return m ? (
          <div className="solStep" key={i}>
            <b>{m[1]}:</b> {m[2]}
          </div>
        ) : (
          <div className="solStep" key={i}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

export default function SubtopicLearning({
  examLabel,
  exam,
  sectionSlug,
  chapterSlug,
  subtopicSlug,
  sectionHref,
  sectionName,
  groupTitle,
  chapterName
}: SubtopicLearningProps) {
  const [mode, setMode] = useState<Mode>("concept");
  const [concept, setConcept] = useState<ConceptDetail | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  // resolved display names (start from the title-cased fallbacks)
  const [names, setNames] = useState({ subtopic: chapterName, chapter: sectionName, section: groupTitle });
  const [vsel, setVsel] = useState(0);
  const [conceptId, setConceptId] = useState("");
  const [allDone, setAllDone] = useState(false);
  const [watchMarked, setWatchMarked] = useState(false);

  // quiz state
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    // Resolve the real node id from the backend (works for admin-created content with any id scheme),
    // then load that concept's content + quiz.
    learnApi
      .overview(exam)
      .then((ov) => {
        const sec = ov.sections.find((s) => s.key.toLowerCase() === sectionSlug.toLowerCase());
        const ch = sec?.chapters.find((c) => slugify(c.name) === chapterSlug);
        const sub = ch?.subtopics.find((t) => slugify(t.name) === subtopicSlug);
        if (!sec || !ch || !sub) {
          throw new Error("This subtopic isn't in the catalog yet.");
        }
        if (alive) {
          setNames({ subtopic: sub.name, chapter: ch.name, section: sec.name });
          setConceptId(sub.id);
        }
        // opening the concept counts as "read" toward the subtopic progress %
        learnApi.engage(sub.id, { read: true }).catch(() => {});
        return Promise.all([learnApi.concept(sub.id), learnApi.quiz(sub.id)]);
      })
      .then((res) => {
        if (!alive || !res) return;
        const [c, q] = res;
        setConcept(c);
        setQuestions(q.questions);
        // resume: jump to the first unanswered question
        if (q.questions.length > 0 && q.next_index >= q.questions.length) {
          setAllDone(true);
        } else {
          setQIndex(Math.min(q.next_index || 0, Math.max(0, q.questions.length - 1)));
        }
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
  }, [exam, sectionSlug, chapterSlug, subtopicSlug]);

  // opening the Video tab counts as "watched" toward the subtopic progress %
  useEffect(() => {
    if (mode === "video" && conceptId && !watchMarked) {
      setWatchMarked(true);
      learnApi.engage(conceptId, { watched: true }).catch(() => {});
    }
  }, [mode, conceptId, watchMarked]);

  function pick(next: Mode) {
    setMode(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const videos = concept?.content.videos ?? [];

  const current = questions[qIndex];
  const currentIsTita = current ? isTitaQ(current) : false;
  const currentCorrect = current && !currentIsTita ? mcqCorrect(current) : "";
  const titaOk = current && currentIsTita ? titaCorrect(typed, current.correct_answer) : false;
  const modes = useMemo(
    () => [
      { id: "concept" as Mode, num: "01", label: "Concept" },
      { id: "video" as Mode, num: "02", label: "Video" },
      { id: "quiz" as Mode, num: "03", label: "Quiz" }
    ],
    []
  );

  function submitAnswer() {
    if (!current) return;
    const tita = isTitaQ(current);
    const answerGiven = tita ? typed.trim() : selected ?? "";
    if (!answerGiven) return;
    setChecked(true);
    const ok = tita ? titaCorrect(typed, current.correct_answer) : selected === mcqCorrect(current);
    if (ok) setScore((s) => s + 1);
    // record the attempt so progress persists (resume, subtopic %, D1–D5 accuracy)
    learnApi.answer(current.id, answerGiven).catch(() => {});
  }
  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setTyped("");
    setChecked(false);
  }
  function restartQuiz() {
    setQIndex(0);
    setSelected(null);
    setTyped("");
    setChecked(false);
    setScore(0);
    setFinished(false);
    setAllDone(false);
  }

  return (
    <div className="subtopicPage" data-exam={examLabel}>
      <div className="stWrap">
        <div className="subbar">
          <Link className="back" href={sectionHref}>
            ← {names.chapter}
          </Link>
          <div className="crumb">
            {names.section} · {names.chapter} · Subtopic
          </div>
        </div>
      </div>

      <div className="stWrap">
        <section className={`chero rev${revealed ? " in" : ""}`}>
          <div className="ck">{names.section} · Subtopic</div>
          <h1>{names.subtopic}</h1>
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
            <Loading label="Loading…" compact />
          ) : error ? (
            <p className="prose" style={{ padding: "20px 0" }}>{error}</p>
          ) : (
            <>
              {/* CONCEPT */}
              <section className={`panel${mode === "concept" ? " on" : ""}`}>
                {concept ? (
                  <VirtualNotesViewer
                    conceptId={concept.concept_id}
                    initialHtml={concept.content.body || ""}
                    totalSections={concept.content.totalSections || 1}
                  />
                ) : (
                  <div className="prose">
                    <p>No concept notes yet.</p>
                  </div>
                )}
              </section>

              {/* VIDEO */}
              <section className={`panel${mode === "video" ? " on" : ""}`}>
                <div className="grid2">
                  <div>
                    {videos.length > 0
                      ? (() => {
                          const active = videos[Math.min(vsel, videos.length - 1)];
                          const embed = toEmbed(active?.url || "");
                          if (embed.kind === "iframe") {
                            return (
                              <div className="vplayer">
                                <iframe
                                  src={embed.src}
                                  title={active?.title || "Video"}
                                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                                  allowFullScreen
                                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                                />
                              </div>
                            );
                          }
                          if (embed.kind === "file") {
                            return (
                              <div className="vplayer">
                                <video
                                  src={embed.src}
                                  controls
                                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                                />
                              </div>
                            );
                          }
                          return (
                            <div className="vplayer">
                              <div className="vgrid" />
                              <div className="vmeta">
                                <span className="vt">{active?.title || "Video"}</span>
                                <span className="vd">no playable URL</span>
                              </div>
                            </div>
                          );
                        })()
                      : (
                        <div className="vplayer">
                          <div className="vgrid" />
                          <div className="vmeta">
                            <span className="vt">No video added yet</span>
                          </div>
                        </div>
                      )}
                    {videos.length > 0 ? (
                      <div className="chapters">
                        {videos.map((v, i) => (
                          <button
                            className={`vch${i === vsel ? " on" : ""}`}
                            key={i}
                            type="button"
                            onClick={() => setVsel(i)}
                            style={{ width: "100%", textAlign: "left" }}
                          >
                            <span className="vts">{v.duration || "—"}</span>
                            <span className="vcn">{v.title || `Lesson ${i + 1}`}</span>
                            <span className="vpl">▶</span>
                          </button>
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
                ) : finished || allDone ? (
                  <div className="qcard">
                    <div className="qtag">
                      <span>{finished ? "Result" : "All done"}</span>
                    </div>
                    <div className="qstem">
                      {finished
                        ? `You scored ${score} / ${questions.length}.`
                        : `You've already answered all ${questions.length} questions in this subtopic.`}
                    </div>
                    <div className="qfoot">
                      <button className="btn btn-primary" type="button" onClick={restartQuiz}>
                        Practice again
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
                      <div className="qtag">
                        <span>
                          Difficulty <b>{current ? diffLabel(current.difficulty) : "—"}</b>
                        </span>
                        <span>
                          Type <b>{currentIsTita ? "Numerical" : "Single correct"}</b>
                        </span>
                      </div>
                      <div className={current?.image ? "qbody hasImg" : "qbody"}>
                        {current?.image ? (
                          <img className="qimg" src={mediaUrl(current.image)} alt="" />
                        ) : null}
                        <div className="qstem">{current?.stem}</div>
                      </div>

                      {currentIsTita ? (
                        <div className="titaField">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Type your answer"
                            value={typed}
                            disabled={checked}
                            className={checked ? (titaOk ? "correct" : "wrong") : ""}
                            onChange={(e) => setTyped(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !checked && typed.trim()) submitAnswer();
                            }}
                          />
                          {checked ? (
                            <span className={`titaTag ${titaOk ? "correct" : "wrong"}`}>
                              {titaOk ? "Correct" : `Answer: ${current?.correct_answer}`}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <div className="opts">
                          {current?.options.map((opt, i) => {
                            let cls = "opt";
                            if (selected === opt && !checked) cls += " sel";
                            if (checked && opt === currentCorrect) cls += " correct";
                            if (checked && selected === opt && opt !== currentCorrect) cls += " wrong";
                            return (
                              <button
                                key={i}
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
                      )}

                      {checked && current?.solution ? (
                        <div className="ex" style={{ marginTop: 18 }}>
                          <div className="ex-h">Solution</div>
                          <SolutionSteps text={current.solution} />
                        </div>
                      ) : null}
                      <div className="qfoot">
                        {!checked ? (
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled={currentIsTita ? !typed.trim() : selected == null}
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
