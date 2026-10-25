"use client";

import { useEffect, useState } from "react";
import { FaDownload, FaXmark } from "react-icons/fa6";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const DISMISSED_KEY = "elkholy-install-dismissed";

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(
    null,
  );

  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");

    const iosStandalone =
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    // Read browser-only settings after hydration.
    const timer = window.setTimeout(() => {
      setInstalled(displayMode.matches || iosStandalone);

      setIsIOS(
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
      );

      try {
        setDismissed(sessionStorage.getItem(DISMISSED_KEY) === "1");
      } catch {
        // Installation remains usable if browser storage is blocked.
      }
    }, 0);

    function handleInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setInstallEvent(null);
    }

    function handleDisplayModeChange(event: MediaQueryListEvent) {
      setInstalled(event.matches || iosStandalone);
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    window.addEventListener("appinstalled", handleInstalled);

    displayMode.addEventListener("change", handleDisplayModeChange);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);

      window.removeEventListener("appinstalled", handleInstalled);

      displayMode.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  function dismiss() {
    setDismissed(true);

    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // The close button still works without storage.
    }
  }

  async function install() {
    if (!installEvent || installing) return;

    setInstalling(true);
    setError("");

    try {
      await installEvent.prompt();

      const choice = await installEvent.userChoice;

      setInstallEvent(null);

      if (choice.outcome === "accepted") {
        setDismissed(true);
      }
    } catch {
      setInstallEvent(null);
      setError("يمكنك تثبيت الموقع من قائمة المتصفح إذا كان الخيار متاحًا.");
    } finally {
      setInstalling(false);
    }
  }

  if (installed || dismissed || (!installEvent && !isIOS && !error)) {
    return null;
  }

  return (
    <aside
      aria-labelledby="install-prompt-title"
      className="fixed inset-x-4 bottom-[calc(6rem_+_env(safe-area-inset-bottom))] z-30 mx-auto max-w-sm rounded-2xl border border-primary/30 bg-surface p-4 text-foreground shadow-xl sm:inset-x-auto sm:end-6 sm:bottom-6 sm:w-80"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            id="install-prompt-title"
            className="text-sm font-medium leading-7"
          >
            الخولي، أقرب لك.
          </p>

          <p className="mt-1 text-[11px] leading-6 text-muted">
            أضف الموقع لشاشة جهازك وارجع لاختياراتك بسهولة.
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="إغلاق اقتراح تثبيت الموقع"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <FaXmark aria-hidden="true" className="size-3" />
        </button>
      </div>

      {installEvent ? (
        <button
          type="button"
          onClick={install}
          disabled={installing}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
        >
          <FaDownload aria-hidden="true" className="size-3" />

          {installing ? "جارٍ فتح التثبيت..." : "إضافة إلى جهازك"}
        </button>
      ) : isIOS ? (
        <p className="mt-3 border-t border-border pt-3 text-[11px] leading-7 text-muted">
          من Safari، افتح قائمة المشاركة، ثم اختار
          <span className="font-medium text-primary">
            {" "}
            إضافة إلى الشاشة الرئيسية
          </span>
          .
        </p>
      ) : null}

      {error && (
        <p role="status" className="mt-3 text-[11px] leading-7 text-muted">
          {error}
        </p>
      )}
    </aside>
  );
}
