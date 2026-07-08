"use client";

import type { ReactNode } from "react";
import { UserProvider } from "@/components/UserContext";
import AuthGuard from "@/components/AuthGuard";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <AuthGuard />
      {children}
    </UserProvider>
  );
}
