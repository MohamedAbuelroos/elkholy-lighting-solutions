"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";
import MobileMenu from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { usePathname } from "next/navigation";

const availableNavigation = [
  { label: "الرئيسية", href: routes.home },
  { label: "وسائل التواصل", href: routes.links },
] as const;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });

  return () => {
    window.removeEventListener("scroll", onChange);
  };
}

function getScrollSnapshot() {
  return window.scrollY > 24;
}

function getServerScrollSnapshot() {
  return false;
}

export function Navbar() {
  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );
  const pathname = usePathname();
  const showBackground = pathname !== routes.home || isScrolled;

  const contactHref = getPrimaryWhatsAppHref();

  return (
    <header
      data-scrolled={showBackground}
      className="site-navbar fixed inset-x-0 top-0 z-40"
    >
      <div className="site-container relative flex h-20 items-center justify-between gap-3 lg:h-22">
        <Link
          href={routes.home}
          aria-label={`${siteConfig.nameAr} — الرئيسية`}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <Image
            src={siteConfig.logo.src}
            alt="Elkholy Logo"
            width={74}
            height={74}
            className="size-16 shrink-0 rounded-control object-contain sm:size-18"
          />

          <div dir="ltr" className="min-w-0 text-start">
            <span className="navbar-brand block text-sm font-semibold tracking-[0.18em] sm:text-lg">
              ELKHOLY
            </span>

            <span className="navbar-subtitle mt-1 block text-[8px] tracking-[0.1em] sm:text-[10px]">
              LIGHTING SOLUTIONS
            </span>
          </div>
        </Link>

        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-8 lg:flex"
        >
          {availableNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="navbar-link py-3 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-control hidden min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors lg:inline-flex"
          >
            <FaWhatsapp aria-hidden="true" className="size-5" />
            تواصل معنا
          </a>

          <ThemeToggle />

          <MobileMenu items={availableNavigation} contactHref={contactHref} />
        </div>
      </div>
    </header>
  );
}
