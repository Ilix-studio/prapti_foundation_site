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
    };
  }
}

export const useRecaptchaV2 = () => {
  const widgetIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    scriptLoadedRef.current = true;

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
      if (!containerRef.current || !window.grecaptcha) return;

      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY_V2 || "",
        callback,
        "expired-callback": expiredCallback,
        "error-callback": errorCallback,
        size: "normal",
      });
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
