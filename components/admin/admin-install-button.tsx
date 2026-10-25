"use client";

import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export function AdminInstallButton() {
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(
    null,
  );

  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");

    const iosStandalone =
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    const timer = window.setTimeout(() => {
      setInstalled(displayMode.matches || iosStandalone);
    }, 0);

    function handlePrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as InstallPromptEvent);
      setInstructions("");
    }

    function handleInstalled() {
      setInstalled(true);
      setInstallEvent(null);
      setInstructions("");
    }

    function handleDisplayMode(event: MediaQueryListEvent) {
      setInstalled(event.matches || iosStandalone);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    displayMode.addEventListener("change", handleDisplayMode);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("beforeinstallprompt", handlePrompt);

      window.removeEventListener("appinstalled", handleInstalled);

      displayMode.removeEventListener("change", handleDisplayMode);
    };
  }, []);

  async function install() {
    if (installing) return;

    if (!installEvent) {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

      setInstructions(
        isIOS
          ? "افتح لوحة الإدارة في Safari، ثم المشاركة ← إضافة إلى الشاشة الرئيسية. سمّها «إدارة الخولي»."
          : "افتح لوحة الإدارة مباشرة في Chrome أو Edge، ثم من قائمة المتصفح اختار «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» إذا كان متاحًا. تأكد إن الاسم الظاهر هو «إدارة الخولي».",
      );

      return;
    }

    setInstalling(true);

    try {
      await installEvent.prompt();

      const choice = await installEvent.userChoice;

      setInstallEvent(null);

      if (choice.outcome === "accepted") {
        setInstructions("");
        setInstalled(true);
      }
    } catch {
      setInstallEvent(null);
      setInstructions(
        "تعذّر فتح نافذة التثبيت. جرّب من قائمة المتصفح، أو أعد تحميل صفحة الإدارة وحاول مرة أخرى.",
      );
    } finally {
      setInstalling(false);
    }
  }

  if (installed) return null;

  return (
    <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-medium leading-6">الإدارة من موبايلك</p>

      <p className="mt-1 text-[11px] leading-6 text-muted">
        أضف اختصارًا للوحة الإدارة للوصول إليها بسهولة.
      </p>

      <button
        type="button"
        onClick={install}
        disabled={installing}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
      >
        <FaDownload aria-hidden="true" className="size-3" />

        {installing ? "جارٍ فتح التثبيت..." : "إضافة الإدارة لجهازك"}
      </button>

      {instructions && (
        <p
          role="status"
          className="mt-3 border-t border-border pt-3 text-[11px] leading-7 text-muted"
        >
          {instructions}
        </p>
      )}
    </div>
  );
}
