"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { learnApi } from "@/lib/api";
import { useUser } from "@/components/UserContext";

interface SectionEntry {
  index: number;
  html: string;
  measuredHeight: number;
  evicted: boolean;
  loading: boolean;
}

// Windowed notes viewer: only ~a couple of sections are ever in the DOM at once. Sections load as the
// reader scrolls and are evicted (replaced by a height-preserving placeholder) once they fall two
// steps behind, so the full body is never present to grab. Also carries the content protections:
// no select/copy/cut/right-click/drag, and a faint identity watermark.
export function VirtualNotesViewer({
  conceptId,
  initialHtml,
  totalSections
}: {
  conceptId: string;
  initialHtml: string;
  totalSections: number;
}) {
  const { email, fullName } = useUser();

  const [sections, setSections] = useState<SectionEntry[]>([
    { index: 1, html: initialHtml, measuredHeight: 0, evicted: false, loading: false }
  ]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionWrapperRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sentinelRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const placeholderRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const fetchingRef = useRef<Set<number>>(new Set());
  const sectionsRef = useRef<SectionEntry[]>(sections);
  const loadSectionRef = useRef<(index: number, direction: "forward" | "backward") => void>(() => {});

  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  // Reset when the concept changes.
  useEffect(() => {
    setSections([{ index: 1, html: initialHtml, measuredHeight: 0, evicted: false, loading: false }]);
    fetchingRef.current.clear();
  }, [conceptId, initialHtml]);

  const loadSection = useCallback(
    async (index: number, direction: "forward" | "backward") => {
      if (index < 1 || index > totalSections) return;
      if (fetchingRef.current.has(index)) return;
      const existing = sectionsRef.current.find((s) => s.index === index);
      if (existing && !existing.evicted && !existing.loading && existing.html) return;
      fetchingRef.current.add(index);

      // Capture the height of the section we will evict before it leaves the DOM.
      const evictIndex = direction === "forward" ? index - 2 : index + 2;
      const evictEl = sectionWrapperRefs.current.get(evictIndex);
      const capturedHeight = evictEl?.offsetHeight ?? 0;

      setSections((prev) => {
        const entry = prev.find((s) => s.index === index);
        if (entry) return prev.map((s) => (s.index === index ? { ...s, loading: true } : s));
        return [...prev, { index, html: "", measuredHeight: 0, evicted: false, loading: true }].sort(
          (a, b) => a.index - b.index
        );
      });

      try {
        const data = await learnApi.conceptSection(conceptId, index);
        setSections((prev) => {
          let next = prev.map((s) =>
            s.index === index
              ? { index, html: data.html, measuredHeight: 0, evicted: false, loading: false }
              : s
          );
          const toEvict = next.find((s) => s.index === evictIndex && !s.evicted && s.html !== "");
          if (toEvict) {
            const height = capturedHeight > 0 ? capturedHeight : 400;
            next = next.map((s) =>
              s.index === evictIndex ? { ...s, evicted: true, html: "", measuredHeight: height } : s
            );
          }
          return next;
        });
      } catch {
        setSections((prev) =>
          prev.map((s) =>
            s.index === index
              ? { ...s, loading: false, evicted: true, measuredHeight: capturedHeight || 400 }
              : s
          )
        );
      } finally {
        fetchingRef.current.delete(index);
      }
    },
    [conceptId, totalSections]
  );

  useEffect(() => {
    loadSectionRef.current = loadSection;
  }, [loadSection]);

  // Preload section 2 so the first scroll is seamless.
  useEffect(() => {
    if (totalSections >= 2) loadSectionRef.current(2, "forward");
  }, [conceptId, totalSections]);

  // One IntersectionObserver, reading loadSectionRef so its callback is never stale.
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.dataset.nextFor !== undefined) {
            loadSectionRef.current(parseInt(el.dataset.nextFor, 10) + 1, "forward");
          }
          if (el.dataset.placeholderSection !== undefined) {
            loadSectionRef.current(parseInt(el.dataset.placeholderSection, 10), "backward");
          }
        });
      },
      { rootMargin: "600px 0px", threshold: 0 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const setSectionWrapperRef = useCallback((el: HTMLDivElement | null, index: number) => {
    if (el) sectionWrapperRefs.current.set(index, el);
    else sectionWrapperRefs.current.delete(index);
  }, []);

  const setSentinelRef = useCallback((el: HTMLDivElement | null, index: number) => {
    const existing = sentinelRefs.current.get(index);
    if (existing) observerRef.current?.unobserve(existing);
    if (el) {
      sentinelRefs.current.set(index, el);
      observerRef.current?.observe(el);
    } else {
      sentinelRefs.current.delete(index);
    }
  }, []);

  const setPlaceholderRef = useCallback((el: HTMLDivElement | null, index: number) => {
    const existing = placeholderRefs.current.get(index);
    if (existing) observerRef.current?.unobserve(existing);
    if (el) {
      placeholderRefs.current.set(index, el);
      observerRef.current?.observe(el);
    } else {
      placeholderRefs.current.delete(index);
    }
  }, []);

  // Content protection: block copy/cut/print/save/view-source/devtools while notes are open.
  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const k = (e.key || "").toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      if (mod && ["p", "s", "u", "c", "x"].includes(k)) e.preventDefault();
      if (k === "f12") e.preventDefault();
      if (mod && e.shiftKey && ["i", "j", "c"].includes(k)) e.preventDefault();
    };
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("keydown", onKey, true);
    document.documentElement.classList.add("notesProtected");
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("keydown", onKey, true);
      document.documentElement.classList.remove("notesProtected");
    };
  }, []);

  const watermark = useMemo(() => {
    const label = (email || fullName || "Vettalume").trim().replace(/[<>&]/g, "");
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='200'>` +
      `<text x='50%' y='50%' fill='rgba(30,26,18,0.055)' font-family='sans-serif' font-size='15' ` +
      `font-weight='700' text-anchor='middle' transform='rotate(-24 180 100)'>${label}</text></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [email, fullName]);

  const noBlock = (e: SyntheticEvent) => e.preventDefault();

  return (
    <div className="notesShell">
      {sections.map((section) => {
        if (section.evicted || section.loading) {
          return (
            <div
              key={section.index}
              ref={(el) => setPlaceholderRef(el, section.index)}
              data-placeholder-section={section.index}
              style={{ minHeight: section.measuredHeight || 400 }}
              className={section.loading ? "notesPlaceholder loading" : "notesPlaceholder"}
            >
              {section.loading && <div className="notesSpinner" aria-hidden="true" />}
            </div>
          );
        }
        return (
          <div key={section.index} ref={(el) => setSectionWrapperRef(el, section.index)}>
            <div
              className="prose proseProtected"
              onContextMenu={noBlock}
              onCopy={noBlock}
              onCut={noBlock}
              onDragStart={noBlock}
              dangerouslySetInnerHTML={{ __html: section.html || "<p>No concept notes yet.</p>" }}
            />
            {section.index < totalSections && (
              <div
                ref={(el) => setSentinelRef(el, section.index)}
                data-next-for={section.index}
                style={{ height: 1, visibility: "hidden" }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
      <div className="notesWatermark" aria-hidden="true" style={{ backgroundImage: watermark }} />
    </div>
  );
}

export default VirtualNotesViewer;
