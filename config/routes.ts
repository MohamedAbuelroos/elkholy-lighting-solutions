export const routes = {
  home: "/",
  products: "/products",
  categories: "/categories",
  services: "/services",
  projects: "/projects",
  about: "/about",
  branches: "/branches",
  contact: "/contact",
  links: "/links",
} as const;

export const mainNavigation = [
  { label: "الرئيسية", href: routes.home },
  { label: "المنتجات", href: routes.products },
  { label: "خدماتنا", href: routes.services },
  { label: "مشاريعنا", href: routes.projects },
  { label: "عن الخولي", href: routes.about },
  { label: "فروعنا", href: routes.branches },
] as const;

export function getProductPath(slug: string): string {
  return `${routes.products}/${encodeURIComponent(slug)}`;
}

export function getCategoryPath(slug: string): string {
  return `${routes.categories}/${encodeURIComponent(slug)}`;
}

export function getProjectPath(slug: string): string {
  return `${routes.projects}/${encodeURIComponent(slug)}`;
}
