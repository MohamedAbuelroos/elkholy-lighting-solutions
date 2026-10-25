import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaChevronLeft } from "react-icons/fa6";

import { ProductGallery } from "@/components/products/details/product-gallery";
import { ProductInformation } from "@/components/products/details/product-information";
import { RelatedProducts } from "@/components/products/details/related-products";

import { getCategoryPath, getProductPath, routes } from "@/config/routes";
import { getProductDetails } from "@/lib/queries/product-details";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";
import styles from "@/components/products/details/product-detail-enter.module.css";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

function getSiteUrl(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is missing.");
  }

  return siteUrl;
}

function getProductUrl(slug: string): string {
  return new URL(getProductPath(slug), getSiteUrl()).toString();
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const details = await getProductDetails(slug);

  if (!details) notFound();

  const { product } = details;

  const description =
    product.description_ar.trim().replace(/\s+/g, " ").slice(0, 160) ||
    `اكتشف ${product.name_ar} من الخولي، وتواصل معنا لمعرفة المواصفات والتوافر.`;

  const image = product.images[0];
  const url = getProductUrl(product.slug);

  return {
    title: product.name_ar,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.name_ar,
      description,
      url,
      type: "website",
      locale: "ar_EG",
      ...(image
        ? {
            images: [
              {
                url: new URL(image.src, getSiteUrl()).toString(),
                alt: image.alt || product.name_ar,
              },
            ],
          }
        : {}),
    },
  };
}

function RelatedProductsSkeleton() {
  return (
    <div
      role="status"
      className="mt-16 border-t border-border pt-10 sm:mt-20 sm:pt-14"
    >
      <span className="sr-only">جارٍ تحميل المنتجات المشابهة</span>

      <div aria-hidden="true">
        <div className="h-3 w-24 rounded bg-surface-elevated motion-safe:animate-pulse" />

        <div className="mt-4 h-8 w-48 rounded bg-surface-elevated motion-safe:animate-pulse" />

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="aspect-[4/3] bg-surface-elevated motion-safe:animate-pulse" />

              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 rounded bg-surface-elevated motion-safe:animate-pulse" />

                <div className="h-4 w-4/5 rounded bg-surface-elevated motion-safe:animate-pulse" />

                <div className="h-4 w-3/5 rounded bg-surface-elevated motion-safe:animate-pulse" />

                <div className="border-t border-border pt-3">
                  <div className="h-5 w-1/2 rounded bg-surface-elevated motion-safe:animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const details = await getProductDetails(slug);

  if (!details) notFound();

  const { product, category, categoryTrail } = details;

  return (
    <div className="bg-background pb-12 pt-24 text-foreground sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
      <div className="site-container">
        <nav
          aria-label="مسار التنقل"
          className="mb-7 border-b border-border pb-5 sm:mb-9"
        >
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] leading-6 text-muted sm:gap-x-3 sm:text-[11px]">
            <li>
              <Link
                href={routes.home}
                className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">
              <FaChevronLeft className="size-2 text-muted/60" />
            </li>

            <li>
              <Link
                href={routes.products}
                className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                المنتجات
              </Link>
            </li>

            {categoryTrail.map((item) => (
              <li
                key={item.id}
                className="inline-flex min-w-0 items-center gap-2 sm:gap-3"
              >
                <FaChevronLeft
                  aria-hidden="true"
                  className="size-2 shrink-0 text-muted/60"
                />

                <Link
                  href={getCategoryPath(item.slug)}
                  className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.name_ar}
                </Link>
              </li>
            ))}

            <li className="inline-flex min-w-0 max-w-full items-center gap-2 sm:gap-3">
              <FaChevronLeft
                aria-hidden="true"
                className="size-2 shrink-0 text-muted/60"
              />

              <span
                aria-current="page"
                title={product.name_ar}
                className="truncate text-foreground"
              >
                {product.name_ar}
              </span>
            </li>
          </ol>
        </nav>

        {/* Product gallery and information */}
        <div
          key={`product-details-${product.id}`}
          className="grid items-start gap-7 sm:gap-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 xl:gap-16"
        >
          <div className="min-w-0 lg:sticky lg:top-28">
            <div className={styles.gallery}>
              <ProductGallery
                key={product.id}
                images={product.images}
                productName={product.name_ar}
              />
            </div>
          </div>

          <div className={`min-w-0 ${styles.information}`}>
            <ProductInformation
              product={product}
              category={category}
              productUrl={getProductUrl(product.slug)}
              whatsappHref={getPrimaryWhatsAppHref()}
            />
          </div>
        </div>

        {/* Related products stream independently */}
        <Suspense
          key={`related-products-${product.id}`}
          fallback={<RelatedProductsSkeleton />}
        >
          <RelatedProducts
            productId={product.id}
            categoryId={category.id}
            categorySlug={category.slug}
            categoryName={category.name_ar}
          />
        </Suspense>
      </div>
    </div>
  );
}
