"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaChevronDown } from "react-icons/fa6";

import type { CatalogSort as CatalogSortValue } from "@/lib/queries/products";

type CatalogSortProps = {
  value: CatalogSortValue;
};

const options: {
  value: CatalogSortValue;
  label: string;
}[] = [
  { value: "default", label: "الترتيب الافتراضي" },
  { value: "price-asc", label: "السعر: الأقل أولًا" },
  { value: "price-desc", label: "السعر: الأعلى أولًا" },
];

export function CatalogSort({ value }: CatalogSortProps) {
  const router = useRouter();
  const panelId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function changeSort(nextValue: CatalogSortValue) {
    setIsOpen(false);
    triggerRef.current?.focus();

    if (nextValue === value) return;

    const params = new URLSearchParams(window.location.search);

    if (nextValue === "default") {
      params.delete("sort");
    } else {
      params.set("sort", nextValue);
    }

    params.delete("page");

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `/products?${query}` : "/products", {
        scroll: false,
      });
    });
  }

  return (
    <div className="flex items-center gap-3" aria-busy={isPending}>
      <span className="shrink-0 text-xs text-muted">ترتيب حسب</span>

      <div
        ref={containerRef}
        className="relative min-w-0 flex-1 sm:min-w-48"
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          disabled={isPending}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={`ترتيب المنتجات: ${selected.label}`}
          onClick={() => setIsOpen((previous) => !previous)}
          className={`flex min-h-11 w-full items-center justify-between gap-4 rounded-control border bg-surface px-3 py-2 text-xs text-foreground transition-colors disabled:opacity-60 ${
            isOpen ? "border-primary" : "border-border hover:border-primary/50"
          }`}
        >
          <span>{selected.label}</span>

          <FaChevronDown
            aria-hidden="true"
            className={`size-3 shrink-0 text-primary transition-transform duration-200 motion-reduce:transition-none ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          id={panelId}
          inert={!isOpen}
          aria-hidden={!isOpen}
          className={`absolute inset-x-0 top-full z-30 mt-2 origin-top rounded-xl border border-border bg-surface p-1.5 shadow-xl transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none ${
            isOpen
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          <ul aria-label="خيارات ترتيب المنتجات" className="space-y-1">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => changeSort(option.value)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-xs transition-colors ${
                      isSelected
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    {option.label}

                    {isSelected && (
                      <FaCheck aria-hidden="true" className="size-3 shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <span role="status" className="sr-only">
        {isPending ? "جارٍ ترتيب المنتجات" : ""}
      </span>
    </div>
  );
}
