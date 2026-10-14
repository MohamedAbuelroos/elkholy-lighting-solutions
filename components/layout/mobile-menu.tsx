"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";

type NavigationItem = {
  readonly label: string;
  readonly href: string;
};

type MobileMenuProps = {
  items: readonly NavigationItem[];
  contactHref: string;
};

function MobileMenu({ items, contactHref }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    function handleBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((previous) => !previous)}
        className="navbar-control flex size-11 items-center justify-center rounded-full border transition-colors"
      >
        {isOpen ? (
          <FaXmark aria-hidden="true" className="size-5" />
        ) : (
          <FaBars aria-hidden="true" className="size-4" />
        )}
      </button>

      <nav
        id="mobile-navigation"
        aria-label="التنقل على الموبايل"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-border bg-surface text-foreground shadow-xl ${
          isOpen ? "mobile-navigation-open" : "mobile-navigation-closed"
        }`}
      >
        <div className="site-container py-5">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-control px-4 py-3 text-base text-foreground transition-colors hover:bg-surface-elevated hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <a
            href={contactHref}
            onClick={() => setIsOpen(false)}
            className="mt-4 flex min-h-12 items-center justify-center rounded-control bg-primary px-5 font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            تحدث مع فريق الخولي
          </a>
        </div>
      </nav>
    </div>
  );
}

export default MobileMenu;
