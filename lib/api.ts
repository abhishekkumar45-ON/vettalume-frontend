// Thin client for the Vettalume FastAPI backend (auth, etc.).
// Override the base URL with NEXT_PUBLIC_API_URL (see .env.local).

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
const TOKEN_KEY = "vetta:token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore (private mode / quota)
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// FastAPI raises HTTPException with `detail` that is either a plain string or a
// structured object like { error, detail, ... }. Normalise both into a message.
function extractError(data: unknown, status: number): ApiError {
  const detail = (data as { detail?: unknown })?.detail;
  if (typeof detail === "string") return new ApiError(detail, status);
  if (detail && typeof detail === "object") {
    const d = detail as { detail?: string; error?: string };
    return new ApiError(d.detail || d.error || `Request failed (${status})`, status, d.error);
  }
  const err = (data as { error?: string })?.error;
  return new ApiError(err || `Request failed (${status})`, status, err);
}

async function apiSend<T = unknown>(method: string, path: string, body: unknown): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // lets an ngrok dev tunnel skip its browser-warning interstitial; ignored by a normal backend
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw new ApiError(`Cannot reach the server at ${BASE}. Is the backend running?`, 0, "network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw extractError(data, res.status);
  }
  return data as T;
}

export function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  return apiSend<T>("POST", path, body);
}

export function apiPatch<T = unknown>(path: string, body: unknown): Promise<T> {
  return apiSend<T>("PATCH", path, body);
}

// ---- typed auth calls ----

export type AuthSession = {
  access_token: string;
  token_type: string;
  learner_id: string;
  account: { id: string; email: string; display_name: string | null };
};

export type OtpSent = { status: string; email: string; dev_mode?: boolean; otp?: string | null };

export type MeResponse = { id: string; email: string; display_name: string | null };

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
  } catch {
    throw new ApiError(`Cannot reach the server at ${BASE}.`, 0, "network");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw extractError(data, res.status);
  return data as T;
}

export const authApi = {
  signup: (body: { full_name: string; email: string; password: string; phone?: string; accept_terms: boolean }) =>
    apiPost<OtpSent>("/auth/signup", body),
  verifyEmail: (body: { email: string; code: string }) => apiPost<AuthSession>("/auth/verify-email", body),
  resendOtp: (body: { email: string }) => apiPost<OtpSent>("/auth/resend-otp", body),
  login: (body: { email: string; password: string }) => apiPost<AuthSession>("/auth/login", body),
  forgotPassword: (body: { email: string }) => apiPost<OtpSent>("/auth/forgot-password", body),
  resetPassword: (body: { email: string; code: string; new_password: string }) =>
    apiPost<AuthSession>("/auth/reset-password", body),
  google: (body: { id_token: string; accept_terms: boolean }) =>
    apiPost<AuthSession>("/auth/google", body),
  me: () => apiGet<MeResponse>("/auth/me"),
  getProfile: () => apiGet<Profile>("/auth/profile"),
  updateProfile: (body: Partial<Profile>) => apiPatch<Profile & { status: string }>("/auth/profile", body),
  changePassword: (body: { current_password: string; new_password: string }) =>
    apiPost<{ status: string }>("/auth/change-password", body)
};

export type Profile = {
  email: string;
  full_name: string;
  phone: string;
  city: string;
  about: string;
  target_exam: string;
};

export type OverviewSubtopic = { id: string; name: string; pct: number };
export type DifficultyBand = { band: string; accuracy: number; answered: number; total: number };
export type OverviewChapter = {
  id: string;
  name: string;
  pct: number;
  difficulty: DifficultyBand[];
  subtopics: OverviewSubtopic[];
};
export type OverviewSection = {
  key: string;
  name: string;
  syllabus: number;
  ability: number;
  mastery: number;
  chapters: OverviewChapter[];
};
export type Overview = { exam: string; sections: OverviewSection[] };

export type ConceptDetail = {
  concept_id: string;
  name: string;
  mastery: number;
  learning_progress: number;
  attempts: number;
  // `body` is only the FIRST notes section; the rest are fetched via conceptSection (chunked delivery).
  content: {
    body: string;
    totalSections: number;
    videos: { title?: string; url?: string; duration?: string }[];
  };
};

export type NotesSection = { index: number; html: string; totalSections: number };

export type QuizQuestion = {
  id: string;
  format: string; // "mcq" | "tita"
  difficulty: number;
  stem: string;
  options: string[];
  image: string;
  correct_answer: string;
  solution: string;
  answered: boolean;
};

