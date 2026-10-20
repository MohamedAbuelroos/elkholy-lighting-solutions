import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FaCheck,
  FaHouse,
  FaLayerGroup,
  FaLightbulb,
  FaLock,
  FaPlug,
  FaVolumeHigh,
} from "react-icons/fa6";

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

export function CatalogCategories({
  categories,
  selectedSlug,
  categoryCounts,
  totalProducts,
}: CatalogCategoriesProps) {
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

  return (
    <nav
      aria-label="فئات المنتجات"
      className="border-b border-border bg-background py-5"
    >
      <div className="site-container">
        <ul className="flex gap-3 overflow-x-auto px-1 py-1">
          {items.map((item) => {
            const selected = item.slug === (selectedSlug ?? "");
            const Icon = item.icon;

            return (
              <li key={item.id} className="w-48 shrink-0 lg:min-w-0 lg:flex-1">
                <Link
                  href={
                    item.slug
                      ? `/products?category=${encodeURIComponent(item.slug)}`
                      : "/products"
                  }
                  scroll={false}
                  aria-current={selected ? "page" : undefined}
                  title={item.name}
                  className={`group flex h-24 items-center gap-3 rounded-xl border px-3 py-4 transition-colors duration-200 ${
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface hover:border-primary/40 hover:bg-surface-elevated"
                  }`}
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-primary text-on-primary"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex h-10 items-center">
                      <span className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                        {item.name}
                      </span>
                    </span>

                    <span className="mt-1 flex items-center gap-1.5 text-[12px] text-muted">
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
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
