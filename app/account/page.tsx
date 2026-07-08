"use client";

import { useEffect, useState } from "react";
import { SettingsField, SettingsSectionHeader } from "@/components/AccountSettingsShell";
import AccountSettingsShell from "@/components/AccountSettingsShell";
import { useUser } from "@/components/UserContext";
import { authApi, type Profile } from "@/lib/api";

function initialsOf(name: string, email: string): string {
  const n = name.trim();
  if (n) {
    const parts = n.split(/\s+/);
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase();
  }
  return (email?.[0] || "U").toUpperCase();
}

const EMPTY: Profile = { email: "", full_name: "", phone: "", city: "", about: "", target_exam: "" };

export default function AccountPage() {
  const { signIn } = useUser();
  const [form, setForm] = useState<Profile>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    authApi
      .getProfile()
      .then((p) => setForm(p))
      .catch(() => setStatus({ kind: "err", msg: "Please log in to view your account." }))
      .finally(() => setLoaded(true));
  }, []);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setStatus(null);
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const saved = await authApi.updateProfile({
        full_name: form.full_name,
        phone: form.phone,
        city: form.city,
        about: form.about,
        target_exam: form.target_exam
      });
      setForm(saved);
      // keep the header/greeting in sync with the new name
      signIn({ email: saved.email, display_name: saved.full_name });
      setStatus({ kind: "ok", msg: "Saved" });
    } catch (err) {
      setStatus({ kind: "err", msg: err instanceof Error ? err.message : "Could not save." });
    } finally {
      setSaving(false);
    }
  }

  const displayName = form.full_name || (form.email ? form.email.split("@")[0] : "Your account");

  return (
    <AccountSettingsShell active="account">
      <section className="profileSummary">
        <div className="avatarInitials">{initialsOf(form.full_name, form.email)}</div>
        <div>
          <h2>{displayName}</h2>
          <p>{form.email || "—"}</p>
          <small>{form.target_exam ? `${form.target_exam} track` : "Set your target exam below"}</small>
        </div>
        <span className="planPill">◆ Free plan</span>
      </section>

      <SettingsSectionHeader title="Account" text="Your personal details and how we reach you." />
      <form className="settingsForm" onSubmit={(e) => e.preventDefault()}>
        <SettingsField label="Full name">
          <input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} disabled={!loaded} />
        </SettingsField>
        <SettingsField label="Email">
          <input value={form.email} readOnly />
        </SettingsField>
        <SettingsField label="Phone">
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 " disabled={!loaded} />
        </SettingsField>
        <SettingsField label="City">
          <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Your city" disabled={!loaded} />
        </SettingsField>
        <SettingsField label="Target exam" wide>
          <input value={form.target_exam} onChange={(e) => set("target_exam", e.target.value)} placeholder="CAT / GMAT / GRE" disabled={!loaded} />
        </SettingsField>
        <SettingsField label="About" wide>
          <textarea value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="A short note about your prep goals." disabled={!loaded} />
        </SettingsField>
        <div className="settingsActions">
          <button className="button primary" type="button" onClick={save} disabled={saving || !loaded}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            className="button ghost"
            type="button"
            onClick={() => authApi.getProfile().then(setForm).catch(() => {})}
            disabled={saving}
          >
            Cancel
          </button>
          {status ? (
            <span className={status.kind === "ok" ? "savedIndicator" : "settingsError"}>{status.msg}</span>
          ) : null}
        </div>
      </form>
    </AccountSettingsShell>
  );
}
