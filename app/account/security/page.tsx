"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import AccountSettingsShell, {
  SettingsField,
  SettingsSectionHeader
} from "@/components/AccountSettingsShell";
import { authApi, passwordProblems } from "@/lib/api";
import { useUser } from "@/components/UserContext";

const RULES: { key: string; label: string; test: (pw: string) => boolean }[] = [
  { key: "len", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "upper", label: "An uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "A lowercase letter", test: (p) => /[a-z]/.test(p) },
  { key: "num", label: "A number", test: (p) => /[0-9]/.test(p) },
  { key: "special", label: "A special character", test: (p) => /[^A-Za-z0-9]/.test(p) }
];

function PasswordInput({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="passwordField">
      <input
        type={show ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="pwToggle"
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}
      >
        {show ? <Eye size={18} aria-hidden="true" /> : <EyeOff size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

export default function SecurityPage() {
  const { email } = useUser();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  const problems = passwordProblems(next);
  const mismatch = confirm.length > 0 && confirm !== next;
  const canSubmit = current.length > 0 && problems.length === 0 && !mismatch && confirm.length > 0;

  async function submit() {
    setStatus(null);
    if (mismatch) {
      setStatus({ kind: "err", msg: "The new passwords do not match." });
      return;
    }
    if (problems.length) {
      setStatus({ kind: "err", msg: `Your new password needs ${problems.join(", ")}.` });
      return;
    }
    setSaving(true);
    try {
      await authApi.changePassword({ current_password: current, new_password: next });
      setStatus({ kind: "ok", msg: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setStatus({ kind: "err", msg: err instanceof Error ? err.message : "Could not update password." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AccountSettingsShell active="security">
      <SettingsSectionHeader title="Account Security" text="Password, sign-in and connected accounts." />
      <form className="settingsForm" onSubmit={(e) => e.preventDefault()}>
        <SettingsField label="Current Password" wide>
          <PasswordInput value={current} onChange={setCurrent} placeholder="Your current password" />
        </SettingsField>
        <SettingsField label="New Password">
          <PasswordInput value={next} onChange={setNext} placeholder="At least 8 characters" />
        </SettingsField>
        <SettingsField label="Confirm New Password">
          <PasswordInput value={confirm} onChange={setConfirm} placeholder="Re-enter new password" />
        </SettingsField>

        {next.length > 0 ? (
          <ul className="pwChecklist" aria-label="Password requirements">
            {RULES.map((r) => {
              const ok = r.test(next);
              return (
                <li key={r.key} className={ok ? "ok" : "no"}>
                  {ok ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                  {r.label}
                </li>
              );
            })}
            <li className={confirm.length === 0 ? "no" : mismatch ? "no" : "ok"}>
              {confirm.length > 0 && !mismatch ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
              Passwords match
            </li>
          </ul>
        ) : null}

        <div className="settingsActions">
          <button className="button primary" type="button" onClick={submit} disabled={!canSubmit || saving}>
            {saving ? "Updating…" : "Update Password"}
          </button>
          {status ? (
            <span className={status.kind === "ok" ? "savedIndicator" : "settingsError"}>{status.msg}</span>
          ) : null}
        </div>
      </form>

      <div className="settingsDivider" />
      <p className="settingsKicker">Connected Account</p>
      <section className="connectedAccount">
        <strong className="googleMark">G</strong>
        <div>
          <b>Google</b>
          <span>{email || "Not connected"}</span>
        </div>
        <button className="connectedButton" type="button">{email ? "Connected" : "—"}</button>
      </section>
    </AccountSettingsShell>
  );
}
