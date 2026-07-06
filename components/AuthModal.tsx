"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, X } from "lucide-react";

export type AuthModalMode = "trial" | "signup" | "otp" | "login";

type AuthModalProps = {
  mode: AuthModalMode | null;
  onClose: () => void;
  onModeChange: (mode: AuthModalMode) => void;
};

export default function AuthModal({ mode, onClose, onModeChange }: AuthModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!mode) {
    return null;
  }

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
                <button className="googleButton" type="button">
                  <span>G</span>
                  Continue with Google
                </button>
                <div className="authDivider"><span>or</span></div>
                <form className="authForm">
                  <label>
                    Email address
                    <input type="email" placeholder="user45@domain.com" />
                  </label>
                  <label>
                    Password
                    <div className="passwordField">
                      <input type={showPassword ? "text" : "password"} placeholder="********" />
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
                  <button className="button primary authSubmit" type="button">
                    Login
                  </button>
                </form>
                <p className="authSwitch">
                  Don&apos;t have an account? <button type="button" onClick={() => onModeChange("signup")}>Sign Up</button>
                  <button type="button" className="forgotLink">Forgot password?</button>
                </p>
              </>
            ) : mode === "signup" ? (
              <>
                <h2 id="auth-title">Create your account</h2>
                <p>Sign up to start your prep journey</p>
                <button className="googleButton" type="button">
                  <span>G</span>
                  Continue with Google
                </button>
                <div className="authDivider"><span>or</span></div>
                <form className="authForm">
                  <div className="fieldGrid">
                    <label>
                      First name
                      <input type="text" placeholder="Alice" />
                    </label>
                    <label>
                      Last name
                      <input type="text" placeholder="Cooper" />
                    </label>
                  </div>
                  <label>
                    Email address
                    <input type="email" placeholder="user45@domain.com" />
                  </label>
                  <label>
                    Password
                    <input type="password" placeholder="********" />
                  </label>
                  <label className="checkLine">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(event) => setAccepted(event.target.checked)}
                    />
                    I agree with Orange Nelumbo&apos;s Privacy Policy and Terms of Service.
                  </label>
                  <button className="button primary authSubmit" type="button" onClick={() => onModeChange("otp")}>
                    Get OTP
                  </button>
                </form>
                <p className="authSwitch">
                  Already have an account? <button type="button" onClick={() => onModeChange("login")}>Log In</button>
                </p>
              </>
            ) : (
              <>
                <h2 id="auth-title">Verify OTP</h2>
                <p>
                  Enter the OTP sent to<br />
                  <small>User*****@domain.com <button type="button">Not you?</button></small>
                </p>
                <form className="authForm otpForm">
                  <label>
                    One-time password
                    <input type="text" inputMode="numeric" placeholder="-- -- -- --" />
                  </label>
                  <button className="button primary authSubmit" type="button" onClick={onClose}>
                    Create Account
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
