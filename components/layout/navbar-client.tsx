"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { DesktopNavigation } from "@/components/layout/desktop-navigation";
import { FavoritesLink } from "@/components/layout/favorites-link";
import MobileMenu from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NavigationHint } from "@/components/ui/navigation-hint";

import { mainNavigation, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

import type { Category } from "@/types/category";

import styles from "./navbar-polish.module.css";

type NavbarClientProps = {
  categories: Category[];
};

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

export function NavbarClient({ categories }: NavbarClientProps) {
  const pathname = usePathname();

  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );

  const showBackground = pathname !== routes.home || isScrolled;
  const contactHref = getPrimaryWhatsAppHref();

  return (
    <header
      data-scrolled={showBackground}
      className={`site-navbar ${styles.root} fixed inset-x-0 top-0 z-40`}
    >
      <div className="site-container relative flex h-20 items-center justify-between gap-4 lg:h-22">
        <Link
          href={routes.home}
          aria-label={`${siteConfig.nameAr} — الرئيسية`}
          className="relative flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <Image
            src={siteConfig.logo.src}
            alt=""
            width={94}
            height={94}
            className="size-12 shrink-0 rounded-control object-contain sm:size-20"
          />

          <div dir="ltr" className="hidden min-w-0 text-start sm:block">
            <span className="navbar-brand block text-sm font-semibold tracking-[0.2em]">
              ELKHOLY
            </span>

            <span className="navbar-subtitle mt-1.5 block text-[8px] tracking-[0.12em]">
              LIGHTING SOLUTIONS
            </span>
          </div>

          <NavigationHint />
        </Link>

        <DesktopNavigation categories={categories} />

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <a
            href={contactHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.contactButton} hidden xl:inline-flex`}
          >
            <FaWhatsapp aria-hidden="true" className="size-4 shrink-0" />
            تواصل معنا
          </a>

          <FavoritesLink />
          <ThemeToggle />

          <MobileMenu
            items={mainNavigation}
            contactHref={contactHref}
            categories={categories}
          />
        </div>
      </div>
    </header>
  );
}
