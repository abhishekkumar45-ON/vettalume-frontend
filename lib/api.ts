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

export type OtpSent = { status: string; email: string; dev_mode?: boolean };

export type MeResponse = { id: string; email: string; display_name: string | null };

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
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
