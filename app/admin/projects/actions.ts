"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import type { ProjectFormState } from "@/lib/admin/project-form-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getText(formData: FormData, name: string): string {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

async function saveProject(
  projectId: string | null,
  formData: FormData,
): Promise<ProjectFormState> {
  const { supabase } = await requireAdmin();

  if (projectId && !UUID_PATTERN.test(projectId)) {
    return { error: "معرّف المشروع غير صحيح." };
  }

  const titleAr = getText(formData, "title_ar");
  const titleEn = getText(formData, "title_en");
  const categoryAr = getText(formData, "category_ar");
  const categoryEn = getText(formData, "category_en");
  const descriptionAr = getText(formData, "description_ar");
  const descriptionEn = getText(formData, "description_en");
  const sortOrderText = getText(formData, "sort_order");

  if (!titleAr || titleAr.length > 160) {
    return {
      error: "اكتب اسم المشروع بالعربي، بحد أقصى 160 حرفًا.",
    };
  }

  if (titleEn.length > 160) {
    return {
      error: "اسم المشروع بالإنجليزي يجب ألا يتجاوز 160 حرفًا.",
    };
  }

  if (!categoryAr || categoryAr.length > 100) {
    return {
      error: "اكتب نوع المشروع بالعربي، بحد أقصى 100 حرف.",
    };
  }

  if (categoryEn.length > 100) {
    return {
      error: "نوع المشروع بالإنجليزي يجب ألا يتجاوز 100 حرف.",
    };
  }

  if (descriptionAr.length > 5000 || descriptionEn.length > 5000) {
    return {
      error: "الوصف يجب ألا يتجاوز 5000 حرف لكل لغة.",
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

  const payload = {
    title_ar: titleAr,
    title_en: titleEn || null,
    category_ar: categoryAr,
    category_en: categoryEn || null,
    description_ar: descriptionAr,
    description_en: descriptionEn || null,
    sort_order: sortOrder,
    is_featured: formData.get("is_featured") === "on",
  };

  const result = projectId
    ? await supabase
        .from("projects")
        .update(payload)
        .eq("id", projectId)
        .select("id")
        .maybeSingle()
    : await supabase
        .from("projects")
        .insert({
          ...payload,
          is_active: false,
        })
        .select("id")
        .single();

  if (result.error) {
    console.error("Failed to save project", {
      code: result.error.code,
    });

    return {
      error: "تعذّر حفظ المشروع. راجع البيانات وحاول مرة أخرى.",
    };
  }

  if (!result.data) {
    return {
      error: "المشروع لم يعد موجودًا أو لم يتم حفظ التعديل.",
    };
  }

  const savedId = result.data.id;

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${savedId}/edit`);
  revalidatePath("/", "layout");

  redirect(
    `/admin/projects/${savedId}/edit?success=${
      projectId ? "updated" : "created"
    }`,
  );
}

export async function createProject(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  return saveProject(null, formData);
}

export async function updateProject(
  projectId: string,
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  return saveProject(projectId, formData);
}
