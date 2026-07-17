"use client";

import AuthModal from "@/components/AuthModal";
import { useUser } from "@/components/UserContext";

// A single app-wide auth modal driven by UserContext, so any component
// (footer links, AuthGuard, header) can prompt login via openAuth().
export default function GlobalAuthModal() {
  const { authModalMode, setAuthModalMode, closeAuth, signIn } = useUser();
  return (
    <AuthModal
      mode={authModalMode}
      onClose={closeAuth}
      onModeChange={setAuthModalMode}
      onSignIn={signIn}
    />
  );
}
