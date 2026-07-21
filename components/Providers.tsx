"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/ThemeContext";
import { UserProvider } from "@/components/UserContext";
import { CartProvider } from "@/components/CartContext";
import AuthGuard from "@/components/AuthGuard";
import GlobalAuthModal from "@/components/GlobalAuthModal";
import TrialModal from "@/components/TrialModal";

export default function Providers({ children }: { children: ReactNode }) {
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
