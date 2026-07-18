"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { EXAM_SLUGS, isExamSlug, type ExamSlug } from "@/app/examCatalog";
import { ApiError, authApi, clearToken, getToken } from "@/lib/api";
import type { AuthModalMode } from "@/components/AuthModal";

type UserState = {
  firstName: string | null;
  fullName: string | null;
  email: string | null;
  ownedExams: ExamSlug[];
  activeExam: ExamSlug;
};

export type Account = { email: string; display_name: string | null };

const STORAGE_KEY = "vetta:user:v2";

// Entitlements are still demo (owns all three exams) once signed in; real entitlements
// will come from the backend later. Identity (name/email) comes from the account.
const DEFAULT_STATE: UserState = {
  firstName: null,
  fullName: null,
  email: null,
  ownedExams: ["cat", "gmat", "gre"],
  activeExam: "cat"
};

function firstNameFrom(name: string | null | undefined, email?: string | null): string | null {
  const n = (name || "").trim();
  if (n) return n.split(/\s+/)[0];
  if (email) return email.split("@")[0];
  return null;
}

type UserContextValue = UserState & {
  authed: boolean;
  hydrated: boolean;
  isOwned: (exam: ExamSlug) => boolean;
  setActiveExam: (exam: ExamSlug) => void;
  signIn: (account: Account) => void;
  logout: () => void;
  purchase: (exam: ExamSlug) => void;
  // Global auth modal — lets any component (footer, guards, header) prompt login.
  authModalMode: AuthModalMode | null;
  openAuth: (mode?: AuthModalMode) => void;
  setAuthModalMode: (mode: AuthModalMode) => void;
  closeAuth: () => void;
  // Global free-trial popup.
  trialOpen: boolean;
  openTrial: () => void;
  closeTrial: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

function sanitize(raw: unknown): Partial<UserState> {
  if (!raw || typeof raw !== "object") return {};
  const value = raw as Partial<UserState>;
  const ownedExams = Array.isArray(value.ownedExams)
    ? value.ownedExams.filter((item): item is ExamSlug => typeof item === "string" && isExamSlug(item))
    : undefined;
  const activeExam =
    typeof value.activeExam === "string" && isExamSlug(value.activeExam) ? value.activeExam : undefined;
  return {
    firstName: typeof value.firstName === "string" ? value.firstName : undefined,
    fullName: typeof value.fullName === "string" ? value.fullName : undefined,
    email: typeof value.email === "string" ? value.email : undefined,
    ...(ownedExams && ownedExams.length ? { ownedExams } : {}),
    ...(activeExam ? { activeExam } : {})
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(DEFAULT_STATE);
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode | null>(null);
  const [trialOpen, setTrialOpen] = useState(false);

  function applyAccount(account: Account) {
    setState((prev) => ({
      ...prev,
      email: account.email,
      fullName: account.display_name || prev.fullName,
      firstName: firstNameFrom(account.display_name, account.email) || prev.firstName
    }));
    setAuthed(true);
  }

  function signOutLocal() {
    clearToken();
    setAuthed(false);
    setState((prev) => ({ ...prev, firstName: null, fullName: null, email: null }));
  }

  // Hydrate from localStorage, then confirm the session against the backend.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((prev) => ({ ...prev, ...sanitize(JSON.parse(raw)) }));
    } catch {
      // ignore corrupt storage
    }
    // Dev-only escape hatch: NEXT_PUBLIC_DEV_BYPASS_AUTH=true lets a teammate browse the full UI
    // without a reachable backend (no real login). Data-driven pages still need the API.
    if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true") {
      setState((prev) => ({
        ...prev,
        firstName: prev.firstName || "Guest",
        fullName: prev.fullName || "Guest",
        email: prev.email || "guest@dev.local"
      }));
      setAuthed(true);
      setHydrated(true);
      return;
    }
    const token = getToken();
    if (!token) {
      setAuthed(false);
      setHydrated(true);
      return;
    }
    // Have a token — verify it and load the real account. Only a real 401 (expired/invalid session)
    // signs out; a network blip (e.g. cold backend) keeps the stored session so active users aren't
    // dropped — the next reachable request will 401 if it truly expired.
    authApi
      .me()
      .then((me) => applyAccount({ email: me.email, display_name: me.display_name }))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) signOutLocal();
        else setAuthed(true);
      })
      .finally(() => setHydrated(true));
  }, []);

  // Re-check the session whenever the tab regains focus (notably after the device wakes from sleep).
  // If the session hit the 24h idle window or the 7-day cap, the backend 401s and we sign out here.
  useEffect(() => {
    if (!authed) return;
    if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true") return;
    let lastCheck = Date.now();
    const revalidate = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastCheck < 30_000) return; // throttle rapid focus/blur churn
      lastCheck = Date.now();
      authApi
        .me()
        .then((me) => applyAccount({ email: me.email, display_name: me.display_name }))
        .catch((err) => {
          if (err instanceof ApiError && err.status === 401) signOutLocal();
        });
    };
    document.addEventListener("visibilitychange", revalidate);
    window.addEventListener("focus", revalidate);
    return () => {
      document.removeEventListener("visibilitychange", revalidate);
      window.removeEventListener("focus", revalidate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  // Persist profile on change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write failures
    }
  }, [state]);

  const value = useMemo<UserContextValue>(() => {
    return {
      ...state,
      authed,
      hydrated,
      isOwned: (exam: ExamSlug) => state.ownedExams.includes(exam),
      setActiveExam: (exam: ExamSlug) =>
        setState((prev) => (prev.activeExam === exam ? prev : { ...prev, activeExam: exam })),
      // Called on any successful authentication (login / verified signup / Google / reset).
      signIn: (account: Account) => applyAccount(account),
      authModalMode,
      openAuth: (mode: AuthModalMode = "login") => setAuthModalMode(mode),
      setAuthModalMode: (mode: AuthModalMode) => setAuthModalMode(mode),
      closeAuth: () => setAuthModalMode(null),
      trialOpen,
      openTrial: () => setTrialOpen(true),
      closeTrial: () => setTrialOpen(false),
      logout: () => {
        clearToken();
        setAuthed(false);
        setState((prev) => ({ ...prev, firstName: null, fullName: null, email: null }));
      },
      purchase: (exam: ExamSlug) =>
        setState((prev) => ({
          ...prev,
          ownedExams: prev.ownedExams.includes(exam) ? prev.ownedExams : [...prev.ownedExams, exam],
          activeExam: exam
        }))
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, authed, hydrated, authModalMode, trialOpen]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}

export { EXAM_SLUGS };
