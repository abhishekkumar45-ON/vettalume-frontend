"use client";

import { useEffect, useMemo } from "react";
import { useUser } from "@/components/UserContext";

// Renders a concept's HTML notes with content-protection: no text selection, no copy/cut,
// no right-click, no image drag, blocked print/save/view-source shortcuts, a print-guard, and a
// faint diagonal watermark carrying the learner's identity (so any leak is traceable). This is
// deterrence, not DRM — a determined user with dev tools can still reach the markup; true
// tamper-resistance needs chunked server-side delivery.
export default function ProtectedNotes({ html }: { html: string }) {
  const { email, fullName } = useUser();
  const label = (email || fullName || "Vettalume").trim();

  const watermark = useMemo(() => {
    const text = label.replace(/[<>&]/g, "");
    const svg =
      `<svg xmlns='http://www.w3.org/2000/svg' width='360' height='200'>` +
      `<text x='50%' y='50%' fill='rgba(30,26,18,0.055)' font-family='sans-serif' font-size='15' ` +
      `font-weight='700' text-anchor='middle' transform='rotate(-24 180 100)'>${text}</text></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [label]);

  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const k = (e.key || "").toLowerCase();
      const mod = e.ctrlKey || e.metaKey;
      // print / save / view-source / copy / cut
      if (mod && ["p", "s", "u", "c", "x"].includes(k)) e.preventDefault();
      // dev tools (best-effort — trivially bypassable, but raises the bar)
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

  return (
    <div className="notesShell">
      <div
        className="prose proseProtected"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        dangerouslySetInnerHTML={{ __html: html || "<p>No concept notes yet.</p>" }}
      />
      <div className="notesWatermark" aria-hidden="true" style={{ backgroundImage: watermark }} />
    </div>
  );
}
