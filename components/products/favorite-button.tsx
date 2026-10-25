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
      className={`group/favorite flex size-10 shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B858] motion-reduce:transition-none ${
        isFavorite
          ? "border-[#E2B858]/60 bg-[#25190D]/90 text-[#F0C573] hover:bg-[#352411]"
          : "border-white/30 bg-black/50 text-white hover:border-[#E2B858]/60 hover:bg-black/65 hover:text-[#F0C573]"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="transition-transform duration-200 motion-safe:group-hover/favorite:scale-110 motion-safe:group-active/favorite:scale-95 motion-reduce:transition-none"
      >
        {isFavorite ? (
          <FaHeart className="size-4" />
        ) : (
          <FaRegHeart className="size-4" />
        )}
      </span>
    </button>
  );
}
