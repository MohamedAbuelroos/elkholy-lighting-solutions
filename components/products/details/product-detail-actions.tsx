"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  FaBagShopping,
  FaHeart,
  FaMinus,
  FaPlus,
  FaRegHeart,
} from "react-icons/fa6";
import { useFavorites } from "@/hooks/use-favorites";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import Link from "next/link";

type ProductDetailActionsProps = {
  productId: string;
  productName: string;
  sku: string | null;
  price: number | null;
  productUrl: string;
  whatsappHref: string;
};

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const quantityButtonClassName =
  "flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-30";

export function ProductDetailActions({
  productId,
  productName,
  sku,
  price,
  productUrl,
  whatsappHref,
}: ProductDetailActionsProps) {
  const [quantityText, setQuantityText] = useState("1");

  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(productId);

  const quantity = Number(quantityText);

  const isValidQuantity =
    /^\d+$/.test(quantityText) &&
    Number.isInteger(quantity) &&
    quantity >= MIN_QUANTITY &&
    quantity <= MAX_QUANTITY;

  function changeQuantity(amount: number) {
    const current = isValidQuantity ? quantity : MIN_QUANTITY;

    setQuantityText(
      String(Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, current + amount))),
    );
  }

  function normalizeQuantity() {
    if (!isValidQuantity) {
      setQuantityText("1");
      return;
    }

    setQuantityText(String(quantity));
  }

  const directCheckoutHref = `/checkout?${new URLSearchParams({
    product: productId,
    quantity: String(isValidQuantity ? quantity : MIN_QUANTITY),
  }).toString()}`;

  let inquiryHref = whatsappHref;

  if (whatsappHref.startsWith("https://wa.me/")) {
    const inquiryUrl = new URL(whatsappHref);

    inquiryUrl.searchParams.set(
      "text",
      [
        "مرحبًا فريق الخولي، أود الاستفسار عن المنتج التالي:",
        "",
        `المنتج: ${productName}`,
        sku ? `كود المنتج: ${sku}` : null,
        "",
        `رابط المنتج: ${productUrl}`,
        "",
        "برجاء توضيح المواصفات والتفاصيل المتاحة.",
      ]
        .filter((line) => line !== null)
        .join("\n"),
    );

    inquiryHref = inquiryUrl.toString();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <label
            htmlFor="product-order-quantity"
            className="text-xs font-medium text-foreground"
          >
            الكمية المطلوبة
          </label>

          <p className="mt-1 text-[10px] leading-6 text-muted">
            حدّد العدد قبل إرسال الطلب
          </p>
        </div>

        <div
          dir="ltr"
          className="inline-flex items-center rounded-full border border-border bg-background p-1"
        >
          <button
            type="button"
            aria-label="تقليل الكمية"
            disabled={isValidQuantity && quantity === MIN_QUANTITY}
            onClick={() => changeQuantity(-1)}
            className={quantityButtonClassName}
          >
            <FaMinus aria-hidden="true" className="size-3" />
          </button>

          <input
            id="product-order-quantity"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            value={quantityText}
            onChange={(event) => {
              const value = event.target.value
                .replace(/[٠-٩]/g, (digit) =>
                  String(digit.charCodeAt(0) - 1632),
                )
                .replace(/[۰-۹]/g, (digit) =>
                  String(digit.charCodeAt(0) - 1776),
                );

              if (/^\d{0,3}$/.test(value)) {
                setQuantityText(value);
              }
            }}
            onBlur={normalizeQuantity}
            aria-invalid={!isValidQuantity}
            aria-describedby={
              !isValidQuantity ? "product-quantity-error" : undefined
            }
            className="h-11 w-12 rounded-lg bg-transparent text-center text-sm font-medium tabular-nums text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />

          <button
            type="button"
            aria-label="زيادة الكمية"
            disabled={isValidQuantity && quantity === MAX_QUANTITY}
            onClick={() => changeQuantity(1)}
            className={quantityButtonClassName}
          >
            <FaPlus aria-hidden="true" className="size-3" />
          </button>
        </div>
      </div>

      {!isValidQuantity && (
        <p
          id="product-quantity-error"
          role="status"
          className="mt-3 text-xs leading-6 text-muted"
        >
          اكتب كمية من 1 إلى 999.
        </p>
      )}

      {price !== null && isValidQuantity && quantity > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-[11px] text-muted">الإجمالي المبدئي</span>

          <span className="text-base font-medium tabular-nums text-foreground">
            {priceFormatter.format(price * quantity)}
          </span>
        </div>
      )}
      <AddToCartButton
        productId={productId}
        productName={productName}
        quantity={quantity}
        disabled={!isValidQuantity}
        className="mt-5"
      />
      <div className="mt-5 flex items-stretch gap-2.5">
        <Link
          href={directCheckoutHref}
          prefetch={false}
          aria-disabled={!isValidQuantity}
          tabIndex={isValidQuantity ? 0 : -1}
          onClick={(event) => {
            if (!isValidQuantity) {
              event.preventDefault();
            }
          }}
          className={`inline-flex min-h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-3 py-3 text-xs font-medium leading-6 text-on-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
            isValidQuantity
              ? "hover:bg-primary-hover"
              : "cursor-not-allowed opacity-50"
          }`}
        >
          <FaBagShopping aria-hidden="true" className="size-4 shrink-0" />
          اطلب الآن
        </Link>

        <button
          type="button"
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `إزالة ${productName} من المفضلة`
              : `إضافة ${productName} إلى المفضلة`
          }
          title={isFavorite ? "إزالة من المفضلة" : "حفظ في المفضلة"}
          onClick={() => toggleFavorite(productId)}
          className={`flex size-14 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
            isFavorite
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-background text-muted hover:border-primary/50 hover:text-primary"
          }`}
        >
          {isFavorite ? (
            <FaHeart aria-hidden="true" className="size-4" />
          ) : (
            <FaRegHeart aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <a
          href={inquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <FaWhatsapp aria-hidden="true" className="size-4 text-primary" />
          استفسر عن المنتج
          <span className="sr-only">يفتح في تبويب جديد</span>
        </a>

        <p className="text-[10px] leading-7 text-muted">
          لتسجيل طلبك ومتابعته، اضغط «اطلب الآن» وأكمل بياناتك.
        </p>
      </div>
    </div>
  );
}
