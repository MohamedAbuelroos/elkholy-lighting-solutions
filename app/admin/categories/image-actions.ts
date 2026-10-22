"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { CATEGORY_IMAGE_CONFIG } from "@/lib/categories/image-config";
import { optimizeCatalogImage } from "@/lib/admin/images/optimize-catalog-image";
import { cleanupCategoryImageJobs } from "@/lib/admin/images/cleanup-category-image-jobs";
import type { CategoryImageState } from "@/lib/admin/category-image-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function failure(error: string): CategoryImageState {
  return {
    error,
    successId: null,
    message: null,
    warning: null,
  };
}

export async function manageCategoryImage(
  categoryId: string,
  _previousState: CategoryImageState,
  formData: FormData,
): Promise<CategoryImageState> {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(categoryId)) {
    return failure("معرّف الفئة غير صحيح.");
  }

  const operation = formData.get("operation");

  if (
    operation !== "upload" &&
    operation !== "remove" &&
    operation !== "cleanup"
  ) {
    return failure("العملية المطلوبة غير صحيحة.");
  }

  let message = "تم تنظيف الصور القديمة.";

  if (operation !== "cleanup") {
    const expectedValue = formData.get("expected_src");

    if (typeof expectedValue !== "string" || expectedValue.length > 2048) {
      return failure("بيانات الصورة غير صحيحة. حدّث الصفحة.");
    }

    const expectedSrc = expectedValue || null;

    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id, image_path")
      .eq("id", categoryId)
      .maybeSingle();

    if (categoryError) {
      return failure("تعذّر قراءة الفئة. حاول مرة أخرى.");
    }

    if (!category) {
      return failure("الفئة لم تعد موجودة.");
    }

    if (category.image_path !== expectedSrc) {
      return failure("الصورة تغيّرت بالفعل. حدّث الصفحة قبل المحاولة.");
    }

    let newSrc: string | null = null;

    if (operation === "upload") {
      const image = formData.get("image");

      if (
        !(image instanceof File) ||
        image.size === 0 ||
        image.size > CATEGORY_IMAGE_CONFIG.maxBytes ||
        image.type !== "image/webp"
      ) {
        return failure("اختر صورة صالحة ليتم ضغطها قبل الرفع.");
      }

      let buffer: Buffer;

      try {
        buffer = await optimizeCatalogImage(image);
      } catch (error) {
        return failure(
          error instanceof Error
            ? error.message
            : "تعذّرت معالجة الصورة. جرّب صورة أخرى.",
        );
      }

      const path = `${category.id}/${randomUUID()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from(CATEGORY_IMAGE_CONFIG.bucket)
        .upload(path, buffer, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: false,
        });

      if (uploadError) {
        console.error("Failed to upload category image");
        return failure("تعذّر رفع الصورة. حاول مرة أخرى.");
      }

      const { data } = supabase.storage
        .from(CATEGORY_IMAGE_CONFIG.bucket)
        .getPublicUrl(path);

      newSrc = data.publicUrl;
    }

    const { data: saved, error: saveError } = await supabase.rpc(
      "set_category_image",
      {
        p_category_id: category.id,
        p_expected_src: expectedSrc ?? "",
        p_new_src: newSrc ?? "",
      },
    );

    if (saveError || saved !== true) {
      // عند رفض مؤكد من قاعدة البيانات نسجل الصورة الجديدة للتنظيف.
      // عند انقطاع الاتصال لا نحذفها؛ قد يكون الحفظ نجح بالفعل.
      const isDefiniteRejection = Boolean(
        saveError?.code && /^[0-9A-Z]{5}$/.test(saveError.code),
      );

      if (newSrc && isDefiniteRejection) {
        const { error: queueError } = await supabase
          .from("category_image_cleanup_jobs")
          .insert({
            category_id: category.id,
            src: newSrc,
          });

        if (queueError) {
          console.error("Failed to queue unused category image");
        } else {
          try {
            await cleanupCategoryImageJobs(supabase);
          } catch {
            console.error("Category image cleanup will need retry");
          }
        }
      }

      revalidatePath(`/admin/categories/${categoryId}/edit`);

      if (saveError?.code === "40001") {
        return failure("الصورة تغيّرت من نافذة أخرى. حدّث الصفحة.");
      }

      if (saveError?.code === "P0002") {
        return failure("الفئة لم تعد موجودة.");
      }

      console.error("Failed to save category image", {
        code: saveError?.code,
      });

      return failure(
        "تعذّر تأكيد حفظ الصورة. حدّث الصفحة للتحقق قبل إعادة المحاولة.",
      );
    }

    message =
      operation === "remove"
        ? "تم حذف صورة الفئة."
        : "تم حفظ صورة الفئة بنجاح.";
  }

  let warning: string | null = null;

  try {
    const { remaining } = await cleanupCategoryImageJobs(supabase);

    if (remaining > 0) {
      warning = "يوجد تنظيف صور قديمة لم يكتمل بعد. اضغط إعادة محاولة التنظيف.";
    }
  } catch {
    warning = "تعذّر تنظيف الصور القديمة حاليًا. يمكنك إعادة المحاولة.";
  }

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${categoryId}/edit`);
  revalidatePath("/", "layout");

  return {
    error: null,
    successId: randomUUID(),
    message,
    warning,
  };
}
