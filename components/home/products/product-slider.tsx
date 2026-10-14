"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

type ProductSliderProps = {
  children: ReactNode;
};

export function ProductSlider({ children }: ProductSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number | null>(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const touchingRef = useRef(false);

  const [edges, setEdges] = useState({
    atStart: true,
    atEnd: true,
  });

  const stopAnimation = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    trackRef.current?.style.removeProperty("scroll-snap-type");
  }, []);

  const move = useCallback((direction: "next" | "previous", loop = false) => {
    const track = trackRef.current;
    if (!track || animationRef.current !== null) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

    if (maxScroll <= 1) return;

    const position = Math.min(maxScroll, Math.max(0, -track.scrollLeft));

    const card = track.firstElementChild;
    if (!card) return;

    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;

    const step = card.getBoundingClientRect().width + gap;

    let destination =
      direction === "next"
        ? Math.min(position + step, maxScroll)
        : Math.max(position - step, 0);

    // Autoplay returns to the beginning after the final view.
    if (loop && direction === "next" && position >= maxScroll - 2) {
      destination = 0;
    }

    if (Math.abs(destination - position) < 1) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = -destination;
      return;
    }

    track.style.scrollSnapType = "none";

    const start = track.scrollLeft;
    const target = -destination;
    const duration = 450;
    const startedAt = performance.now();

    function animate(now: number) {
      if (!track) return;

      const progress = Math.min((now - startedAt) / duration, 1);

      // Gentle acceleration and deceleration.
      const eased = (1 - Math.cos(Math.PI * progress)) / 2;

      track.scrollLeft = start + (target - start) * eased;

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        track.style.removeProperty("scroll-snap-type");
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function updateEdges() {
      if (!track) return;

      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

      const position = Math.max(0, -track.scrollLeft);

      const atStart = position <= 2;
      const atEnd = maxScroll <= 2 || position >= maxScroll - 2;

      setEdges((previous) =>
        previous.atStart === atStart && previous.atEnd === atEnd
          ? previous
          : { atStart, atEnd },
      );
    }

    const initialFrame = requestAnimationFrame(updateEdges);
    const resizeObserver = new ResizeObserver(updateEdges);

    resizeObserver.observe(track);

    for (const card of Array.from(track.children)) {
      resizeObserver.observe(card);
    }

    track.addEventListener("scroll", updateEdges, { passive: true });

    const timer = window.setInterval(() => {
      if (
        document.hidden ||
        hoveredRef.current ||
        focusedRef.current ||
        touchingRef.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      move("next", true);
    }, 4000);

    return () => {
      cancelAnimationFrame(initialFrame);
      clearInterval(timer);
      resizeObserver.disconnect();
      track.removeEventListener("scroll", updateEdges);
      stopAnimation();
    };
  }, [children, move, stopAnimation]);

  const arrowClassName =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-surface text-primary shadow-lg transition-colors enabled:hover:bg-primary enabled:hover:text-on-primary disabled:cursor-default disabled:opacity-30 disabled:shadow-none sm:size-14";

  return (
    <div
      ref={containerRef}
      className="relative px-6 sm:px-8"
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      onFocusCapture={() => {
        focusedRef.current = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          focusedRef.current = false;
        }
      }}
      onTouchStart={() => {
        touchingRef.current = true;
        stopAnimation();
      }}
      onTouchEnd={() => {
        touchingRef.current = false;
      }}
      onTouchCancel={() => {
        touchingRef.current = false;
      }}
    >
      <button
        type="button"
        onClick={() => move("previous")}
        disabled={edges.atStart}
        aria-label="المنتجات السابقة"
        aria-controls="featured-products-track"
        className={`${arrowClassName} right-0`}
      >
        <FaArrowRight aria-hidden="true" className="size-5 sm:size-6" />
      </button>

      <div
        ref={trackRef}
        id="featured-products-track"
        dir="rtl"
        role="region"
        aria-label="منتجات مختارة"
        aria-roledescription="عارض منتجات"
        tabIndex={0}
        onWheel={stopAnimation}
        onPointerDown={stopAnimation}
        onKeyDown={stopAnimation}
        className="product-slider flex snap-x snap-proximity gap-4 overflow-x-auto px-1 py-2"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => move("next")}
        disabled={edges.atEnd}
        aria-label="المنتجات التالية"
        aria-controls="featured-products-track"
        className={`${arrowClassName} left-0`}
      >
        <FaArrowLeft aria-hidden="true" className="size-5 sm:size-6" />
      </button>
    </div>
  );
}
