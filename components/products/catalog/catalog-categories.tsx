"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaHouse,
  FaLayerGroup,
  FaLightbulb,
  FaLock,
  FaPlug,
  FaVolumeHigh,
} from "react-icons/fa6";

import { NavigationHint } from "@/components/ui/navigation-hint";
import { getCategoryPath, routes } from "@/config/routes";
import type { Category } from "@/types/category";

type CatalogCategoriesProps = {
  categories: Category[];
  selectedSlug?: string;
  categoryCounts: Record<string, number>;
  totalProducts: number;
};

const categoryIcons: Record<string, IconType> = {
  lighting: FaLightbulb,
  electrical: FaPlug,
  "smart-home": FaHouse,
  "sound-systems": FaVolumeHigh,
  "smart-locks": FaLock,
};

const countFormatter = new Intl.NumberFormat("ar-EG");

const arrowClassName =
  "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors duration-200 hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-default disabled:opacity-30 disabled:hover:border-border disabled:hover:bg-surface disabled:hover:text-foreground motion-reduce:transition-none sm:size-11";

export function CatalogCategories({
  categories,
  selectedSlug,
  categoryCounts,
  totalProducts,
}: CatalogCategoriesProps) {
  const sliderId = useId();
  const sliderRef = useRef<HTMLUListElement>(null);

  const [navigation, setNavigation] = useState({
    canPrevious: false,
    canNext: false,
  });

  const items = [
    {
      id: "all",
      slug: "",
      name: "جميع المنتجات",
      icon: FaLayerGroup,
      count: totalProducts,
    },
    ...categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name_ar,
      icon: categoryIcons[category.slug] ?? FaLayerGroup,
      count: categoryCounts[category.id] ?? 0,
    })),
  ];

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    let frameId = 0;

    function updateNavigation() {
      if (!slider) return;

      const first = slider.firstElementChild;
      const last = slider.lastElementChild;

      if (!first || !last) return;

      const viewport = slider.getBoundingClientRect();

      const canPrevious =
        first.getBoundingClientRect().right > viewport.right + 2;

      const canNext = last.getBoundingClientRect().left < viewport.left - 2;

      setNavigation((previous) =>
        previous.canPrevious === canPrevious && previous.canNext === canNext
          ? previous
          : { canPrevious, canNext },
      );
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateNavigation);
    }

    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(slider);

    for (const child of slider.children) {
      observer.observe(child);
    }

    slider.addEventListener("scroll", scheduleUpdate, { passive: true });

    scheduleUpdate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      slider.removeEventListener("scroll", scheduleUpdate);
    };
  }, [categories]);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const frameId = requestAnimationFrame(() => {
      const selected = slider.querySelector<HTMLElement>(
        '[data-selected="true"]',
      );

      if (!selected) return;

      const viewport = slider.getBoundingClientRect();
      const card = selected.getBoundingClientRect();

      const rightEdge = viewport.right - 4;
      const leftEdge = viewport.left + 4;

      if (card.right > rightEdge) {
        slider.scrollBy({
          left: card.right - rightEdge,
          behavior: "instant",
        });
      } else if (card.left < leftEdge) {
        slider.scrollBy({
          left: card.left - leftEdge,
          behavior: "instant",
        });
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [selectedSlug, categories]);

  function moveSlider(direction: "previous" | "next") {
    const slider = sliderRef.current;

    if (!slider) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const distance = slider.clientWidth * 0.85;

    slider.scrollBy({
      left: direction === "next" ? -distance : distance,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }

  return (
    <nav
      aria-label="فئات المنتجات"
      className="border-b border-border bg-background py-5 sm:py-6"
    >
      <div className="site-container">
        <div
          dir="rtl"
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-4"
        >
          <button
            type="button"
            aria-label="الفئات السابقة"
            aria-controls={sliderId}
            disabled={!navigation.canPrevious}
            onClick={() => moveSlider("previous")}
            className={arrowClassName}
          >
            <FaChevronRight aria-hidden="true" className="size-3.5" />
          </button>

          <ul
            ref={sliderRef}
            id={sliderId}
            className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => {
              const selected = item.slug === (selectedSlug ?? "");
              const Icon = item.icon;

              return (
                <li
                  key={item.id}
                  data-selected={selected}
                  className="w-[min(68vw,15rem)] shrink-0 snap-start sm:w-56 xl:w-[calc((100%_-_3rem)/5)]"
                >
                  <Link
                    href={
                      item.slug ? getCategoryPath(item.slug) : routes.products
                    }
                    scroll={false}
                    aria-current={selected ? "page" : undefined}
                    title={item.name}
                    className={`group relative flex h-[104px] items-center gap-3 overflow-hidden rounded-2xl border px-3 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:px-4 ${
                      selected
                        ? "border-primary/70 bg-primary/10"
                        : "border-border bg-surface hover:border-primary/40 hover:bg-surface-elevated"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 motion-reduce:transition-none ${
                        selected
                          ? "border-primary bg-primary text-on-primary"
                          : "border-primary/15 bg-primary/5 text-primary group-hover:border-primary/30"
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex min-h-10 items-center">
                        <span
                          className={`line-clamp-2 text-xs font-medium leading-5 transition-colors sm:text-[13px] ${
                            selected
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {item.name}
                        </span>
                      </span>

                      <span className="mt-1 flex items-center gap-2 text-[11px] leading-5 text-muted">
                        <span className="tabular-nums">
                          {countFormatter.format(item.count)} منتج
                        </span>

                        {selected && (
                          <FaCheck
                            aria-hidden="true"
                            className="size-2.5 shrink-0 text-primary"
                          />
                        )}
                      </span>
                    </span>

                    <NavigationHint />
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label="الفئات التالية"
            aria-controls={sliderId}
            disabled={!navigation.canNext}
            onClick={() => moveSlider("next")}
            className={arrowClassName}
          >
            <FaChevronLeft aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
