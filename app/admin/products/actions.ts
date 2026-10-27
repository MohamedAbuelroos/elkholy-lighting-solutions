"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { ProductFormState } from "@/lib/admin/product-form-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getText(formData: FormData, field: string): string {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

async function saveProduct(
  productId: string | null,
  formData: FormData,
): Promise<ProductFormState> {
  const { supabase } = await requireAdmin();

  if (productId && !UUID_PATTERN.test(productId)) {
    return { error: "معرّف المنتج غير صحيح." };
  }

  const nameAr = getText(formData, "name_ar");
  const nameEn = getText(formData, "name_en");
  const slug = getText(formData, "slug").toLowerCase();
  const categoryId = getText(formData, "category_id");
  const descriptionAr = getText(formData, "description_ar");
  const descriptionEn = getText(formData, "description_en");
  const sku = getText(formData, "sku");
  const priceText = getText(formData, "price");
  const discountPercentText = getText(formData, "discount_percent");
  const sortOrderText = getText(formData, "sort_order");

  if (!nameAr || nameAr.length > 200) {
    return {
      error: "اكتب اسم المنتج بالعربي، بحد أقصى 200 حرف.",
    };
  }

  if (nameEn.length > 200) {
    return {
      error: "الاسم الإنجليزي يجب ألا يتجاوز 200 حرف.",
    };
  }

  if (slug.length > 150 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return {
      error:
        "رابط المنتج مطلوب: حروف إنجليزية وأرقام وشرطة بين الكلمات، بحد أقصى 150 حرفًا.",
    };
  }

  if (!UUID_PATTERN.test(categoryId)) {
    return { error: "اختر فئة المنتج من القائمة." };
  }

  if (descriptionAr.length > 10000 || descriptionEn.length > 10000) {
    return {
      error: "الوصف يجب ألا يتجاوز 10000 حرف لكل لغة.",
    };
  }

  if (sku.length > 100) {
    return { error: "كود المنتج يجب ألا يتجاوز 100 حرف." };
  }

  let price: number | null = null;

  if (priceText !== "") {
    if (!/^\d{1,10}(\.\d{1,2})?$/.test(priceText)) {
      return {
        error:
          "اكتب سعرًا صحيحًا لا يقل عن صفر، وبحد أقصى رقمين بعد العلامة العشرية.",
      };
    }

    price = Number(priceText);
  }

  if (!/^\d{1,2}$/.test(discountPercentText)) {
    return {
      error: "اكتب نسبة خصم صحيحة من 0 إلى 99.",
    };
  }

  const discountPercent = Number(discountPercentText);

  if (discountPercent > 99) {
    return {
      error: "نسبة الخصم يجب أن تكون من 0 إلى 99.",
    };
  }

  if (discountPercent > 0 && price === null) {
    return {
      error: "حدد سعر المنتج أولًا لتطبيق الخصم.",
    };
  }

  if (!/^\d+$/.test(sortOrderText)) {
    return {
      error: "ترتيب الظهور يجب أن يكون عددًا صحيحًا يبدأ من صفر.",
    };
  }

  const sortOrder = Number(sortOrderText);

  if (!Number.isSafeInteger(sortOrder) || sortOrder > 100000) {
    return {
      error: "ترتيب الظهور يجب أن يكون بين صفر و100000.",
    };
  }

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (categoryError) {
    console.error("Failed to verify product category", {
      code: categoryError.code,
    });

    return {
      error: "تعذّر التحقق من الفئة. حاول مرة أخرى.",
    };
  }

  if (!category) {
    return {
      error: "الفئة لم تعد موجودة. حدّث الصفحة واختر فئة أخرى.",
    };
  }

  const payload = {
    category_id: categoryId,
    name_ar: nameAr,
    name_en: nameEn || null,
    slug,
    description_ar: descriptionAr,
    description_en: descriptionEn || null,
    sku: sku || null,
    price,
    discount_percent: discountPercent,
    sort_order: sortOrder,
    is_featured: formData.get("is_featured") === "on",
    is_popular: formData.get("is_popular") === "on",
  };

  const result = productId
    ? await supabase
        .from("products")
        .update(payload)
        .eq("id", productId)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("products")
        .insert({
          ...payload,
          is_active: false,
        })
        .select("id")
        .single();

  if (result.error) {
    console.error("Failed to save product", {
      code: result.error.code,
      message: result.error.message,
      details: result.error.details,
      hint: result.error.hint,
    });

    if (result.error.code === "23505") {
      return {
        error: "رابط المنتج أو كود المنتج مستخدم بالفعل. استخدم قيمًا مختلفة.",
      };
    }

    if (result.error.code === "23503") {
      return {
        error: "الفئة لم تعد موجودة. حدّث الصفحة واختر فئة أخرى.",
      };
    }

    return {
      error: "تعذّر حفظ المنتج. حاول مرة أخرى.",
    };
  }

  if (!result.data) {
    return {
      error: "المنتج لم يعد موجودًا أو لم يتم حفظ التغييرات.",
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");

  redirect(`/admin/products?success=${productId ? "updated" : "created"}`);
}

export async function createProduct(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  return saveProduct(null, formData);
}

export async function updateProduct(
  productId: string,
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  return saveProduct(productId, formData);
}
