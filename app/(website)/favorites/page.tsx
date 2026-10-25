import type { Metadata } from "next";

import { FavoritesContent } from "@/components/products/favorites/favorites-content";
import { FavoritesHero } from "@/components/products/favorites/favorites-hero";

export const metadata: Metadata = {
  title: "المفضلة | الخولي",
  description: "منتجات الخولي التي حفظتها للرجوع إليها لاحقًا.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <FavoritesHero />

      <div className="site-container py-8 sm:py-10 lg:pb-16">
        <FavoritesContent />
      </div>
    </div>
  );
}
