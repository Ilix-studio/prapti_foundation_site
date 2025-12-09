// frontend/hooks/useRecaptchaV2.ts
import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          size?: "normal" | "compact";
        }
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      ready: (callback: () => void) => void;
    };
  }
}

export const useRecaptchaV2 = () => {
  const widgetIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const renderAttemptsRef = useRef(0);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      scriptLoadedRef.current = true;
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const render = useCallback(
    (
      callback?: (token: string) => void,
      expiredCallback?: () => void,
      errorCallback?: () => void
    ) => {
      if (widgetIdRef.current !== null) return; // Already rendered
      if (!containerRef.current) return;

      const attemptRender = () => {
        if (!window.grecaptcha || !window.grecaptcha.render) {
          renderAttemptsRef.current++;
          if (renderAttemptsRef.current < 20) {
            setTimeout(attemptRender, 200);
          }
          return;
        }

        try {
          widgetIdRef.current = window.grecaptcha.render(
            containerRef.current!,
            {
              sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY_V2 || "",
              callback,
              "expired-callback": expiredCallback,
              "error-callback": errorCallback,
              size: "normal",
            }
          );
        } catch (error) {
          console.error("reCAPTCHA render error:", error);
        }
      };

      attemptRender();
    },
    []
  );

  const reset = useCallback(() => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  }, []);

  const getToken = useCallback((): string | null => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      return window.grecaptcha.getResponse(widgetIdRef.current) || null;
    }
    return null;
  }, []);

  return { containerRef, render, reset, getToken };
};
