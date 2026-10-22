import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FaChevronLeft } from "react-icons/fa6";

import { ProductGallery } from "@/components/products/details/product-gallery";
import { ProductInformation } from "@/components/products/details/product-information";
import { RelatedProducts } from "@/components/products/details/related-products";

import { getProductPath, routes } from "@/config/routes";
import { getProductDetails } from "@/lib/queries/product-details";
import { getPrimaryWhatsAppHref } from "@/lib/utils/whatsapp";

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
      aria-label="جارٍ تحميل المنتجات المشابهة"
      className="mt-16 border-t border-border pt-12"
    >
      <div className="h-8 w-48 rounded bg-surface-elevated motion-safe:animate-pulse" />

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="aspect-[3/4] rounded-2xl bg-surface-elevated motion-safe:animate-pulse"
          />
        ))}
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
    <div className="relative bg-background pb-16 pt-28 text-foreground sm:pb-24 lg:pt-32">
      <div className="site-container">
        <nav aria-label="مسار التنقل" className="mb-7 sm:mb-10">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] leading-6 text-muted sm:gap-x-3 sm:text-xs">
            <li>
              <Link
                href={routes.home}
                className="transition-colors hover:text-primary"
              >
                الرئيسية
              </Link>
            </li>

            <li aria-hidden="true">
              <FaChevronLeft className="size-2" />
            </li>

            <li>
              <Link
                href={routes.products}
                className="transition-colors hover:text-primary"
              >
                المنتجات
              </Link>
            </li>

            {categoryTrail.map((item) => (
              <li
                key={item.id}
                className="inline-flex items-center gap-2 sm:gap-3"
              >
                <FaChevronLeft aria-hidden="true" className="size-2 shrink-0" />

                <Link
                  href={`${routes.products}?${new URLSearchParams({
                    category: item.slug,
                  })}`}
                  className="transition-colors hover:text-primary"
                >
                  {item.name_ar}
                </Link>
              </li>
            ))}

            <li className="inline-flex min-w-0 items-center gap-2 sm:gap-3">
              <FaChevronLeft aria-hidden="true" className="size-2 shrink-0" />

              <span
                aria-current="page"
                className="line-clamp-1 text-foreground"
              >
                {product.name_ar}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-20">
          <ProductGallery
            key={product.id}
            images={product.images}
            productName={product.name_ar}
          />

          <ProductInformation
            product={product}
            category={category}
            productUrl={getProductUrl(product.slug)}
            whatsappHref={getPrimaryWhatsAppHref()}
          />
        </div>

        <Suspense fallback={<RelatedProductsSkeleton />}>
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
