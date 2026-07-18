"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, PartyPopper, X } from "lucide-react";
import { billingApi, ApiError, type TrialStatus } from "@/lib/api";
import { useUser } from "@/components/UserContext";
import { EXAM_SLUGS, type ExamSlug } from "@/app/examCatalog";

const BENEFITS = [
  "1st chapter of every section unlocked",
  "2 sectional mocks per section + 2 full mocks",
  "Valid for 7 days · one free trial per account"
];

// Global "Start Free Trial" popup: starts the one-time 7-day trial for the chosen exam and confirms it.
export default function TrialModal() {
  const { trialOpen, closeTrial, authed, activeExam, openAuth } = useUser();
  const [exam, setExam] = useState<ExamSlug>(activeExam);
  const [phase, setPhase] = useState<"choose" | "starting" | "done" | "error">("choose");
  const [result, setResult] = useState<TrialStatus | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  if (!trialOpen) return null;

  function close() {
    closeTrial();
    // reset for next open
    setPhase("choose");
    setResult(null);
    setErrMsg("");
  }

  async function start() {
    setPhase("starting");
    try {
      const r = await billingApi.startTrial(exam);
      setResult(r);
      setPhase("done");
    } catch (err) {
      setErrMsg(err instanceof ApiError ? err.message : "Couldn't start your trial. Please try again.");
      setPhase("error");
    }
  }

  return (
    <div className="trialModalOverlay" role="dialog" aria-modal="true" aria-label="Free trial">
      <div className="trialModalCard">
        <button className="trialModalClose" type="button" onClick={close} aria-label="Close">
          <X size={18} />
        </button>

        {!authed ? (
          <>
            <span className="trialBadge"><PartyPopper size={14} aria-hidden="true" /> Free trial</span>
            <h2>Claim your 7-day free trial</h2>
            <ul className="trialBenefits">
              {BENEFITS.map((b) => (
                <li key={b}><Check size={15} aria-hidden="true" /> {b}</li>
              ))}
            </ul>
            <p className="trialFine">Create your account to start — it&apos;s free, no card needed.</p>
            <button
              className="button primary trialCta"
              type="button"
              onClick={() => {
                closeTrial();
                openAuth("trial");
              }}
            >
              Sign up to start
            </button>
          </>
        ) : phase === "done" && result ? (
          <>
            <span className="trialPlacedIcon"><PartyPopper size={26} aria-hidden="true" /></span>
            <h2>You&apos;re on the {result.exam} free trial! 🎉</h2>
            <p className="trialFine">
              {result.days_left != null
                ? `Active for ${result.days_left} day${result.days_left === 1 ? "" : "s"}.`
                : "Active now."}{" "}
              Enjoy the 1st chapter of each section plus a few mocks.
            </p>
            <div className="trialModalBtns">
              <Link className="button primary" href="/dashboard" onClick={close}>Go to dashboard</Link>
              <Link className="button ghost" href={`/learn/${result.exam.toLowerCase()}`} onClick={close}>
                Start learning
              </Link>
            </div>
          </>
        ) : phase === "error" ? (
          <>
            <h2>Free trial</h2>
            <p className="trialError">{errMsg}</p>
            <div className="trialModalBtns">
              <Link className="button primary" href="/pricing" onClick={close}>See plans</Link>
              <button className="button ghost" type="button" onClick={close}>Close</button>
            </div>
          </>
        ) : (
          <>
            <span className="trialBadge"><PartyPopper size={14} aria-hidden="true" /> Free trial</span>
            <h2>Start your 7-day free trial</h2>
            <label className="trialExamLabel">Which exam?</label>
            <div className="trialExamPick">
              {EXAM_SLUGS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className={e === exam ? "active" : ""}
                  onClick={() => setExam(e)}
                >
                  {e.toUpperCase()}
                </button>
              ))}
            </div>
            <ul className="trialBenefits">
              {BENEFITS.map((b) => (
                <li key={b}><Check size={15} aria-hidden="true" /> {b}</li>
              ))}
            </ul>
            <button className="button primary trialCta" type="button" onClick={start} disabled={phase === "starting"}>
              {phase === "starting" ? <Loader2 size={16} className="spin" aria-hidden="true" /> : `Start ${exam.toUpperCase()} free trial`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
