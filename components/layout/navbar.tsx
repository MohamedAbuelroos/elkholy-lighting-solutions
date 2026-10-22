import { NavbarClient } from "@/components/layout/navbar-client";
import { getRootCategories } from "@/lib/queries/categories";

export async function Navbar() {
  const categories = await getRootCategories();

  return <NavbarClient categories={categories} />;
}
