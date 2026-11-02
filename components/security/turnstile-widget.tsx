"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileOptions = {
  sitekey: string;
  action: string;
  theme: "auto";
  size: "compact";
  language: "ar";
  "response-field": false;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "timeout-callback": () => void;
  "error-callback": () => boolean;
};

type TurnstileAPI = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  remove: (widgetId: string) => void;
};

function getAPI(): TurnstileAPI | undefined {
  return (window as Window & { turnstile?: TurnstileAPI }).turnstile;
}

let scriptPromise: Promise<TurnstileAPI> | null = null;

function loadTurnstile(): Promise<TurnstileAPI> {
  const ready = getAPI();
  if (ready) return Promise.resolve(ready);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<TurnstileAPI>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    function failed() {
      clearTimeout(timer);
      script.remove();
      scriptPromise = null;
      reject(new Error("Turnstile script could not load."));
    }

    const timer = setTimeout(failed, 20000);

    script.onload = () => {
      const api = getAPI();
      if (!api) { failed(); return; }
      clearTimeout(timer);
      resolve(api);
    };
    script.onerror = failed;
    document.head.appendChild(script);
  });

  return scriptPromise;
}

type TurnstileWidgetProps = {
  onTokenChange: (token: string) => void;
};

export function TurnstileWidget({ onTokenChange }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [retry, setRetry] = useState(0);
  const [status, setStatus] = useState<"loading" | "waiting" | "verified" | "failed" | "expired">("loading");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let widgetId: string | undefined;

    void loadTurnstile().then((api) => {
      if (cancelled || !containerRef.current) return;
      setStatus("waiting");
      widgetId = api.render(containerRef.current, {
        sitekey: siteKey,
        action: "order-submit",
        theme: "auto",
        size: "compact",
        language: "ar",
        "response-field": false,
        callback: (token) => {
          if (cancelled) return;
          onTokenChange(token);
          setStatus("verified");
        },
        "expired-callback": () => {
          if (cancelled) return;
          onTokenChange("");
          setStatus("expired");
        },
        "timeout-callback": () => {
          if (cancelled) return;
          onTokenChange("");
          setStatus("expired");
        },
        "error-callback": () => {
          if (!cancelled) {
            onTokenChange("");
            setStatus("failed");
          }
          return true;
        },
      });
    }).catch(() => {
      if (!cancelled) {
        onTokenChange("");
        setStatus("failed");
      }
    });

    return () => {
      cancelled = true;
      if (widgetId !== undefined) {
        try { getAPI()?.remove(widgetId); } catch { /* Already removed. */ }
      }
    };
  }, [siteKey, retry, onTokenChange]);

  const message = !siteKey
    ? "التحقق غير متاح حاليًا. تواصل مع فريق الخولي."
    : status === "verified"
      ? "تم التحقق. يمكنك إرسال الطلب."
      : status === "failed"
        ? "تعذّر إكمال التحقق. راجع اتصالك وحاول مرة أخرى."
        : status === "expired"
          ? "انتهت صلاحية التحقق. أعد التحقق قبل الإرسال."
          : "أكمل التحقق قبل إرسال الطلب.";

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-background p-4">
      <p className="mb-3 text-xs font-medium text-foreground">التحقق قبل الإرسال</p>
      <div ref={containerRef} className="min-w-0" />
      <p role="status" className="mt-3 text-[11px] leading-7 text-muted">{message}</p>
      {siteKey && (status === "failed" || status === "expired") && (
        <button type="button" onClick={() => {
          onTokenChange("");
          setStatus("loading");
          setRetry((value) => value + 1);
        }} className="mt-2 min-h-10 rounded-full border border-primary/30 px-4 text-xs text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-primary">
          إعادة التحقق
        </button>
      )}
    </div>
  );
}
