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
import { authApi, clearToken, getToken } from "@/lib/api";

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

  function applyAccount(account: Account) {
    setState((prev) => ({
      ...prev,
      email: account.email,
      fullName: account.display_name || prev.fullName,
      firstName: firstNameFrom(account.display_name, account.email) || prev.firstName
    }));
    setAuthed(true);
  }

  // Hydrate from localStorage, then confirm the session against the backend.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((prev) => ({ ...prev, ...sanitize(JSON.parse(raw)) }));
    } catch {
      // ignore corrupt storage
    }
    const token = getToken();
    if (!token) {
      setAuthed(false);
      setHydrated(true);
      return;
    }
    // Have a token — verify it and load the real account. If it's invalid/expired, sign out.
    authApi
      .me()
      .then((me) => applyAccount({ email: me.email, display_name: me.display_name }))
      .catch(() => {
        clearToken();
        setAuthed(false);
        setState((prev) => ({ ...prev, firstName: null, fullName: null, email: null }));
      })
      .finally(() => setHydrated(true));
  }, []);

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
  }, [state, authed, hydrated]);

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
