"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaChevronDown } from "react-icons/fa6";

type CatalogSubcategoryProps = {
  items: {
    slug: string;
    name: string;
  }[];
  value: string;
};

export function CatalogSubcategory({ items, value }: CatalogSubcategoryProps) {
  const router = useRouter();
  const panelId = useId();

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const options = [{ slug: "", name: "جميع الأنواع" }, ...items];

  const selected = options.find((option) => option.slug === value);
  const selectedLabel = selected?.name ?? "اختر نوع المنتج";

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

  function selectSubcategory(slug: string) {
    setIsOpen(false);
    triggerRef.current?.focus();

    if (slug === value) return;

    const params = new URLSearchParams(window.location.search);

    if (slug) {
      params.set("subcategory", slug);
    } else {
      params.delete("subcategory");
    }

    params.delete("page");

    startTransition(() => {
      router.replace(`/products?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  return (
    <div className="flex items-center gap-3" aria-busy={isPending}>
      <span className="shrink-0 text-xs text-muted">نوع المنتج</span>

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
          aria-label={`نوع المنتج: ${selectedLabel}`}
          onClick={() => setIsOpen((previous) => !previous)}
          className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-control border bg-surface px-3 py-2 text-xs text-foreground transition-colors disabled:opacity-60 ${
            isOpen ? "border-primary" : "border-border hover:border-primary/50"
          }`}
        >
          <span className="truncate">{selectedLabel}</span>

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
          className={`absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-border bg-surface p-1.5 shadow-xl transition-[opacity,transform,visibility] duration-200 motion-reduce:transition-none ${
            isOpen
              ? "visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          <ul
            aria-label="أنواع المنتجات"
            className="max-h-64 space-y-1 overflow-y-auto"
          >
            {options.map((option) => (
              <li key={option.slug}>
                <button
                  type="button"
                  aria-pressed={value === option.slug}
                  onClick={() => selectSubcategory(option.slug)}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-xs transition-colors ${
                    value === option.slug
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground hover:bg-surface-elevated"
                  }`}
                >
                  {option.name}

                  {value === option.slug && (
                    <FaCheck aria-hidden="true" className="size-3 shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <span role="status" className="sr-only">
        {isPending ? "جارٍ تحديث المنتجات" : ""}
      </span>
    </div>
  );
}
