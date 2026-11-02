export const routes = {
  home: "/",
  products: "/products",
  categories: "/products",
  services: "/#solutions",
  projects: "/projects",
  about: "/about",
  contact: "/contact",
  branches: "/contact#branches",
  links: "/links",
  favorites: "/favorites",
  trackOrder: "/track-order",
} as const;

export const mainNavigation = [
  { label: "الرئيسية", href: routes.home },
  { label: "المنتجات", href: routes.products },
  { label: "مشاريعنا", href: routes.projects },
  { label: "من نحن", href: routes.about },
  {
    label: "متابعة الطلب",
    href: routes.trackOrder,
  },
  { label: "تواصل معنا", href: routes.contact },
] as const;

export function getProductPath(slug: string): string {
  return `${routes.products}/${encodeURIComponent(slug)}`;
}

export function getCategoryPath(slug: string): string {
  return `${routes.products}?category=${encodeURIComponent(slug)}`;
}
