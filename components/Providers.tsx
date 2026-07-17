"use client";

import type { ReactNode } from "react";
import { UserProvider } from "@/components/UserContext";
import { CartProvider } from "@/components/CartContext";
import AuthGuard from "@/components/AuthGuard";
import GlobalAuthModal from "@/components/GlobalAuthModal";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <AuthGuard />
        {children}
        <GlobalAuthModal />
      </CartProvider>
    </UserProvider>
  );
}
