"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  tag: string;
  accent: "gold" | "green" | "rose" | "blue";
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The diagnostic found gaps I didn't even know I had. Six weeks later DILR went from my weakest section to my strongest.",
    name: "Ananya Iyer",
    tag: "CAT · 99.2 %ile",
    accent: "gold"
  },
  {
    quote:
      "I stopped grinding random questions. The plan told me exactly what to do each day, and my score moved almost 90 points.",
    name: "Rohit Menon",
    tag: "GMAT · 735",
    accent: "green"
  },
  {
    quote:
      "It was never just practice. The adaptive drills hit me right at the edge of what I could do, so every single hour actually counted.",
    name: "Dilin Nair",
    tag: "GRE · 328",
    accent: "blue"
  },
  {
    quote:
      "Mock analysis showed the root concept behind every mistake. Fixing causes instead of symptoms is what changed everything.",
    name: "Sneha Kulkarni",
    tag: "CAT · 98.6 %ile",
    accent: "rose"
  },
  {
    quote:
      "The mocks mirrored the real exam interface exactly. On test day nothing felt new — I just executed the plan.",
    name: "Arjun Rao",
    tag: "GMAT · 705",
    accent: "green"
  },
  {
    quote:
      "Weekly recalibration kept me honest. The plan I finished with looked nothing like the one I started, and that is the point.",
    name: "Priya Menon",
    tag: "GRE · 322",
    accent: "gold"
  }
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = TESTIMONIALS.length;
  const go = (dir: number) => setActive((prev) => (prev + dir + total) % total);

  // Auto-advance every 2s; the timer resets on each change (incl. manual nav)
  // and pauses while the shopper hovers so they can finish reading.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => setActive((prev) => (prev + 1) % total), 2000);
    return () => clearTimeout(id);
  }, [active, paused, total]);

  const at = (offset: number) => (active + offset + total) % total;

  // Five visible cards: the highlighted centre, an inner pair, and a faded outer pair.
  const slots: Array<{
    index: number;
    role: "farPrev" | "prev" | "active" | "next" | "farNext";
  }> = [
    { index: at(-2), role: "farPrev" },
    { index: at(-1), role: "prev" },
    { index: active, role: "active" },
    { index: at(1), role: "next" },
    { index: at(2), role: "farNext" }
  ];

  return (
    <section className="section testimonialsSection" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="sectionInner">
        <div className="sectionHeader centered">
          <p className="eyebrow">Proof, not promises</p>
          <h2 id="testimonials-heading">Aspirants who trusted the plan</h2>
          <p>Real prep, real percentiles. Here is what changed once the roadmap did the thinking.</p>
        </div>

        <div
          className="tStage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slots.map(({ index, role }) => {
            const t = TESTIMONIALS[index];
            return (
              <article
                key={`${role}-${index}`}
                className={`tCard ${role} accent-${t.accent}`}
                onClick={role === "active" ? undefined : () => setActive(index)}
                aria-hidden={role !== "active"}
              >
                <Quote className="tQuoteMark" size={28} aria-hidden="true" />
                <p className="tQuote">{t.quote}</p>
                <div className="tPerson">
                  <span className="tAvatar">{initials(t.name)}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span className="tTag">{t.tag}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="tControls">
          <button type="button" className="tArrow" onClick={() => go(-1)} aria-label="Previous testimonial">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <div className="tDots" role="tablist" aria-label="Testimonials">
            {TESTIMONIALS.map((t, index) => (
              <button
                key={t.name}
                type="button"
                className={index === active ? "tDot active" : "tDot"}
                aria-label={`Show testimonial ${index + 1}`}
                aria-selected={index === active}
                role="tab"
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button type="button" className="tArrow" onClick={() => go(1)} aria-label="Next testimonial">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
