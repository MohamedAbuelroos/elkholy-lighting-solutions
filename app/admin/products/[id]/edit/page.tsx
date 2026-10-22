import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProduct } from "@/app/admin/products/actions";
import { ProductForm } from "@/components/admin/products/product-form";
import { getAdminCategories } from "@/lib/admin/queries/categories";
import { getAdminProductById } from "@/lib/admin/queries/products";
import { ProductImagesManager } from "@/components/admin/products/product-images-manager";
import { getAdminProductImages } from "@/lib/admin/queries/product-images";
import { ProductPublicationControl } from "@/components/admin/products/product-publication-control";
import { DeleteProductControl } from "@/components/admin/products/delete-product-control";

export const metadata: Metadata = {
  title: "تعديل المنتج",
};

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const [product, categories, images] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
    getAdminProductImages(id),
  ]);

  if (!product) notFound();

  const action = updateProduct.bind(null, product.id);

  return (
    <section>
      <Link
        href="/admin/products"
        className="text-sm text-muted transition-colors hover:text-primary"
      >
        المنتجات / تعديل المنتج
      </Link>

      <div className="mb-8 mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-medium text-primary">إدارة الكتالوج</p>

          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              product.is_active
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-border bg-surface text-muted"
            }`}
          >
            {product.is_active ? "منتج نشط" : "منتج مخفي"}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold leading-relaxed sm:text-3xl">
          تعديل {product.name_ar}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          حدّث بيانات المنتج وفئته وسعره وإعدادات ظهوره داخل أقسام الصفحة
          الرئيسية.
        </p>
      </div>

      <ProductPublicationControl
        productId={product.id}
        isActive={product.is_active}
        imageCount={images.length}
      />

      <ProductForm
        key={product.id}
        action={action}
        categories={categories}
        submitLabel="حفظ التعديلات"
        notice="التعديلات تُحفظ على المنتج مباشرة مع الاحتفاظ بصوره وحالة ظهوره الحالية."
        initialValues={{
          name_ar: product.name_ar,
          name_en: product.name_en ?? "",
          slug: product.slug,
          category_id: product.category_id,
          description_ar: product.description_ar,
          description_en: product.description_en ?? "",
          sku: product.sku ?? "",
          price: product.price === null ? "" : String(product.price),
          sort_order: String(product.sort_order),
          is_featured: product.is_featured,
          is_popular: product.is_popular,
        }}
      />

      <ProductImagesManager
        productId={product.id}
        productName={product.name_ar}
        images={images}
      />

      <DeleteProductControl
        productId={product.id}
        productName={product.name_ar}
        isActive={product.is_active}
      />
    </section>
  );
}
