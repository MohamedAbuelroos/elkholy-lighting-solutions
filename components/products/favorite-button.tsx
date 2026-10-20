"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa6";

import { useFavorites } from "@/hooks/use-favorites";

type FavoriteButtonProps = {
  productId: string;
  productName: string;
  className?: string;
};

export function FavoriteButton({
  productId,
  productName,
  className = "",
}: FavoriteButtonProps) {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(productId);

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={
        isFavorite
          ? `إزالة ${productName} من المفضلة`
          : `إضافة ${productName} إلى المفضلة`
      }
      title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      onClick={() => toggleFavorite(productId)}
      className={`flex size-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-colors duration-200 motion-reduce:transition-none ${
        isFavorite
          ? "border-[#E2B858]/60 bg-[#25190D]/90 text-[#F0C573]"
          : "border-white/25 bg-black/45 text-white hover:border-[#E2B858]/60 hover:text-[#F0C573]"
      } ${className}`}
    >
      {isFavorite ? (
        <FaHeart aria-hidden="true" className="size-4" />
      ) : (
        <FaRegHeart aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
