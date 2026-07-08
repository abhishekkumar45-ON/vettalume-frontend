"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Mode = "concept" | "material" | "video" | "quiz";

type SubtopicLearningProps = {
  examLabel: string;
  sectionHref: string;
  sectionName: string;
  groupTitle: string;
  chapterName: string;
};

const MODES: { id: Mode; num: string; label: string; done: boolean }[] = [
  { id: "concept", num: "01", label: "Concept", done: true },
  { id: "material", num: "02", label: "Material", done: true },
  { id: "video", num: "03", label: "Video", done: false },
  { id: "quiz", num: "04", label: "Quiz", done: false }
];

export default function SubtopicLearning({
  examLabel,
  sectionHref,
  sectionName,
  groupTitle,
  chapterName
}: SubtopicLearningProps) {
  const [mode, setMode] = useState<Mode>("concept");
  const [selected, setSelected] = useState("B");
  const [filled, setFilled] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(true);
    const timer = setTimeout(() => setFilled(true), 220);
    return () => clearTimeout(timer);
  }, []);

  function pick(next: Mode) {
    setMode(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="subtopicPage" data-exam={examLabel}>
      <div className="stWrap">
        <div className="subbar">
          <Link className="back" href={sectionHref}>
            ← {sectionName}
          </Link>
          <div className="crumb">
            {sectionName} · {groupTitle} · Subtopic
          </div>
        </div>
      </div>

      <div className="stWrap">
        <section className={`chero rev${revealed ? " in" : ""}`}>
          <div className="ck">Concept 3 of 6 · Est. 12 min</div>
          <h1>{chapterName}</h1>
          <p className="lede">
            When two bodies move along the same line, their speeds combine. Master the sign
            convention here and boats, trains and escalator problems all collapse into one idea.
          </p>
        </section>

        <nav className="modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mode${mode === m.id ? " on" : ""}`}
              onClick={() => pick(m.id)}
            >
              <span className="mnum">{m.num}</span>
              <span className="mlbl">{m.label}</span>
              <span className={`mdot${m.done ? "" : " todo"}`} />
            </button>
          ))}
        </nav>

        <div className="panels">
          {/* CONCEPT */}
          <section className={`panel${mode === "concept" ? " on" : ""}`}>
            <div className="grid2">
              <div className="prose">
                <p className="lead">
                  Relative motion asks a simple question: how fast does one object appear to move{" "}
                  <em>from the frame of another</em>? Once you fix a reference frame, every two-body
                  problem becomes a one-body problem.
                </p>
                <h2>The core rule</h2>
                <p>
                  If two objects move with speeds <b>a</b> and <b>b</b>, their relative speed depends
                  only on direction:
                </p>
                <div className="kfml">
                  Same direction → <b>|a − b|</b> &nbsp;&nbsp;·&nbsp;&nbsp; Opposite direction →{" "}
                  <b>a + b</b>
                </div>
                <p>That is the entire concept. Everything below is just this rule wearing a costume.</p>
                <div className="callout">
                  <div className="cl-h">Why it works</div>
                  <p>
                    Sit on the first object. From your seat you are stationary, so all of the closing
                    speed is carried by the second object. Adding or subtracting depends purely on
                    whether it approaches or recedes.
                  </p>
                </div>
                <h2>Trains crossing</h2>
                <p>
                  The classic application. When a train crosses a pole, it covers its own length. When
                  it crosses another train, it covers the sum of both lengths at the relative speed.
                </p>
                <div className="ex">
                  <div className="ex-h">Worked example</div>
                  <p className="ex-q">
                    Two trains, 180 m and 220 m long, run toward each other at 54 km/h and 36 km/h.
                    How long to fully cross?
                  </p>
                  <div className="ex-ans">
                    <div className="ex-al">Solution</div>
                    <div className="exstep">
                      <b>1 ·</b> Opposite direction → relative speed = 54 + 36 = 90 km/h = 25 m/s
                    </div>
                    <div className="exstep">
                      <b>2 ·</b> Combined length = 180 + 220 = 400 m
                    </div>
                    <div className="exstep">
                      <b>3 ·</b> Time = 400 / 25 ={" "}
                      <b style={{ color: "var(--gold-ink)" }}>16 seconds</b>
                    </div>
                  </div>
                </div>
                <p>
                  Notice you never tracked either train individually. That is the payoff of the
                  relative frame.
                </p>
              </div>

              <aside className="rail">
                <div className="rcard">
                  <div className="rc-h">Concept mastery</div>
                  <div className="mastery">
                    <div className="mv" style={{ color: "var(--course)" }}>
                      73<small style={{ fontSize: "20px" }}>%</small>
                    </div>
                    <div className="ml">above your average</div>
                  </div>
                  <div className="mtrack">
                    <i style={{ width: filled ? "73%" : "0%" }} />
                  </div>
                </div>
                <div className="rcard">
                  <div className="rc-h">Your progress</div>
                  <div className="mrow done">
                    <div className="mi">1</div>
                    <div className="mt">
                      <b>Concept</b>
                      <small>Completed</small>
                    </div>
                    <div className="mck" />
                  </div>
                  <div className="mrow done">
                    <div className="mi">2</div>
                    <div className="mt">
                      <b>Material</b>
                      <small>Completed</small>
                    </div>
                    <div className="mck" />
                  </div>
                  <div className="mrow cur">
                    <div className="mi">3</div>
                    <div className="mt">
                      <b>Video</b>
                      <small>In progress · 34%</small>
                    </div>
                    <div className="mck" />
                  </div>
                  <div className="mrow">
                    <div className="mi">4</div>
                    <div className="mt">
                      <b>Quiz</b>
                      <small>Not started</small>
                    </div>
                    <div className="mck" />
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* MATERIAL */}
          <section className={`panel${mode === "material" ? " on" : ""}`}>
            <div className="grid2">
              <div>
                <div className="mats">
                  <div className="mat">
                    <div className="fx" style={{ background: "var(--err)" }}>
                      PDF
                    </div>
                    <div className="mm">
                      <b>Relative Motion — Concept Sheet</b>
                      <small>4 pages · formulas + sign convention</small>
                    </div>
                    <div className="dl">↓</div>
                  </div>
                  <div className="mat">
                    <div className="fx" style={{ background: "var(--dilr)" }}>
                      SET
                    </div>
                    <div className="mm">
                      <b>Solved Examples Pack</b>
                      <small>14 problems with full working</small>
                    </div>
                    <div className="dl">↓</div>
                  </div>
                  <div className="mat">
                    <div className="fx" style={{ background: "var(--qa)" }}>
                      CARD
                    </div>
                    <div className="mm">
                      <b>Formula Flashcards</b>
                      <small>9 cards · spaced-repetition ready</small>
                    </div>
                    <div className="dl">↓</div>
                  </div>
                  <div className="mat">
                    <div className="fx" style={{ background: "var(--varc)" }}>
                      NOTE
                    </div>
                    <div className="mm">
                      <b>Common Traps &amp; Shortcuts</b>
                      <small>2 pages · exam-hall tips</small>
                    </div>
                    <div className="dl">↓</div>
                  </div>
                  <div className="mat">
                    <div className="fx" style={{ background: "var(--warn)" }}>
                      LINK
                    </div>
                    <div className="mm">
                      <b>Interactive Frame Simulator</b>
                      <small>drag two bodies, watch relative speed</small>
                    </div>
                    <div className="dl">→</div>
                  </div>
                </div>
                <div className="ex" style={{ marginTop: "22px" }}>
                  <div className="ex-h">Study order</div>
                  <p style={{ margin: 0 }}>
                    Skim the Concept Sheet first, attempt the Solved Examples with the sheet hidden,
                    then use the Flashcards the night before your next mock. The simulator is optional
                    but locks the sign convention in fast.
                  </p>
                </div>
              </div>
              <aside className="rail">
                <div className="rcard">
                  <div className="rc-h">Pairs well with</div>
                  <div className="mrow">
                    <div className="mi">▢</div>
                    <div className="mt">
                      <b>Trains</b>
                      <small>next subtopic</small>
                    </div>
                    <div className="dl" style={{ color: "var(--text-4)" }}>
                      →
                    </div>
                  </div>
                  <div className="mrow">
                    <div className="mi">▢</div>
                    <div className="mt">
                      <b>Boats &amp; Streams</b>
                      <small>applies same rule</small>
                    </div>
                    <div className="dl" style={{ color: "var(--text-4)" }}>
                      →
                    </div>
                  </div>
                </div>
              </aside>
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
                    <span className="vt">Relative Motion — Full Lecture</span>
                    <span className="vd">8:24</span>
                  </div>
                  <div className="vbar">
                    <i />
                  </div>
                </div>
                <div className="chapters">
                  <div className="vch on">
                    <span className="vts">0:00</span>
                    <span className="vcn">Setting up a reference frame</span>
                    <span className="vpl">▶</span>
                  </div>
                  <div className="vch">
                    <span className="vts">2:10</span>
                    <span className="vcn">Same vs opposite direction</span>
                    <span className="vpl">▶</span>
                  </div>
                  <div className="vch">
                    <span className="vts">4:05</span>
                    <span className="vcn">Trains crossing worked example</span>
                    <span className="vpl">▶</span>
                  </div>
                  <div className="vch">
                    <span className="vts">6:18</span>
                    <span className="vcn">Boats, escalators &amp; extensions</span>
                    <span className="vpl">▶</span>
                  </div>
                </div>
              </div>
              <aside className="rail">
                <div className="rcard">
                  <div className="rc-h">Watch progress</div>
                  <div className="mastery">
                    <div className="mv" style={{ color: "var(--course)" }}>
                      34<small style={{ fontSize: "20px" }}>%</small>
                    </div>
                    <div className="ml">2:52 watched</div>
                  </div>
                  <div className="mtrack">
                    <i style={{ width: filled ? "34%" : "0%" }} />
                  </div>
                </div>
                <div className="rcard">
                  <div className="rc-h">After this video</div>
                  <div className="mrow cur">
                    <div className="mi">▢</div>
                    <div className="mt">
                      <b>Take the quiz</b>
                      <small>6 questions · 8 min</small>
                    </div>
                    <div className="dl" style={{ color: "var(--course)" }}>
                      →
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* QUIZ */}
          <section className={`panel${mode === "quiz" ? " on" : ""}`}>
            <div className="qhead">
              <span className="qprog">
                Question <b style={{ color: "var(--text)" }}>2</b> of 6
              </span>
              <span className="qtimer">
                <i />
                07:41 left
              </span>
            </div>
            <div className="qcard">
              <div className="qtag">
                <span>
                  Difficulty <b>Medium</b>
                </span>
                <span>
                  Type <b>Single correct</b>
                </span>
                <span>
                  Concept <b>Relative Motion</b>
                </span>
              </div>
              <div className="qstem">
                Two trains of equal length, running in opposite directions at 60 km/h and 40 km/h,
                cross each other in 9 seconds. What is the length of each train?
              </div>
              <div className="opts">
                {[
                  { key: "A", text: "100 m" },
                  { key: "B", text: "125 m" },
                  { key: "C", text: "150 m" },
                  { key: "D", text: "180 m" }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`opt${selected === opt.key ? " sel" : ""}`}
                    onClick={() => setSelected(opt.key)}
                  >
                    <div className="ol">{opt.key}</div>
                    <div className="otx">{opt.text}</div>
                  </button>
                ))}
              </div>
              <div className="qfoot">
                <div className="qpalette">
                  <span className="qp done">1</span>
                  <span className="qp cur">2</span>
                  <span className="qp">3</span>
                  <span className="qp">4</span>
                  <span className="qp">5</span>
                  <span className="qp">6</span>
                </div>
                <button className="btn btn-ghost" type="button">
                  Skip
                </button>
                <button className="btn btn-primary" type="button">
                  Submit &amp; next <span>→</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
