"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import { UserProvider } from "@/components/UserContext";
import { CartProvider } from "@/components/CartContext";
import AuthGuard from "@/components/AuthGuard";
import GlobalAuthModal from "@/components/GlobalAuthModal";
import TrialModal from "@/components/TrialModal";
import { warmup } from "@/lib/api";

export default function Providers({ children }: { children: ReactNode }) {
  // Wake a possibly-cold backend as early as the app mounts (before the user navigates).
  useEffect(() => {
    warmup();
  }, []);
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <AuthGuard />
          {children}
          <GlobalAuthModal />
          <TrialModal />
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
