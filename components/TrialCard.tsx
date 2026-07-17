"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { billingApi, ApiError, type TrialStatus } from "@/lib/api";
import { useUser } from "@/components/UserContext";

// Dashboard card that starts / tracks the 7-day free trial for the active exam.
// Shows nothing for paid learners. Note: quota + content limits only bite once the backend's
// enforce_entitlements is on; the trial record (days left) is real regardless.
export default function TrialCard() {
  const { activeExam, authed } = useUser();
  const exam = activeExam.toUpperCase();
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!authed) return;
    setLoading(true);
    billingApi
      .trialStatus(activeExam)
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, [authed, activeExam]);

  useEffect(() => {
    load();
  }, [load]);

  async function start() {
    if (starting) return;
    setStarting(true);
    setError(null);
    try {
      const s = await billingApi.startTrial(activeExam);
      setStatus(s);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't start the trial. Try again.");
    } finally {
      setStarting(false);
    }
  }

  if (!authed || loading || !status) return null;
  if (status.paid) return null; // full access already

  // On trial → show days left + quota + upgrade.
  if (status.on_trial) {
    const full = status.limits.full_mocks;
    return (
      <div className="trialCard onTrial">
        <div className="trialHead">
          <span className="trialBadge"><Clock size={14} aria-hidden="true" /> Free trial</span>
          <strong>
            {status.days_left} day{status.days_left === 1 ? "" : "s"} left
          </strong>
        </div>
        <p>
          You&apos;re on the {exam} free trial — {status.limits.sectional_per_section} sectional mocks per
          section, {full} full mock{full === 1 ? "" : "s"}, and sample content.
          {full != null ? ` Full mocks used: ${status.used.full_mocks}/${full}.` : ""}
        </p>
        <Link className="button primary" href="/pricing">
          Upgrade for full access <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    );
  }

  // Never trialed (and not paid) → offer to start it.
  if (status.can_start_trial) {
    return (
      <div className="trialCard offer">
        <div className="trialHead">
          <span className="trialBadge"><Sparkles size={14} aria-hidden="true" /> 7-day free trial</span>
        </div>
        <p>
          Try {exam} free for 7 days — {status.limits.sectional_per_section ?? 4} sectional mocks per section,{" "}
          {status.limits.full_mocks ?? 2} full mocks, and sample content. No card required.
        </p>
        {error ? <p className="trialError">{error}</p> : null}
        <button className="button primary" type="button" onClick={start} disabled={starting}>
          {starting ? "Starting…" : `Start free trial`}
        </button>
      </div>
    );
  }

  // Trial used up / expired → must upgrade.
  return (
    <div className="trialCard ended">
      <div className="trialHead">
        <span className="trialBadge ended">Trial ended</span>
      </div>
      <p>Your {exam} free trial has ended. Upgrade to unlock unlimited mocks and all content.</p>
      <Link className="button primary" href="/pricing">
        See plans <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
