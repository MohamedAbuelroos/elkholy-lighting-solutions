"use client";

import Link from "next/link";
import { FaRegHeart } from "react-icons/fa6";

import { useFavorites } from "@/hooks/use-favorites";

export function FavoritesLink() {
  const { count } = useFavorites();

  return (
    <Link
      href="/favorites"
      aria-label={`المفضلة، ${count} منتج محفوظ`}
      title="المفضلة"
      className="navbar-control relative flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors"
    >
      <FaRegHeart aria-hidden="true" className="size-4" />

      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -end-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-5 text-on-primary"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
