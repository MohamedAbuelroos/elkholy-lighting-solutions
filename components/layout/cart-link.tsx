"use client";

import Link from "next/link";
import { FaBagShopping } from "react-icons/fa6";

import { useCart } from "@/hooks/use-cart";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`السلة، ${count} منتج مختلف`}
      title="السلة"
      className="navbar-control relative flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors"
    >
      <FaBagShopping aria-hidden="true" className="size-4" />

      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -end-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-5 text-on-primary"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
