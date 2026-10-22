"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { ProductPublicationState } from "@/lib/admin/product-form-types";

export async function changeProductPublication(
  productId: string,
  _previousState: ProductPublicationState,
  formData: FormData,
): Promise<ProductPublicationState> {
  const { supabase } = await requireAdmin();

  const fail = (error: string): ProductPublicationState => ({
    error,
    successId: null,
    message: null,
  });

  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    );

  if (!isValidId) {
    return fail("معرّف المنتج غير صحيح.");
  }

  const operation = formData.get("operation");

  if (operation !== "publish" && operation !== "hide") {
    return fail("عملية غير صحيحة.");
  }

  const shouldPublish = operation === "publish";

  const { data, error } = await supabase.rpc("set_product_publication", {
    p_product_id: productId,
    p_is_active: shouldPublish,
  });

  if (error) {
    console.error("Failed to change product publication", {
      code: error.code,
      message: error.message,
    });

    if (error.message === "product_requires_image") {
      return fail("أضف صورة واحدة على الأقل قبل نشر المنتج.");
    }

    if (error.message === "product_category_not_visible") {
      return fail(
        "فئة المنتج أو إحدى الفئات الأعلى منها مخفية. فعّل الفئات المطلوبة أو اختر فئة أخرى ثم احفظ بيانات المنتج.",
      );
    }

    if (error.code === "P0002") {
      return fail("المنتج لم يعد موجودًا. حدّث الصفحة.");
    }

    return fail("تعذّر تحديث حالة المنتج. حاول مرة أخرى.");
  }

  if (data !== shouldPublish) {
    return fail("تعذّر تأكيد حالة المنتج. حدّث الصفحة وراجع حالته.");
  }

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");

  return {
    error: null,
    successId: randomUUID(),
    message: shouldPublish ? "تم نشر المنتج بنجاح" : "تم إخفاء المنتج بنجاح",
  };
}
