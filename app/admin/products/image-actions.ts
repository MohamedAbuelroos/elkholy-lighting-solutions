"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { optimizeCatalogImage } from "@/lib/admin/images/optimize-catalog-image";
import type { ProductImageUploadState } from "@/lib/admin/product-image-types";
import { PRODUCT_IMAGE_CONFIG } from "@/lib/products/image-config";
import type { ProductImageActionState } from "@/lib/admin/product-image-types";
import { getProductImageStoragePath } from "@/lib/admin/images/storage-path";
import { cleanupProductImageJobs } from "@/lib/admin/images/cleanup-product-image-jobs";

export async function uploadProductImage(
  productId: string,
  _previousState: ProductImageUploadState,
  formData: FormData,
): Promise<ProductImageUploadState> {
  const { supabase } = await requireAdmin();

  const fail = (error: string): ProductImageUploadState => ({
    error,
    successId: null,
  });

  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    );

  if (!isValidId) {
    return fail("معرّف المنتج غير صحيح.");
  }

  const file = formData.get("image");
  const altValue = formData.get("alt");
  const alt = typeof altValue === "string" ? altValue.trim() : "";

  if (!(file instanceof File) || file.size === 0) {
    return fail("اختر صورة أولًا.");
  }

  if (file.size > PRODUCT_IMAGE_CONFIG.maxBytes) {
    return fail("الصورة تجاوزت الحجم المسموح بعد الضغط.");
  }

  if (alt.length > 200) {
    return fail("وصف الصورة يجب ألا يتجاوز 200 حرف.");
  }

  const [productResult, imagesResult] = await Promise.all([
    supabase
      .from("products")
      .select("id,name_ar")
      .eq("id", productId)
      .maybeSingle(),

    supabase
      .from("product_images")
      .select("id", { count: "exact", head: true })
      .eq("product_id", productId),
  ]);

  if (productResult.error || imagesResult.error) {
    console.error("Failed to verify image upload", {
      productCode: productResult.error?.code,
      imagesCode: imagesResult.error?.code,
    });

    return fail("تعذّر التحقق من بيانات المنتج. حاول مرة أخرى.");
  }

  const product = productResult.data;

  if (!product) {
    return fail("المنتج لم يعد موجودًا. حدّث الصفحة.");
  }

  if ((imagesResult.count ?? 0) >= PRODUCT_IMAGE_CONFIG.maxImages) {
    return fail("وصلت للحد الأقصى: خمس صور لكل منتج.");
  }

  let optimizedImage: Buffer;

  try {
    optimizedImage = await optimizeCatalogImage(file);
  } catch (error) {
    return fail(
      error instanceof Error ? error.message : "تعذّرت معالجة الصورة.",
    );
  }

  const bucket = supabase.storage.from(PRODUCT_IMAGE_CONFIG.bucket);
  const objectPath = `${product.id}/${randomUUID()}.webp`;

  const { error: uploadError } = await bucket.upload(
    objectPath,
    optimizedImage,
    {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    },
  );

  if (uploadError) {
    console.error("Failed to upload product image", {
      message: uploadError.message,
    });

    return fail("تعذّر رفع الصورة. حاول مرة أخرى.");
  }

  const { data: publicUrlData } = bucket.getPublicUrl(objectPath);

  const { error: imageError } = await supabase.from("product_images").insert({
    product_id: product.id,
    src: publicUrlData.publicUrl,
    alt: alt || product.name_ar,
    sort_order: 0,
  });

  // الـ trigger يحدد الترتيب النهائي ويفرض حد الخمس صور.
  if (imageError) {
    console.error("Failed to attach product image", {
      code: imageError.code,
    });

    // أخطاء قاعدة البيانات المؤكدة تعني أن الإدخال لم ينجح.
    // عند خطأ اتصال غير محسوم، نحتفظ بالملف لتجنب حذف صورة
    // قد يكون سجلها حُفظ بالفعل.
    const isConfirmedRejection =
      /^[0-9A-Z]{5}$/.test(imageError.code ?? "") ||
      (imageError.code ?? "").startsWith("PGRST");

    if (isConfirmedRejection) {
      const { error: cleanupError } = await bucket.remove([objectPath]);

      if (cleanupError) {
        console.error("Failed to clean up unattached product image", {
          objectPath,
          message: cleanupError.message,
        });
      }
    }

    revalidatePath(`/admin/products/${product.id}/edit`);

    if (imageError.code === "23514") {
      return fail("وصلت للحد الأقصى: خمس صور لكل منتج.");
    }

    return fail(
      isConfirmedRejection
        ? "تعذّر ربط الصورة بالمنتج. حاول مرة أخرى."
        : "تعذّر تأكيد حفظ الصورة. حدّث الصفحة وراجع الصور قبل إعادة الرفع.",
    );
  }

  revalidatePath(`/admin/products/${product.id}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");

  return {
    error: null,
    successId: randomUUID(),
  };
}

type AdminSupabaseClient = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

type ImageCleanupResult = {
  warning: string | null;
  cleanupSrc: string | null;
};

async function cleanupProductImageFile(
  supabase: AdminSupabaseClient,
  _productId: string,
  src: string,
): Promise<ImageCleanupResult> {
  try {
    const result = await cleanupProductImageJobs(supabase, src);

    if (result.remaining === 0) {
      return {
        warning: null,
        cleanupSrc: null,
      };
    }
  } catch (error) {
    console.error("Failed to process image cleanup", { error });
  }

  return {
    warning:
      "تم حذف الصورة من المنتج، لكن تنظيف ملفها لم يكتمل. يمكنك إعادة المحاولة هنا أو من صفحة المنتجات.",
    cleanupSrc: src,
  };
}

export async function manageProductImage(
  productId: string,
  previousState: ProductImageActionState,
  formData: FormData,
): Promise<ProductImageActionState> {
  const { supabase } = await requireAdmin();

  const fail = (error: string): ProductImageActionState => ({
    ...previousState,
    error,
    successId: null,
    message: null,
  });

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(productId)) {
    return fail("معرّف المنتج غير صحيح.");
  }

  const operation = formData.get("operation");

  if (operation === "cleanup") {
    const src = formData.get("src");

    if (
      typeof src !== "string" ||
      !getProductImageStoragePath(src, productId)
    ) {
      return fail("رابط ملف الصورة غير صالح.");
    }

    const cleanup = await cleanupProductImageFile(supabase, productId, src);

    return {
      error: null,
      successId: cleanup.warning ? null : randomUUID(),
      message: cleanup.warning ? null : "تم تنظيف ملف الصورة بنجاح",
      ...cleanup,
    };
  }

  const imageId = formData.get("image_id");

  if (
    typeof imageId !== "string" ||
    !uuidPattern.test(imageId) ||
    typeof operation !== "string" ||
    !["earlier", "later", "first", "delete"].includes(operation)
  ) {
    return fail("بيانات العملية غير صحيحة.");
  }

  const { data: deletedSrc, error } = await supabase.rpc(
    "manage_product_image",
    {
      p_product_id: productId,
      p_image_id: imageId,
      p_action: operation,
    },
  );

  if (error) {
    console.error("Failed to manage product image", {
      code: error.code,
    });

    revalidatePath(`/admin/products/${productId}/edit`);

    if (error.code === "23514") {
      return fail("لا يمكن حذف آخر صورة لمنتج منشور. أضف صورة بديلة أولًا.");
    }

    if (error.code === "P0002") {
      return fail("الصورة أو المنتج لم يعد موجودًا. حدّث الصفحة.");
    }

    return fail("تعذّر تنفيذ العملية. حدّث الصفحة وحاول مرة أخرى.");
  }

  let cleanup: ImageCleanupResult = {
    warning: previousState.warning,
    cleanupSrc: previousState.cleanupSrc,
  };

  if (operation === "delete" && typeof deletedSrc === "string") {
    cleanup = await cleanupProductImageFile(supabase, productId, deletedSrc);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");

  return {
    error: null,
    successId: randomUUID(),
    message:
      operation === "delete"
        ? "تم حذف الصورة من المنتج"
        : operation === "first"
          ? "تم تغيير الصورة الرئيسية"
          : "تم تحديث ترتيب الصور",
    ...cleanup,
  };
}