// A question image is either an absolute URL (legacy) or a "/media/{id}" path served by the API.
// Resolve the latter against the API base so <img> loads it from the backend, not the frontend.
export function mediaUrl(src: string | undefined | null): string {
  if (!src) return "";
  return src.startsWith("/media/") ? `${BASE}${src}` : src;
}
export type ConceptQuiz = {
  concept_id: string;
  name: string;
  next_index: number;
  questions: QuizQuestion[];
};

export const learnApi = {
  overview: (exam: string) => apiGet<Overview>(`/learn/overview?exam=${encodeURIComponent(exam)}`),
  concept: (nodeId: string) => apiGet<ConceptDetail>(`/learn/concept/${encodeURIComponent(nodeId)}`),
  conceptSection: (nodeId: string, index: number) =>
    apiGet<NotesSection>(`/learn/concept/${encodeURIComponent(nodeId)}/section/${index}`),
  quiz: (nodeId: string) => apiGet<ConceptQuiz>(`/learn/concept/${encodeURIComponent(nodeId)}/quiz`),
  answer: (itemId: string, answerGiven: string) =>
    apiPost<{ correct: boolean }>("/learn/answer", { item_id: itemId, answer_given: answerGiven }),
  engage: (nodeId: string, body: { read?: boolean; watched?: boolean }) =>
    apiPost<{ ok: boolean }>(`/learn/concept/${encodeURIComponent(nodeId)}/engage`, body)
};

// ---- Mocks (admin-authored sectional / full) ----
export type MockSectionSummary = { id: string; name: string; time: number; questionCount: number };
export type MockSummary = {
  id: string;
  exam: string;
  type: string; // "sectional" | "full"
  name: string;
  duration: number;
  negative: number;
  scoringMarks: number;
  scoringNeg: number;
  instructions: string;
  sections: MockSectionSummary[];
  totalQuestions: number;
  totalTime: number;
};
export type MockList = { exam: string; type: string | null; count: number; mocks: MockSummary[] };
export type MockQuestion = {
  id: string;
  text: string;
  options: string[];
  image: string;
  difficulty: number;
  format: string;
  passage?: string;
};
export type MockPaper = {
  id: string;
  name: string;
  type: string;
  exam: string;
  duration: number;
  instructions: string;
  negative: number;
  scoringMarks: number;
  scoringNeg: number;
  sections: { id: string; name: string; time: number; questions: MockQuestion[] }[];
  totalQuestions: number;
};
export type MockSectionScore = {
  name: string;
  raw: number;
  total: number;
  attempted: number;
  accuracy: number;
  score: number;
};
export type MockResult = {
  id: string;
  name: string;
  type: string;
  attemptId: string;
  sections: MockSectionScore[];
  overall: Omit<MockSectionScore, "name">;
};

export type MockAttemptRow = {
  attemptId: string;
  mockId: string;
  mockName: string;
  score: number;
  marksTotal: number;
  raw: number;
  total: number;
  attempted: number;
  accuracy: number;
  avgTimePerQ: number;
  completedAt: string | null;
};
export type SectionAnalysis = {
  exam: string;
  section: string;
  attempted: number;
  available: number;
  latestScore: number;
  bestScore: number;
  marksTotal: number;
  avgAccuracy: number;
  scoreTrend: { label: string; score: number; marksTotal: number }[];
  accuracyTrend: { label: string; accuracy: number }[];
  timeTrend: { label: string; avgTimePerQ: number }[];
  attempts: MockAttemptRow[];
};

export type FullAnalysisSection = {
  avgScore: number;
  bestScore: number;
  avgAccuracy: number;
  scoreTrend: { label: string; score: number; marksTotal: number }[];
  accuracyTrend: { label: string; accuracy: number }[];
};
export type FullAnalysis = {
  exam: string;
  attempted: number;
  available: number;
  avgScore: number;
  bestScore: number;
  lowestScore: number;
  marksTotal: number;
  avgAccuracy: number;
  avgTimePerQ: number;
  scoreTrend: { label: string; score: number; marksTotal: number }[];
  accuracyTrend: { label: string; accuracy: number }[];
  timeTrend: { label: string; avgTimePerQ: number }[];
  sections: Record<string, FullAnalysisSection>;
  attempts: (MockAttemptRow & { sections: MockSectionScore[] })[];
};

