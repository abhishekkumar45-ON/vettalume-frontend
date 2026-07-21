"use client";

import { Moon, Sun } from "lucide-react";
import AccountSettingsShell, {
  SettingsSectionHeader
} from "@/components/AccountSettingsShell";
import { useTheme, type Theme } from "@/components/ThemeContext";

const OPTIONS: { value: Theme; label: string; hint: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light Mode", hint: "Bright, default theme.", icon: Sun },
  { value: "dark", label: "Dark Mode", hint: "Easier on the eyes in low light.", icon: Moon }
];

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();

  return (
    <AccountSettingsShell active="appearance">
      <SettingsSectionHeader title="Appearance" text="Switch between Light and Dark mode. Light is the default." />
      <div className="themeChoice" role="radiogroup" aria-label="Theme">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const on = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={on}
              className={`themeOption${on ? " on" : ""}`}
              onClick={() => setTheme(opt.value)}
            >
              <span className="themeOptionIcon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <span className="themeOptionText">
                <b>{opt.label}</b>
                <span>{opt.hint}</span>
              </span>
              <span className="themeOptionRadio" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </AccountSettingsShell>
  );
}
