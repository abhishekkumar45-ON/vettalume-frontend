"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, X } from "lucide-react";
import { authApi, setToken, type AuthSession } from "@/lib/api";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export type AuthModalMode =
  | "trial"
  | "signup"
  | "otp"
  | "login"
  | "forgot"
  | "forgotOtp"
  | "reset";

type AuthModalProps = {
  mode: AuthModalMode | null;
  onClose: () => void;
  onModeChange: (mode: AuthModalMode) => void;
  onSignIn?: (account: { email: string; display_name: string | null }) => void;
};

export default function AuthModal({ mode, onClose, onModeChange, onSignIn }: AuthModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!mode) {
    return null;
  }

  function finishAuthed(session: AuthSession) {
    setToken(session.access_token);
    onSignIn?.(session.account);
    onClose();
  }

  async function run(fn: () => Promise<void>) {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const doSignup = () =>
    run(async () => {
      if (!accepted) {
        throw new Error("Please accept the Privacy Policy and Terms of Service to continue.");
      }
      const res = await authApi.signup({
        full_name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        accept_terms: accepted
      });
      if (res.dev_mode) setNotice("Dev mode: the OTP was printed to the backend console.");
      onModeChange("otp");
    });

  const doVerify = () =>
    run(async () => {
      const session = await authApi.verifyEmail({ email, code });
      finishAuthed(session);
    });

  const doResend = () =>
    run(async () => {
      const res = await authApi.resendOtp({ email });
      setNotice(res.dev_mode ? "New OTP printed to the backend console." : "A new code has been sent.");
    });

  const doLogin = () =>
    run(async () => {
      const session = await authApi.login({ email, password });
      finishAuthed(session);
    });

  const doForgot = () =>
    run(async () => {
      const res = await authApi.forgotPassword({ email });
      if (res.dev_mode) setNotice("Dev mode: the reset code was printed to the backend console.");
      onModeChange("forgotOtp");
    });

  const doForgotVerify = () =>
    run(async () => {
      if (!code.trim()) throw new Error("Enter the code we sent to your email.");
      onModeChange("reset");
    });

  const doReset = () =>
    run(async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("The two passwords do not match.");
      }
      const session = await authApi.resetPassword({ email, code, new_password: newPassword });
      finishAuthed(session);
    });

  const feedback = error ? (
    <p className="authFeedback error" role="alert">
      {error}
    </p>
  ) : notice ? (
    <p className="authFeedback notice">{notice}</p>
  ) : null;

  return (
    <div className="authOverlay" role="dialog" aria-modal="true">
      <button className="authClose" type="button" aria-label="Close" onClick={onClose}>
        <X size={30} aria-hidden="true" />
      </button>

      {mode === "trial" ? (
        <section className="trialDialog" aria-labelledby="trial-title">
          <h2 id="trial-title">Start your 7 day free trial now</h2>
          <p>Get a taste of selected Orange Nelumbo sections with curated highlights from each.</p>
          <p>Upgrade to unlock the full experience and dive deep into every lesson, resource, and feature.</p>
          <button className="button primary trialStart" type="button" onClick={() => onModeChange("signup")}>
            START
          </button>
          <strong>*T&amp;C APPLIED</strong>
        </section>
      ) : (
        <>
          <section className="authPanel" aria-labelledby="auth-title">
            <Image className="authLogo" src="/logo-mark.png" alt="" width={112} height={68} priority />

            {mode === "login" ? (
              <>
                <h2 id="auth-title">Welcome</h2>
                <p>Log in to start your prep journey</p>
                <GoogleSignInButton onSuccess={finishAuthed} onError={setError} />
                <div className="authDivider"><span>or</span></div>
                <form className="authForm" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    Email address
                    <input
                      type="email"
                      placeholder="user45@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label>
                    Password
                    <div className="passwordField">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="pwToggle"
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
                      </button>
                    </div>
                  </label>
                  {feedback}
                  <button className="button primary authSubmit" type="button" onClick={doLogin} disabled={loading}>
                    {loading ? "Logging in…" : "Login"}
                  </button>
                </form>
                <p className="authSwitch">
                  Don&apos;t have an account? <button type="button" onClick={() => onModeChange("signup")}>Sign Up</button>
                  <button type="button" className="forgotLink" onClick={() => onModeChange("forgot")}>Forgot password?</button>
                </p>
              </>
            ) : mode === "signup" ? (
              <>
                <h2 id="auth-title">Create your account</h2>
                <p>Sign up to start your prep journey</p>
                <GoogleSignInButton onSuccess={finishAuthed} onError={setError} />
                <div className="authDivider"><span>or</span></div>
                <form className="authForm" onSubmit={(event) => event.preventDefault()}>
                  <div className="fieldGrid">
                    <label>
                      First name
                      <input type="text" placeholder="Alice" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </label>
                    <label>
                      Last name
                      <input type="text" placeholder="Cooper" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </label>
                  </div>
                  <label>
                    Email address
                    <input type="email" placeholder="user45@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </label>
                  <label>
                    Password
                    <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </label>
                  <label className="checkLine">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(event) => setAccepted(event.target.checked)}
                    />
                    I agree with Orange Nelumbo&apos;s Privacy Policy and Terms of Service.
                  </label>
                  {feedback}
                  <button className="button primary authSubmit" type="button" onClick={doSignup} disabled={loading}>
                    {loading ? "Sending OTP…" : "Get OTP"}
                  </button>
                </form>
                <p className="authSwitch">
                  Already have an account? <button type="button" onClick={() => onModeChange("login")}>Log In</button>
                </p>
              </>
            ) : mode === "otp" ? (
              <>
                <h2 id="auth-title">Verify OTP</h2>
                <p>
                  Enter the OTP sent to<br />
                  <small>{email || "your email"} <button type="button" onClick={() => onModeChange("signup")}>Not you?</button></small>
                </p>
                <form className="authForm otpForm" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    One-time password
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="-- -- -- --"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </label>
                  {feedback}
                  <button className="button primary authSubmit" type="button" onClick={doVerify} disabled={loading}>
                    {loading ? "Verifying…" : "Create Account"}
                  </button>
                  <button type="button" className="forgotLink" onClick={doResend} disabled={loading}>
                    Resend code
                  </button>
                </form>
              </>
            ) : mode === "forgot" ? (
              <>
                <h2 id="auth-title">Reset your password</h2>
                <p>Enter your account email and we&apos;ll send you a one-time password.</p>
                <form className="authForm" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    Email address
                    <input type="email" placeholder="user45@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </label>
                  {feedback}
                  <button className="button primary authSubmit" type="button" onClick={doForgot} disabled={loading}>
                    {loading ? "Sending OTP…" : "Send OTP"}
                  </button>
                </form>
                <p className="authSwitch">
                  Remembered it? <button type="button" onClick={() => onModeChange("login")}>Back to log in</button>
                </p>
              </>
            ) : mode === "forgotOtp" ? (
              <>
                <h2 id="auth-title">Verify OTP</h2>
                <p>
                  Enter the OTP sent to<br />
                  <small>{email || "your email"} <button type="button" onClick={() => onModeChange("forgot")}>Not you?</button></small>
                </p>
                <form className="authForm otpForm" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    One-time password
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="-- -- -- --"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </label>
                  {feedback}
                  <button className="button primary authSubmit" type="button" onClick={doForgotVerify} disabled={loading}>
                    Verify
                  </button>
                  <button type="button" className="forgotLink" onClick={doResend} disabled={loading}>
                    Resend code
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 id="auth-title">Create new password</h2>
                <p>Choose a strong password you haven&apos;t used before.</p>
                <form className="authForm" onSubmit={(event) => event.preventDefault()}>
                  <label>
                    New password
                    <div className="passwordField">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        className="pwToggle"
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
                      </button>
                    </div>
                  </label>
                  <label>
                    Confirm new password
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                  {feedback}
                  <button className="button primary authSubmit" type="button" onClick={doReset} disabled={loading}>
                    {loading ? "Resetting…" : "Reset password"}
                  </button>
                </form>
              </>
            )}
          </section>

          <div className="authArt" aria-hidden="true">
            <Image src="/hero-art.png" alt="" width={1204} height={745} priority />
          </div>
        </>
      )}
    </div>
  );
}
