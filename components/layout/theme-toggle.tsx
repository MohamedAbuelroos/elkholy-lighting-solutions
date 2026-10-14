"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa6";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;

    setTheme(currentTheme === "light" ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تبديل الوضع الفاتح والداكن"
      title="تبديل الوضع الفاتح والداكن"
      className="navbar-control flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors"
    >
      <FaSun aria-hidden="true" className="theme-icon-dark size-4" />
      <FaMoon aria-hidden="true" className="theme-icon-light size-4" />
    </button>
  );
}
