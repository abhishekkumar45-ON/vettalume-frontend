"use client";

import { useEffect, useRef } from "react";
import { authApi, type AuthSession } from "@/lib/api";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const GSI_SRC = "https://accounts.google.com/gsi/client";

type GoogleCredentialResponse = { credential: string };
type GoogleIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdApi } };
  }
}

export default function GoogleSignInButton({
  onSuccess,
  onError
}: {
  onSuccess: (session: AuthSession) => void;
  onError?: (message: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    function init() {
      const idApi = window.google?.accounts?.id;
      if (cancelled || !idApi || !hostRef.current) return;
      idApi.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          try {
            const session = await authApi.google({
              id_token: response.credential,
              accept_terms: true
            });
            onSuccess(session);
          } catch (err) {
            onError?.(err instanceof Error ? err.message : "Google sign-in failed.");
          }
        }
      });
      hostRef.current.innerHTML = "";
      idApi.renderButton(hostRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 320
      });
    }

    if (window.google?.accounts?.id) {
      init();
      return () => {
        cancelled = true;
      };
    }

    let script = document.getElementById("gsi-client") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "gsi-client";
      script.src = GSI_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", init);
    return () => {
      cancelled = true;
      script?.removeEventListener("load", init);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Not configured yet — keep the styled button but explain on click.
  if (!CLIENT_ID) {
    return (
      <button
        className="googleButton"
        type="button"
        onClick={() => onError?.("Google sign-in isn't configured yet (missing NEXT_PUBLIC_GOOGLE_CLIENT_ID).")}
      >
        <span>G</span>
        Continue with Google
      </button>
    );
  }

  return <div className="googleBtnHost" ref={hostRef} />;
}
