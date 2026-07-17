"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";

// Areas that require a signed-in session. Everything else (home, pricing,
// explore courses, cart, contact) stays public.
const PROTECTED_PREFIXES = ["/dashboard", "/learn", "/mocks", "/account", "/notifications"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function AuthGuard() {
  const { authed, hydrated, openAuth } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (isProtected(pathname) && !authed) {
      // replace() so the protected URL is removed from history — the back button
      // after logout lands on a public page, not the cached authed screen.
      router.replace("/");
      // Prompt sign-in so a bounced learner sees the login modal, not a silent redirect.
      openAuth("login");
    }
  }, [authed, hydrated, pathname, router, openAuth]);

  return null;
}