export type AttemptQuestion = {
  id: string;
  section: string;
  text: string;
  options: string[];
  your_answer: string;
  correct_answer: string;
  result: "correct" | "wrong" | "skipped";
  difficulty: string; // D1..D5
  solution: string;
  time_ms: number;
  benchmark_s: number | null;
};
export type MockTopic = {
  name: string;
  section: string;
  attempted: number;
  correct: number;
  total: number;
  accuracy: number;
  score: number; // correct / total (coverage-aware — drives strong/weak)
};
export type MockRecommendation = { name: string; section: string; accuracy: number; tip: string };
export type AttemptAnalysis = {
  attemptId: string;
  mockId: string;
  mockName: string;
  exam: string;
  type: string;
  section: string | null;
  completedAt: string | null;
  timeMs: number;
  topics: MockTopic[];
  strong: MockTopic[];
  weak: MockTopic[];
  recommendations: MockRecommendation[];
  overall: {
    raw: number;
    wrong: number;
    unattempted: number;
    total: number;
    attempted: number;
    accuracy: number;
    score: number;
    marks_total: number;
  };
  sections: (MockSectionScore & { wrong?: number; unattempted?: number; marks_total?: number })[];
  difficulty_spread: { band: string; answered: number; correct: number; cleared_pct: number }[];
  questions: AttemptQuestion[];
};

export type MockCardData = {
  mockId: string;
  name: string;
  type: string;
  section: string | null;
  score: number;
  marksTotal: number;
  pct: number;
  date: string | null;
} | null;
export type MockCardsSummary = {
  exam: string;
  bestSectional: MockCardData;
  lastSectional: MockCardData;
  bestFull: MockCardData;
  lastFull: MockCardData;
  sectionalAttempted: number;
  fullAttempted: number;
};

export const mockApi = {
  list: (exam: string, type?: "sectional" | "full") =>
    apiGet<MockList>(`/mocks?exam=${encodeURIComponent(exam)}${type ? `&type=${type}` : ""}`),
  paper: (id: string) => apiGet<MockPaper>(`/mocks/${encodeURIComponent(id)}`),
  submit: (
    id: string,
    answers: Record<string, number | string>,
    durations?: Record<string, number>,
    timeMs?: number
  ) =>
    apiPost<MockResult & { attemptId: string }>(`/mocks/${encodeURIComponent(id)}/submit`, {
      answers,
      durations: durations || {},
      timeMs: timeMs || 0
    }),
  // Aggregate analytics across every sectional-mock attempt in one section.
  sectionAnalysis: (exam: string, section: string) =>
    apiGet<SectionAnalysis>(
      `/mocks/section-analysis?exam=${encodeURIComponent(exam)}&section=${encodeURIComponent(section)}`
    ),
  // Aggregate analytics across every FULL-mock attempt in one exam.
  fullAnalysis: (exam: string) =>
    apiGet<FullAnalysis>(`/mocks/full-analysis?exam=${encodeURIComponent(exam)}`),
  // Best + most-recent sectional/full attempt for the dashboard mock cards.
  summary: (exam: string) =>
    apiGet<MockCardsSummary>(`/mocks/summary?exam=${encodeURIComponent(exam)}`),
  // Full analysis of one completed attempt (per-question review + scores).
  attemptAnalysis: (attemptId: string) =>
    apiGet<AttemptAnalysis>(`/mocks/attempts/${encodeURIComponent(attemptId)}`)
};

// ---- Diagnostic test ----------------------------------------------------------------------------
// A one-per-learner, full-format paper that is SEPARATE from the published mocks. The backend serves
// it from its own /diagnostic/* endpoints and records a DiagnosticAttempt (unique per learner+exam),
// never a MockAttempt. The paper is normalized to a MockPaper so the shared MockRunner can present it
// exactly like a full mock.
export type DiagnosticState = "available" | "in_progress" | "completed" | "not_configured";
export type DiagnosticStatus = {
  exam: string;
  state: DiagnosticState;
  diagnosticId: string | null;
  name: string | null;
  completedAt: string | null;
};
export type DiagnosticSectionAbility = {
  theta: number;
  se: number;
  band_95: number[];
  raw: number;
  total: number;
  n_items: number;
};
export type DiagnosticResultData = {
  exam: string;
  state: string;
  sections: Record<string, DiagnosticSectionAbility>;
  completedAt: string | null;
};

