"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { cleanupProductImageJobs } from "@/lib/admin/images/cleanup-product-image-jobs";
import type { ProductFormState } from "@/lib/admin/product-form-types";
import type { ProductCleanupState } from "@/lib/admin/product-image-types";

export async function deleteProduct(
  productId: string,
  _previousState: ProductFormState,
  _formData: FormData,
): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();

  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      productId,
    );

  if (!isValidId) {
    return { error: "معرّف المنتج غير صحيح." };
  }

  const { data, error } = await supabase.rpc("delete_catalog_product", {
    p_product_id: productId,
  });

  if (error) {
    console.error("Failed to delete product", {
      code: error.code,
    });

    if (error.message === "hide_product_before_deleting") {
      return { error: "أخفِ المنتج أولًا قبل حذفه نهائيًا." };
    }

    if (error.code === "P0002") {
      return { error: "المنتج لم يعد موجودًا. ارجع لقائمة المنتجات." };
    }

    return {
      error: "تعذّر تأكيد حذف المنتج. حدّث الصفحة وراجع حالته.",
    };
  }

  if (data !== productId.toLowerCase()) {
    return { error: "تعذّر تأكيد الحذف. راجع قائمة المنتجات." };
  }

  // محاولة التنظيف فورًا.
  // أي طلب غير مكتمل يظل محفوظًا لإعادة المحاولة.
  try {
    await cleanupProductImageJobs(supabase);
  } catch (cleanupError) {
    console.error("Deferred product image cleanup", {
      error: cleanupError,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");

  redirect("/admin/products?success=deleted");
}

export async function retryImageCleanup(
  _previousState: ProductCleanupState,
  _formData: FormData,
): Promise<ProductCleanupState> {
  const { supabase } = await requireAdmin();

  try {
    const result = await cleanupProductImageJobs(supabase);

    revalidatePath("/admin/products");

    if (result.failed > 0) {
      return {
        error:
          "بعض الملفات لم يكتمل تنظيفها. الطلبات محفوظة ويمكنك إعادة المحاولة لاحقًا.",
        successId: null,
        message: null,
      };
    }

    return {
      error: null,
      successId: randomUUID(),
      message:
        result.remaining > 0
          ? "تم تنظيف دفعة من الصور. اضغط مجددًا لاستكمال الباقي."
          : "اكتمل تنظيف الصور غير المستخدمة",
    };
  } catch (error) {
    console.error("Failed to retry image cleanup", { error });

    revalidatePath("/admin/products");

    return {
      error: "تعذّر إكمال التنظيف. حاول مرة أخرى لاحقًا.",
      successId: null,
      message: null,
    };
  }
}
