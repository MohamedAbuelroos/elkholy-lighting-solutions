import { Hero } from "@/components/home/hero/hero";
import { CategoryShowcase } from "@/components/home/category/category-showcase";
import { FeaturedProducts } from "@/components/home/products/featured-products";
import { PopularProducts } from "@/components/home/products/popular-products";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <PopularProducts />
    </>
  );
}