type RawDiagnosticPaper = {
  diagnostic_id: string;
  name: string;
  exam: string;
  duration: number;
  instructions: string;
  negative: number;
  sections: {
    id: string;
    name: string;
    time: number;
    questions: { id: string; text: string; options: string[]; image: string; difficulty: number }[];
  }[];
  total_questions: number;
};

function diagnosticPaperToMock(p: RawDiagnosticPaper): MockPaper {
  return {
    id: p.diagnostic_id,
    name: p.name,
    type: "full",
    exam: p.exam,
    duration: p.duration,
    instructions: p.instructions || "",
    negative: p.negative,
    scoringMarks: 3,
    scoringNeg: 1,
    sections: (p.sections || []).map((s) => ({
      id: s.id,
      name: s.name,
      time: s.time,
      questions: (s.questions || []).map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options || [],
        image: q.image || "",
        difficulty: q.difficulty || 0,
        format: q.options && q.options.length ? "mcq" : "tita"
      }))
    })),
    totalQuestions: p.total_questions
  };
}

export const diagnosticApi = {
  status: (exam: string) =>
    apiGet<{
      exam: string;
      state: DiagnosticState;
      diagnostic_id: string | null;
      name: string | null;
      completed_at: string | null;
    }>(`/diagnostic/status?exam=${encodeURIComponent(exam)}`).then(
      (s): DiagnosticStatus => ({
        exam: s.exam,
        state: s.state,
        diagnosticId: s.diagnostic_id,
        name: s.name,
        completedAt: s.completed_at
      })
    ),
  start: (exam: string) =>
    apiPost<RawDiagnosticPaper>(`/diagnostic/start?exam=${encodeURIComponent(exam)}`, {}).then(
      diagnosticPaperToMock
    ),
  submit: (exam: string, answers: Record<string, number | string>) =>
    apiPost<{
      exam: string;
      state: string;
      completed_at: string;
      overall: DiagnosticSectionAbility;
      sections: Record<string, DiagnosticSectionAbility>;
    }>(`/diagnostic/submit?exam=${encodeURIComponent(exam)}`, { answers }),
  result: (exam: string) =>
    apiGet<{
      exam: string;
      state: string;
      sections: Record<string, DiagnosticSectionAbility>;
      completed_at: string | null;
    }>(`/diagnostic/result?exam=${encodeURIComponent(exam)}`).then(
      (r): DiagnosticResultData => ({
        exam: r.exam,
        state: r.state,
        sections: r.sections,
        completedAt: r.completed_at
      })
    )
};

// "Contact us" form -> stored server-side and read by admins.
export const contactApi = {
  send: (body: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
  }) => apiPost<{ ok: boolean }>("/contact", body)
};

export type CouponResult = {
  valid: boolean;
  reason?: string;
  code?: string;
  type?: "percentage" | "fixed";
  discount?: number; // paise
  final?: number; // paise
  description?: string;
};

export type TrialStatus = {
  exam: string;
  tier: "paid" | "trial" | "free" | null;
  status: string | null;
  on_trial: boolean;
  paid: boolean;
  can_start_trial: boolean;
  days_left: number | null;
  expires_at: string | null;
  limits: { sectional_per_section: number | null; full_mocks: number | null; content: string | null };
  used: { full_mocks: number; sectional: Record<string, number> };
};

export const billingApi = {
  // Validate (preview) a coupon against a cart. `amount` is in paise; `exam` limits
  // course-restricted coupons. The backend does NOT consume the coupon here.
  validateCoupon: (body: { code: string; exam?: string; amount: number }) =>
    apiPost<CouponResult>("/billing/coupon/validate", body),
  // Start the one-time 7-day free trial for one exam (after signup).
  startTrial: (exam: string) => apiPost<TrialStatus>("/billing/start-trial", { exam }),
  // Trial state for the dashboard banner (days left, quota used, can_start_trial).
  trialStatus: (exam: string) => apiGet<TrialStatus>(`/billing/trial-status?exam=${encodeURIComponent(exam)}`)
};

// Password strength rules — must mirror the backend (services/security.password_problems).
export function passwordProblems(pw: string): string[] {
  const problems: string[] = [];
  if ((pw || "").length < 8) problems.push("at least 8 characters");
  if (!/[A-Z]/.test(pw)) problems.push("an uppercase letter");
  if (!/[a-z]/.test(pw)) problems.push("a lowercase letter");
  if (!/[0-9]/.test(pw)) problems.push("a number");
  if (!/[^A-Za-z0-9]/.test(pw)) problems.push("a special character");
  return problems;
}
