"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FaChevronLeft, FaXmark } from "react-icons/fa6";

import type { ContactGroup } from "@/components/links/contact-data";

type ContactSheetProps = {
  group: ContactGroup;
  onClose: () => void;
};

export function ContactSheet({ group, onClose }: ContactSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);
  const titleId = useId();

  const Icon = group.icon;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function requestClose() {
    if (closingRef.current) return;

    closingRef.current = true;
    setClosing(true);

    const duration = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : 200;

    timerRef.current = setTimeout(onClose, duration);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      data-closing={closing}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const rect = event.currentTarget.getBoundingClientRect();

        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          requestClose();
        }
      }}
      className="contact-sheet fixed inset-x-0 bottom-0 top-auto m-0 mx-auto max-h-[85dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-border bg-surface p-0 text-foreground shadow-2xl"
    >
      <div className="flex justify-center pt-3" aria-hidden="true">
        <span className="h-1 w-10 rounded-full bg-border" />
      </div>

      <div className="flex items-start justify-between gap-4 border-b border-border px-5 pb-5 pt-4">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-primary">ELKHOLY</p>

          <h2 id={titleId} className="mt-2 text-xl font-semibold">
            {group.title}
          </h2>

          <p className="mt-2 text-xs leading-6 text-muted">
            اختر الحساب أو جهة التواصل المناسبة
          </p>
        </div>

        <button
          type="button"
          autoFocus
          onClick={requestClose}
          aria-label="إغلاق"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
        >
          <FaXmark aria-hidden="true" className="size-4" />
        </button>
      </div>

      <ul className="space-y-3 px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {group.entries.map((entry, index) => (
          <li key={`${entry.href}-${index}`}>
            <a
              href={entry.href}
              target={group.external ? "_blank" : undefined}
              rel={group.external ? "noopener noreferrer" : undefined}
              className="flex min-h-24 items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>

                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold">
                    {entry.name}
                  </h3>

                  <p className="mt-1 text-xs text-muted">{entry.label}</p>

                  {entry.number && (
                    <p
                      dir="ltr"
                      className="mt-1 text-start text-xs tabular-nums text-muted"
                    >
                      {entry.number}
                    </p>
                  )}

                  {group.external && (
                    <span className="sr-only">يفتح في تبويب جديد</span>
                  )}
                </div>
              </div>

              <FaChevronLeft
                aria-hidden="true"
                className="size-3 shrink-0 text-primary"
              />
            </a>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
