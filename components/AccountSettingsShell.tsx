"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CreditCard,
  ListChecks,
  LockKeyhole,
  LogOut,
  Shield,
  UserRound
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useUser } from "@/components/UserContext";

type AccountSettingsShellProps = {
  active: "account" | "security" | "subscription" | "preferences" | "notifications" | "privacy";
  children: React.ReactNode;
};

const settingsLinks = [
  { key: "account", href: "/account", label: "Account", icon: UserRound },
  { key: "security", href: "/account/security", label: "Security", icon: LockKeyhole },
  { key: "subscription", href: "/account/subscription", label: "Subscription", icon: CreditCard },
  { key: "preferences", href: "/account/preferences", label: "Exam Preferences", icon: ListChecks },
  { key: "notifications", href: "/notifications", label: "Notifications", icon: Bell },
  { key: "privacy", href: "/account/privacy-data", label: "Privacy & Data", icon: Shield }
] as const;

export default function AccountSettingsShell({ active, children }: AccountSettingsShellProps) {
  const { logout } = useUser();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/");
  }

  return (
    <>
      <SiteHeader />
      <main className="settingsPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Account &amp; Settings</h1>
            <p>Manage your account, plan, exam preferences and notifications.</p>
          </div>
        </section>
        <section className="settingsBody">
          <aside className="settingsSidebar" aria-label="Account settings">
            {settingsLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  className={active === item.key ? "active" : ""}
                  href={item.href}
                  key={item.key}
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                  {index === 2 ? <span className="settingsRule" aria-hidden="true" /> : null}
                </Link>
              );
            })}
            <button className="logoutLink" type="button" onClick={handleLogout}>
              <LogOut size={18} aria-hidden="true" />
              Log out
            </button>
          </aside>
          <div className="settingsContent">{children}</div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function SavedIndicator() {
  return <span className="savedIndicator">Saved</span>;
}

export function SettingsSectionHeader({ title, text }: { title: string; text: string }) {
  return (
    <div className="settingsSectionHeader">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export function SettingsField({
  label,
  children,
  wide = false
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "settingsField wide" : "settingsField"}>
      <span>{label}</span>
      {children}
    </label>
  );
}
