"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { ProductsNavigation } from "@/components/layout/products-navigation";
import { NavigationHint } from "@/components/ui/navigation-hint";
import { mainNavigation, routes } from "@/config/routes";

import type { Category } from "@/types/category";

import styles from "./navbar-polish.module.css";

type DesktopNavigationProps = {
  categories: Category[];
};

function isActiveRoute(pathname: string, href: string): boolean {
  // روابط السكاشن ليست صفحات مستقلة.
  if (href.includes("#")) return false;

  const path = href.split("?")[0];

  if (path === routes.home) {
    return pathname === routes.home;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function DesktopNavigation({ categories }: DesktopNavigationProps) {
  const pathname = usePathname();

  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const activeHref = mainNavigation.find((item) =>
    isActiveRoute(pathname, item.href),
  )?.href;

  useEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;

    if (!list || !indicator) return;

    let frameId = 0;

    function measure() {
      if (!list || !indicator) return;

      const activeItem = list.querySelector<HTMLLIElement>(
        ':scope > li[data-active="true"]',
      );

      if (!activeItem || list.offsetWidth === 0) {
        indicator.style.opacity = "0";
        return;
      }

      indicator.style.width = `${activeItem.offsetWidth}px`;

      indicator.style.transform = `translate3d(${list.offsetLeft + activeItem.offsetLeft}px, 0, 0)`;

      indicator.style.opacity = "1";
    }

    function scheduleMeasure() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measure);
    }

    scheduleMeasure();

    const observer = new ResizeObserver(scheduleMeasure);

    observer.observe(list);

    for (const item of list.children) {
      if (item instanceof HTMLLIElement) {
        observer.observe(item);
      }
    }

    document.fonts.addEventListener("loadingdone", scheduleMeasure);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();

      document.fonts.removeEventListener("loadingdone", scheduleMeasure);
    };
  }, [activeHref]);

  return (
    <nav
      aria-label="التنقل الرئيسي"
      className={`${styles.desktopNav} hidden xl:block`}
    >
      <div className="relative">
        <ul ref={listRef} className={styles.list}>
          {mainNavigation.map((item) => {
            const isActive = item.href === activeHref;

            return (
              <li
                key={item.href}
                data-active={isActive}
                className={styles.item}
              >
                {item.href === routes.products ? (
                  <ProductsNavigation categories={categories} />
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="navbar-link"
                  >
                    {item.label}
                    <NavigationHint />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <span
          ref={indicatorRef}
          aria-hidden="true"
          className={styles.indicator}
        />
      </div>
    </nav>
  );
}
