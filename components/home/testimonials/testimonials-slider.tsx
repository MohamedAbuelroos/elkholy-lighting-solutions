"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type TestimonialsSliderProps = {
  children: ReactNode;
};

export function TestimonialsSlider({ children }: TestimonialsSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();

  const [edges, setEdges] = useState({
    atStart: true,
    atEnd: true,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateEdges() {
      if (!track) return;

      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

      const position = Math.max(0, -track.scrollLeft);

      const atStart = position <= 2;
      const atEnd = position >= maxScroll - 2;

      setEdges((previous) =>
        previous.atStart === atStart && previous.atEnd === atEnd
          ? previous
          : { atStart, atEnd },
      );
    }

    const frame = requestAnimationFrame(updateEdges);
    const observer = new ResizeObserver(updateEdges);

    observer.observe(track);

    for (const card of Array.from(track.children)) {
      observer.observe(card);
    }

    track.addEventListener("scroll", updateEdges, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      track.removeEventListener("scroll", updateEdges);
    };
  }, [children]);

  function move(direction: "next" | "previous") {
    const track = trackRef.current;
    const card = track?.firstElementChild;

    if (!track || !card) return;

    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;

    const step = card.getBoundingClientRect().width + gap;

    track.scrollBy({
      left: direction === "next" ? -step : step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  const arrowClassName =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-surface text-primary shadow-lg transition-colors enabled:hover:border-primary enabled:hover:bg-primary enabled:hover:text-on-primary disabled:cursor-default disabled:opacity-30 disabled:shadow-none sm:size-14";
  return (
    <div className="relative px-6 sm:px-8">
      <button
        type="button"
        onClick={() => move("previous")}
        disabled={edges.atStart}
        aria-label="الآراء السابقة"
        aria-controls={trackId}
        className={`${arrowClassName} right-0`}
      >
        <FaArrowRight aria-hidden="true" className="size-5 sm:size-6" />
      </button>

      <div
        ref={trackRef}
        id={trackId}
        dir="rtl"
        role="region"
        aria-label="آراء العملاء، اسحب لاستعراض المزيد"
        tabIndex={0}
        className="testimonials-track flex snap-x snap-proximity items-stretch gap-4 overflow-x-auto px-1 py-2"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => move("next")}
        disabled={edges.atEnd}
        aria-label="الآراء التالية"
        aria-controls={trackId}
        className={`${arrowClassName} left-0`}
      >
        <FaArrowLeft aria-hidden="true" className="size-5 sm:size-6" />
      </button>
    </div>
  );
}
