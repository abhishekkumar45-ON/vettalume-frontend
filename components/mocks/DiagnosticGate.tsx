"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { diagnosticApi, type DiagnosticState } from "@/lib/api";
import MockRunner from "@/components/mocks/MockRunner";
import Loading from "@/components/Loading";

// Enforces the one-time rule before the runner mounts: a completed diagnostic goes straight to its
// result; an unconfigured one shows a clear message; otherwise the full-format runner opens.
export default function DiagnosticGate({ exam }: { exam: string }) {
  const router = useRouter();
  const [state, setState] = useState<DiagnosticState | null>(null);

  useEffect(() => {
    let alive = true;
    diagnosticApi
      .status(exam)
      .then((s) => {
        if (!alive) return;
        if (s.state === "completed") {
          router.replace(`/diagnostic/${exam}/result`);
          return;
        }
        setState(s.state);
      })
      .catch(() => alive && setState("not_configured"));
    return () => {
      alive = false;
    };
  }, [exam, router]);

  if (state === null || state === "completed") {
    return <Loading label="Preparing your diagnostic…" />;
  }

  if (state === "not_configured") {
    return (
      <main className="mrInstr">
        <div className="sectionInner">
          <p className="mrInstrKicker">Diagnostic Test</p>
          <h1>Diagnostic not available yet</h1>
          <p className="mrInstrLead">
            No diagnostic test has been set up for {exam.toUpperCase()} yet. Please check back soon.
          </p>
          <div className="mrInstrBtns">
            <button type="button" className="mrBtn primary" onClick={() => router.push("/dashboard")}>
              Back to dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return <MockRunner exam={exam} mockId="" diagnostic />;
}
