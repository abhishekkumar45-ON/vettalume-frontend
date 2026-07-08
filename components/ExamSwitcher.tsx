"use client";

import { usePathname, useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { EXAM_CATALOG, EXAM_SLUGS, type ExamSlug } from "@/app/examCatalog";
import { useUser } from "@/components/UserContext";

export default function ExamSwitcher() {
  const { activeExam, isOwned, setActiveExam } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // On the course listing route the URL owns the "current" exam; elsewhere it is the active exam.
  const routeExam = pathname.startsWith("/courses/") ? pathname.split("/")[2] : undefined;
  const current: ExamSlug =
    routeExam && (EXAM_SLUGS as string[]).includes(routeExam) ? (routeExam as ExamSlug) : activeExam;

  function select(exam: ExamSlug) {
    setActiveExam(exam);
    if (pathname.startsWith("/courses")) {
      router.push(`/courses/${exam}`);
    }
  }

  return (
    <div className="examSwitch" role="tablist" aria-label="Select exam">
      {EXAM_SLUGS.map((exam) => {
        const owned = isOwned(exam);
        const on = current === exam;
        const label = EXAM_CATALOG[exam].label;
        return (
          <button
            key={exam}
            type="button"
            role="tab"
            aria-selected={on}
            className={`examSwitchBtn${on ? " on" : ""}${owned ? "" : " locked"}`}
            title={owned ? label : `${label} — locked, tap to unlock`}
            onClick={() => select(exam)}
          >
            <span>{label}</span>
            {owned ? null : <Lock size={11} aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
