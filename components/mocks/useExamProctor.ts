"use client";

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";

type ProctorArgs = {
  // Proctoring is only enforced while the exam is actually in progress.
  active: boolean;
  // Total tab-switch / full-screen-exit warnings allowed before the test auto-submits.
  maxWarnings?: number;
  // Called once the warning limit is reached — should submit the test.
  onAutoSubmit: () => void;
  // Shared "already submitted" guard so post-submit navigation isn't flagged as cheating.
  submittedRef: MutableRefObject<boolean>;
};

export type ProctorState = {
  warnings: number;
  maxWarnings: number;
  overlayOpen: boolean;
  reason: string | null;
  // A counted violation shows how many strikes are left; a leave-attempt is just a reminder.
  counted: boolean;
  // Re-enter full-screen (needs a user gesture) and dismiss the overlay.
  resume: () => void;
};

// Locks a candidate into the exam: full-screen enforced, tab-switching and full-screen
// exits counted as warnings (auto-submit after `maxWarnings`), and page-leave attempts
// (refresh, close, back button) blocked.
export function useExamProctor({
  active,
  maxWarnings = 3,
  onAutoSubmit,
  submittedRef
}: ProctorArgs): ProctorState {
  const [warnings, setWarnings] = useState(0);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [counted, setCounted] = useState(true);

  const warnRef = useRef(0);
  const onAutoSubmitRef = useRef(onAutoSubmit);
  onAutoSubmitRef.current = onAutoSubmit;

  const registerViolation = useCallback(
    (why: string, doCount = true) => {
      if (!active || submittedRef.current) return;
      setReason(why);
      setCounted(doCount);
      if (!doCount) {
        setOverlayOpen(true);
        return;
      }
      const n = warnRef.current + 1;
      warnRef.current = n;
      setWarnings(n);
      if (n >= maxWarnings) {
        setOverlayOpen(false);
        onAutoSubmitRef.current();
      } else {
        setOverlayOpen(true);
      }
    },
    [active, maxWarnings, submittedRef]
  );

  // Warn on refresh / tab-close while the test is live (native browser prompt).
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (submittedRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [active, submittedRef]);

  // Trap the browser back button — you can't leave without submitting.
  useEffect(() => {
    if (!active) return;
    window.history.pushState(null, "", window.location.href);
    const onPop = () => {
      if (submittedRef.current) return;
      window.history.pushState(null, "", window.location.href);
      registerViolation("You can't leave the test using the back button. Use Submit to finish.", false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [active, registerViolation, submittedRef]);

  // Tab switch / minimise, and exiting full-screen — each is a counted warning.
  useEffect(() => {
    if (!active) return;
    const onVisibility = () => {
      if (document.hidden) registerViolation("You switched tabs or left the test window.");
    };
    const onFullscreen = () => {
      if (!document.fullscreenElement) registerViolation("You left full-screen mode.");
    };
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("fullscreenchange", onFullscreen);
    };
  }, [active, registerViolation]);

  const resume = useCallback(() => {
    setOverlayOpen(false);
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  return { warnings, maxWarnings, overlayOpen, reason, counted, resume };
}
