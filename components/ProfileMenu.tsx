"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Moon, Settings, Sun, UserRound } from "lucide-react";
import { useUser } from "@/components/UserContext";
import { useTheme } from "@/components/ThemeContext";

export default function ProfileMenu() {
  const { authed, openAuth, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleAuth() {
    setOpen(false);
    if (authed) {
      logout();
      router.replace("/");
    } else {
      openAuth("login");
    }
  }

  function handleSettings() {
    setOpen(false);
    if (authed) router.push("/account");
    else openAuth("login");
  }

  const isDark = theme === "dark";

  return (
    <div className="profileMenu" ref={rootRef}>
      <button
        type="button"
        className="iconButton"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <UserRound size={24} aria-hidden="true" />
      </button>
      {open ? (
        <div className="profileMenuList" role="menu" aria-label="Account menu">
          <button type="button" role="menuitem" className="profileMenuItem" onClick={handleAuth}>
            {authed ? <LogOut size={17} aria-hidden="true" /> : <LogIn size={17} aria-hidden="true" />}
            <span>{authed ? "Logout" : "Login"}</span>
          </button>
          <button type="button" role="menuitem" className="profileMenuItem" onClick={handleSettings}>
            <Settings size={17} aria-hidden="true" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={isDark}
            className="profileMenuItem"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
