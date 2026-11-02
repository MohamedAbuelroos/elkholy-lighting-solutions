"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  FaArrowLeft,
  FaArrowRotateRight,
  FaBagShopping,
  FaImage,
  FaMinus,
  FaPlus,
  FaTrashCan,
} from "react-icons/fa6";

import { loadCartProducts } from "@/app/(website)/cart/actions";
import { getProductPath, routes } from "@/config/routes";
import { useCart } from "@/hooks/use-cart";
import { MAX_CART_QUANTITY } from "@/lib/cart/store";

type CartProducts = Awaited<ReturnType<typeof loadCartProducts>>;

type LoadedResult = {
  key: string;
  products: CartProducts;
  failed: boolean;
};

const priceFormatter = new Intl.NumberFormat("ar-EG", {
  style: "currency",
  currency: "EGP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const countFormatter = new Intl.NumberFormat("ar-EG");

const quantityButtonClassName =
  "flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-30";

const outlineButtonClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function CartContent() {
  const { items, setCartQuantity, removeCartItem } = useCart();

  const [result, setResult] = useState<LoadedResult>({
    key: "",
    products: [],
    failed: false,
  });

  const [retry, setRetry] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Quantities are local. Reload products only when their IDs change.
  const idsKey = JSON.stringify(items.map((item) => item.productId).sort());

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      try {
        const ids = JSON.parse(idsKey) as string[];
        const products = ids.length > 0 ? await loadCartProducts(ids) : [];

        if (!cancelled) {
          setResult({
            key: idsKey,
            products,
            failed: false,
          });
        }
      } catch {
        if (!cancelled) {
          setResult({
            key: idsKey,
            products: [],
            failed: true,
          });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey, retry]);

  if (result.key !== idsKey || isPending) {
    return (
      <div role="status" aria-label="جارٍ تحميل السلة">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-40 rounded-3xl bg-surface-elevated motion-safe:animate-pulse"
              />
            ))}
          </div>

          <div
            aria-hidden="true"
            className="h-64 rounded-3xl bg-surface-elevated motion-safe:animate-pulse"
          />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-3xl border border-border bg-surface px-6 py-16 text-center sm:py-20">
        <span className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/5 text-primary">
          <FaBagShopping aria-hidden="true" className="size-8" />
        </span>

        <h2 className="mt-6 text-2xl font-medium text-foreground">
          اختياراتك تبدأ من هنا
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-8 text-muted">
          أضف المنتجات التي تحتاجها، وحدّد الكميات المناسبة لمساحتك في مكان
          واحد.
        </p>

        <Link
          href={routes.products}
          className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          استكشف المنتجات
          <FaArrowLeft aria-hidden="true" className="size-3" />
        </Link>
      </section>
    );
  }

  if (result.failed) {
    return (
      <section className="rounded-3xl border border-border bg-surface px-6 py-14 text-center">
        <h2 className="text-xl font-medium text-foreground">
          تعذّر تحميل منتجات السلة
        </h2>

        <p role="alert" className="mt-3 text-sm leading-7 text-muted">
          اختياراتك ما زالت محفوظة. جرّب التحميل مرة أخرى.
        </p>

        <button
          type="button"
          onClick={() => setRetry((previous) => previous + 1)}
          className={`mt-6 ${outlineButtonClassName}`}
        >
          <FaArrowRotateRight aria-hidden="true" className="size-3" />
          إعادة المحاولة
        </button>
      </section>
    );
  }

  const productsById = new Map(
    result.products.map((item) => [item.product.id, item]),
  );

  let pricedTotalInCents = 0;
  let availableQuantity = 0;
  let availableCount = 0;
  let unpricedCount = 0;

  for (const item of items) {
    const entry = productsById.get(item.productId);

    if (!entry) continue;

    availableCount += 1;
    availableQuantity += item.quantity;

    if (entry.product.sale_price === null) {
      unpricedCount += 1;
    } else {
      pricedTotalInCents +=
        Math.round(entry.product.sale_price * 100) * item.quantity;
    }
  }

  const unavailableCount = items.length - availableCount;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
      <section aria-labelledby="cart-items-title" className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="cart-items-title"
            className="text-base font-medium text-foreground"
          >
            منتجات السلة
            <span className="ms-2 text-sm tabular-nums text-primary">
              ({countFormatter.format(items.length)})
            </span>
          </h2>

          <button
            type="button"
            onClick={() => setRetry((previous) => previous + 1)}
            className={outlineButtonClassName}
          >
            <FaArrowRotateRight aria-hidden="true" className="size-3" />
            تحديث الأسعار
          </button>
        </div>

        <ul className="space-y-4">
          {items.map((item) => {
            const entry = productsById.get(item.productId);

            if (!entry) {
              return (
                <li
                  key={item.productId}
                  className="flex flex-col gap-4 rounded-3xl border border-dashed border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      منتج محفوظ غير متاح حاليًا
                    </h3>

                    <p className="mt-2 text-xs leading-7 text-muted">
                      لن يدخل في الإجمالي. يمكنك الاحتفاظ به أو إزالته.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCartItem(item.productId)}
                    aria-label="إزالة المنتج غير المتاح من السلة"
                    className={`${outlineButtonClassName} self-start`}
                  >
                    <FaTrashCan aria-hidden="true" className="size-3" />
                    إزالة
                  </button>
                </li>
              );
            }

            const { product, categoryName } = entry;
            const image = product.images[0];
            const unitPrice = product.sale_price;

            const isDiscounted =
              product.discount_percent > 0 &&
              product.price !== null &&
              unitPrice !== null;

            const lineTotal =
              unitPrice === null
                ? null
                : (Math.round(unitPrice * 100) * item.quantity) / 100;

            return (
              <li
                key={item.productId}
                className="min-w-0 rounded-3xl border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex items-start gap-4">
                  <Link
                    href={getProductPath(product.slug)}
                    aria-label={`عرض ${product.name_ar}`}
                    className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-28"
                  >
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt || product.name_ar}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-muted">
                        <FaImage aria-hidden="true" className="size-6" />
                      </span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] leading-6 text-primary">
                      {categoryName}
                    </p>

                    <h3 className="mt-1 break-words text-sm font-medium leading-7 text-foreground">
                      <Link
                        href={getProductPath(product.slug)}
                        className="transition-colors hover:text-primary"
                      >
                        {product.name_ar}
                      </Link>
                    </h3>

                    {product.sku && (
                      <p className="mt-1 text-[10px] leading-6 text-muted">
                        الكود:{" "}
                        <bdi className="break-all font-mono">{product.sku}</bdi>
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCartItem(product.id)}
                    aria-label={`إزالة ${product.name_ar} من السلة`}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-background hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <FaTrashCan aria-hidden="true" className="size-3.5" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                  <div>
                    <p className="text-[10px] leading-6 text-muted">
                      سعر الوحدة
                    </p>

                    {isDiscounted && product.price !== null && (
                      <p className="text-[11px] leading-6 text-muted">
                        <span className="sr-only">قبل الخصم: </span>
                        <del>{priceFormatter.format(product.price)}</del>
                        <span className="ms-2 text-primary">
                          خصم {product.discount_percent}٪
                        </span>
                      </p>
                    )}

                    <p className="text-sm font-medium leading-7 tabular-nums text-foreground">
                      {unitPrice === null
                        ? "السعر عند الاستفسار"
                        : priceFormatter.format(unitPrice)}
                    </p>
                  </div>

                  <div
                    dir="ltr"
                    role="group"
                    aria-label={`كمية ${product.name_ar}`}
                    className="inline-flex items-center rounded-full border border-border bg-background p-1"
                  >
                    <button
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        setCartQuantity(product.id, item.quantity - 1)
                      }
                      aria-label={`تقليل كمية ${product.name_ar}`}
                      className={quantityButtonClassName}
                    >
                      <FaMinus aria-hidden="true" className="size-3" />
                    </button>

                    <span
                      aria-label={`الكمية ${item.quantity}`}
                      className="min-w-10 px-1 text-center text-sm font-medium tabular-nums text-foreground"
                    >
                      {countFormatter.format(item.quantity)}
                    </span>

                    <button
                      type="button"
                      disabled={item.quantity >= MAX_CART_QUANTITY}
                      onClick={() =>
                        setCartQuantity(product.id, item.quantity + 1)
                      }
                      aria-label={`زيادة كمية ${product.name_ar}`}
                      className={quantityButtonClassName}
                    >
                      <FaPlus aria-hidden="true" className="size-3" />
                    </button>
                  </div>

                  <div className="text-end">
                    <p className="text-[10px] leading-6 text-muted">
                      إجمالي المنتج
                    </p>

                    <p className="text-sm font-medium leading-7 tabular-nums text-primary">
                      {lineTotal === null
                        ? "يُحدّد مع الفريق"
                        : priceFormatter.format(lineTotal)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href={routes.products}
          className={`mt-6 ${outlineButtonClassName}`}
        >
          متابعة الاستكشاف
          <FaArrowLeft aria-hidden="true" className="size-3" />
        </Link>
      </section>

      <aside
        aria-labelledby="cart-summary-title"
        className="min-w-0 rounded-3xl border border-primary/20 bg-surface p-6 lg:sticky lg:top-28"
      >
        <p className="text-[10px] leading-6 text-primary">
          اختياراتك في مكان واحد
        </p>

        <h2
          id="cart-summary-title"
          className="mt-2 text-xl font-medium text-foreground"
        >
          ملخص السلة
        </h2>

        <dl className="mt-6 space-y-4 text-xs leading-7">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">المنتجات المتاحة</dt>
            <dd className="tabular-nums text-foreground">
              {countFormatter.format(availableCount)}
            </dd>
          </div>

          <div className="flex justify-between gap-3">
            <dt className="text-muted">إجمالي القطع المتاحة</dt>
            <dd className="tabular-nums text-foreground">
              {countFormatter.format(availableQuantity)}
            </dd>
          </div>

          {unavailableCount > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">منتجات غير متاحة</dt>
              <dd className="tabular-nums text-foreground">
                {countFormatter.format(unavailableCount)}
              </dd>
            </div>
          )}

          {unpricedCount > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">منتجات تحتاج تأكيد السعر</dt>
              <dd className="tabular-nums text-foreground">
                {countFormatter.format(unpricedCount)}
              </dd>
            </div>
          )}
        </dl>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="mt-6 border-t border-border pt-5"
        >
          <p className="text-xs leading-7 text-muted">
            {unpricedCount > 0
              ? "إجمالي المنتجات المسعّرة فقط"
              : "الإجمالي المبدئي"}
          </p>

          <p className="mt-2 break-words text-2xl font-medium leading-relaxed tabular-nums text-foreground">
            {availableCount === 0
              ? "لا توجد منتجات متاحة"
              : unpricedCount === availableCount
                ? "السعر عند الاستفسار"
                : priceFormatter.format(pricedTotalInCents / 100)}
          </p>
        </div>

        <p className="mt-4 text-[11px] leading-7 text-muted">
          الإجمالي لا يشمل التوصيل. يؤكد فريق الخولي التوافر والأسعار النهائية
          قبل إتمام الطلب.
        </p>
        {availableCount > 0 && unavailableCount === 0 ? (
          <Link
            href="/checkout"
            className="mt-5 flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            متابعة الطلب
            <FaArrowLeft aria-hidden="true" className="size-3" />
          </Link>
        ) : (
          <p className="mt-5 text-xs leading-7 text-muted">
            أزل المنتجات غير المتاحة وأضف منتجًا متاحًا للمتابعة.
          </p>
        )}
      </aside>
    </div>
  );
}
