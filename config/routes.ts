export const routes = {
  home: "/",
  products: "/products",
  categories: "/products",
  services: "/#solutions",
  projects: "/projects",
  about: "/about",
  branches: "/links#branches",
  contact: "/links",
  links: "/links",
  favorites: "/favorites",
} as const;

export const mainNavigation = [
  { label: "الرئيسية", href: routes.home },
  { label: "المنتجات", href: routes.products },
  { label: "حلولنا", href: routes.services },
  { label: "مشاريعنا", href: routes.projects },
  { label: "من نحن", href: routes.about },
  { label: "التواصل والفروع", href: routes.links },
] as const;

export function getProductPath(slug: string): string {
  return `${routes.products}/${encodeURIComponent(slug)}`;
}

export function getCategoryPath(slug: string): string {
  return `${routes.products}?category=${encodeURIComponent(slug)}`;
}
