"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Lock } from "lucide-react";
import { EXAM_CATALOG, EXAM_SLUGS, type ExamSlug } from "@/app/examCatalog";
import { useUser } from "@/components/UserContext";

export default function ExamSwitcher() {
  const { activeExam, isOwned, setActiveExam } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // On the course listing route the URL owns the "current" exam; elsewhere it is the active exam.
  const routeExam = pathname.startsWith("/courses/") ? pathname.split("/")[2] : undefined;
  const current: ExamSlug =
    routeExam && (EXAM_SLUGS as string[]).includes(routeExam) ? (routeExam as ExamSlug) : activeExam;

  // Close the dropdown on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(exam: ExamSlug) {
    setActiveExam(exam);
    setOpen(false);
    if (pathname.startsWith("/courses")) {
      router.push(`/courses/${exam}`);
    }
  }

  return (
    <div className="courseMenu" ref={rootRef}>
      <button
        type="button"
        className="courseMenuTrigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{EXAM_CATALOG[current].label}</span>
        <ChevronDown size={15} aria-hidden="true" className={`courseMenuChevron${open ? " open" : ""}`} />
      </button>
      {open ? (
        <div className="courseMenuList" role="menu" aria-label="Select course">
          {EXAM_SLUGS.map((exam) => {
            const owned = isOwned(exam);
            const on = current === exam;
            const label = EXAM_CATALOG[exam].label;
            return (
              <button
                key={exam}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                className={`courseMenuItem${on ? " on" : ""}${owned ? "" : " locked"}`}
                onClick={() => select(exam)}
              >
                <span>{label}</span>
                {owned ? null : <Lock size={12} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
