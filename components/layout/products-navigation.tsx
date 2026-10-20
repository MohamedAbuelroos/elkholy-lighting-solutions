"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa6";

import { categories } from "@/data/categories";
import { getCategoryPath, routes } from "@/config/routes";

type ProductsNavigationProps = {
  mobile?: boolean;
};

const rootCategories = categories
  .filter((category) => category.is_active && category.parent_id === null)
  .sort((first, second) => first.sort_order - second.sort_order);

export function ProductsNavigation({
  mobile = false,
}: ProductsNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

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

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
        className={
          mobile
            ? "flex min-h-12 w-full items-center justify-between rounded-control px-4 py-3 text-base text-foreground hover:bg-surface-elevated"
            : "navbar-link flex items-center gap-2 py-3 text-sm font-medium"
        }
      >
        المنتجات
        <FaChevronDown
          aria-hidden="true"
          className={`size-2.5 transition-transform duration-200 motion-reduce:transition-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        id={panelId}
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={`grid transition-[grid-template-rows,opacity,transform,visibility] duration-200 motion-reduce:transition-none ${
          mobile
            ? ""
            : "absolute start-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-surface shadow-xl"
        } ${
          isOpen
            ? "visible grid-rows-[1fr] translate-y-0 opacity-100"
            : "pointer-events-none invisible grid-rows-[0fr] -translate-y-1 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="space-y-1 p-2">
            <li>
              <Link
                href={routes.products}
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                جميع المنتجات
                <FaArrowLeft aria-hidden="true" className="size-3" />
              </Link>
            </li>

            {rootCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={getCategoryPath(category.slug)}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm leading-6 text-foreground transition-colors hover:bg-surface-elevated hover:text-primary"
                >
                  {category.name_ar}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
