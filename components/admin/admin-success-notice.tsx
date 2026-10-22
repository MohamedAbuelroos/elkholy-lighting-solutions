"use client";

import { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";

type AdminSuccessNoticeProps = {
  title: string;
  description?: string;
};

export function AdminSuccessNotice({
  title,
  description,
}: AdminSuccessNoticeProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);

    if (url.searchParams.has("success")) {
      url.searchParams.delete("success");

      window.history.replaceState(
        window.history.state,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    }

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-4 bottom-6 z-50 mx-auto max-w-md transition-[opacity,transform,visibility] duration-300 motion-reduce:transition-none ${
        visible
          ? "visible translate-y-0 opacity-100"
          : "invisible pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 rounded-control border border-emerald-500/25 bg-surface p-4 shadow-xl">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        >
          ✓
        </span>

        <div role="status" className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>

          {description && (
            <p className="mt-1 text-xs leading-6 text-muted">{description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="إغلاق رسالة النجاح"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <FaXmark aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}
