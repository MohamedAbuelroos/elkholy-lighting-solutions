"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { CategoryFormState } from "@/lib/admin/category-form-types";
import { cleanupCategoryImageJobs } from "@/lib/admin/images/cleanup-category-image-jobs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

async function saveCategory(
  categoryId: string | null,
  formData: FormData,
): Promise<CategoryFormState> {
  const { supabase } = await requireAdmin();

  if (categoryId && !UUID_PATTERN.test(categoryId)) {
    return { error: "معرّف الفئة غير صحيح." };
  }

  const nameAr = getText(formData, "name_ar");
  const nameEn = getText(formData, "name_en");
  const slug = getText(formData, "slug").toLowerCase();
  const descriptionAr = getText(formData, "description_ar");
  const descriptionEn = getText(formData, "description_en");
  const parentId = getText(formData, "parent_id");
  const sortOrderText = getText(formData, "sort_order");
  const isActive = formData.get("is_active") === "on";

  if (!nameAr || nameAr.length > 120) {
    return { error: "اكتب اسم الفئة بالعربي، بحد أقصى 120 حرفًا." };
  }

  if (nameEn.length > 120) {
    return { error: "الاسم الإنجليزي يجب ألا يتجاوز 120 حرفًا." };
  }

  if (slug.length > 100 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return {
      error:
        "استخدم لرابط الفئة حروفًا إنجليزية وأرقامًا وشرطة بين الكلمات، بحد أقصى 100 حرف.",
    };
  }

  if (descriptionAr.length > 2000 || descriptionEn.length > 2000) {
    return { error: "الوصف يجب ألا يتجاوز 2000 حرف لكل لغة." };
  }

  if (!/^\d+$/.test(sortOrderText)) {
    return { error: "ترتيب الظهور يجب أن يكون عددًا صحيحًا يبدأ من صفر." };
  }

  const sortOrder = Number(sortOrderText);

  if (!Number.isSafeInteger(sortOrder) || sortOrder > 100000) {
    return { error: "ترتيب الظهور يجب أن يكون بين صفر و100000." };
  }

  if (parentId) {
    if (!UUID_PATTERN.test(parentId)) {
      return { error: "اختر الفئة الأم من القائمة." };
    }

    if (parentId === categoryId) {
      return { error: "لا يمكن جعل الفئة تابعة لنفسها." };
    }

    const { data: parent, error: parentError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", parentId)
      .maybeSingle();

    if (parentError) {
      console.error("Failed to verify category parent", {
        code: parentError.code,
      });

      return { error: "تعذّر التحقق من الفئة الأم. حاول مرة أخرى." };
    }

    if (!parent) {
      return { error: "الفئة الأم لم تعد موجودة. حدّث الصفحة." };
    }
  }

  const payload = {
    name_ar: nameAr,
    name_en: nameEn || null,
    slug,
    description_ar: descriptionAr || null,
    description_en: descriptionEn || null,
    parent_id: parentId || null,
    sort_order: sortOrder,
    is_active: isActive,
  };

  // لا نعدّل image_path هنا، للحفاظ على صورة الفئة الموجودة.
  const result = categoryId
    ? await supabase
        .from("categories")
        .update(payload)
        .eq("id", categoryId)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("categories")
        .insert({ ...payload, image_path: null })
        .select("id")
        .single();

  if (result.error) {
    const { code } = result.error;

    console.error("Failed to save category", { code });

    if (code === "23505") {
      return { error: "رابط الفئة مستخدم بالفعل. اختر رابطًا مختلفًا." };
    }

    if (code === "23503") {
      return { error: "الفئة الأم لم تعد موجودة. حدّث الصفحة." };
    }

    if (code === "23514") {
      return {
        error:
          "تعذّر حفظ العلاقة بين الفئات. لا يمكن نقل الفئة داخل أي فئة متفرعة منها.",
      };
    }

    return { error: "تعذّر حفظ الفئة. حاول مرة أخرى." };
  }

  if (!result.data) {
    return { error: "الفئة لم تعد موجودة أو لم يتم حفظ التعديل." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");

  redirect(`/admin/categories?success=${categoryId ? "updated" : "created"}`);
}

export async function createCategory(
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  return saveCategory(null, formData);
}

export async function updateCategory(
  categoryId: string,
  _previousState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  return saveCategory(categoryId, formData);
}

export async function deleteCategory(
  categoryId: string,
  _previousState: CategoryFormState,
  _formData: FormData,
): Promise<CategoryFormState> {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(categoryId)) {
    return { error: "معرّف الفئة غير صحيح." };
  }

  const [childrenResult, productsResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("parent_id", categoryId),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", categoryId),
  ]);

  if (childrenResult.error || productsResult.error) {
    console.error("Failed to check category dependencies", {
      childrenCode: childrenResult.error?.code,
      productsCode: productsResult.error?.code,
    });

    return {
      error: "تعذّر التحقق من محتويات الفئة. حاول مرة أخرى.",
    };
  }

  if ((childrenResult.count ?? 0) > 0) {
    return {
      error:
        "لا يمكن حذف هذه الفئة لأنها تحتوي على فئات فرعية. انقلها لفئة أخرى أو احذفها أولًا. يمكنك أيضًا إخفاء الفئة من صفحة التعديل.",
    };
  }

  if ((productsResult.count ?? 0) > 0) {
    return {
      error:
        "لا يمكن حذف هذه الفئة لأنها تحتوي على منتجات. انقل المنتجات لفئة أخرى أولًا، أو أخفِ الفئة من صفحة التعديل.",
    };
  }

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete category", {
      code: error.code,
    });

    // قاعدة البيانات تمنع الحذف لو أُضيف منتج أو قسم
    // بين التحقق السابق وتنفيذ الحذف.
    if (error.code === "23503") {
      return {
        error:
          "الفئة مرتبطة بمنتجات أو فئات فرعية حاليًا. حدّث الصفحة وراجع محتوياتها.",
      };
    }

    return {
      error: "تعذّر حذف الفئة. حاول مرة أخرى.",
    };
  }

  if (!data) {
    return {
      error: "الفئة لم تعد موجودة أو لم يتم حذفها. حدّث الصفحة.",
    };
  }
  try {
    const { remaining } = await cleanupCategoryImageJobs(supabase);

    if (remaining > 0) {
      console.warn("Category deleted with pending image cleanup", {
        remaining,
      });
    }
  } catch {
    // حذف الفئة نجح، وتظل مهمة تنظيف الصورة محفوظة.
    console.error("Category deleted but image cleanup needs retry");
  }
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");

  redirect("/admin/categories?success=deleted");
}
