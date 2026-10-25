"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { optimizeCatalogImage } from "@/lib/admin/images/optimize-catalog-image";
import { PROJECT_IMAGE_CONFIG } from "@/lib/projects/image-config";
import type { ProjectImageUploadState } from "@/lib/admin/project-image-types";
import { cleanupProjectImageJobs } from "@/lib/admin/images/cleanup-project-image-jobs";
import type { ProjectImageActionState } from "@/lib/admin/project-image-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function uploadProjectImage(
  projectId: string,
  _previousState: ProjectImageUploadState,
  formData: FormData,
): Promise<ProjectImageUploadState> {
  const { supabase } = await requireAdmin();

  const fail = (error: string): ProjectImageUploadState => ({
    error,
    successId: null,
  });

  if (!UUID_PATTERN.test(projectId)) {
    return fail("معرّف المشروع غير صحيح.");
  }

  const image = formData.get("image");
  const altValue = formData.get("alt");

  const alt = typeof altValue === "string" ? altValue.trim() : "";

  if (alt.length > 200) {
    return fail("وصف الصورة يجب ألا يتجاوز 200 حرف.");
  }

  if (
    !(image instanceof File) ||
    image.size === 0 ||
    image.size > PROJECT_IMAGE_CONFIG.maxBytes ||
    image.type !== "image/webp"
  ) {
    return fail("اختر صورة صالحة ليتم تجهيزها قبل الرفع.");
  }

  const [projectResult, countResult] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title_ar")
      .eq("id", projectId)
      .maybeSingle(),

    supabase
      .from("project_images")
      .select("id", { count: "exact", head: true })
      .eq("project_id", projectId),
  ]);

  if (projectResult.error || countResult.error) {
    console.error("Failed to verify project image upload", {
      projectCode: projectResult.error?.code,
      countCode: countResult.error?.code,
    });

    return fail("تعذّر التحقق من المشروع. حاول مرة أخرى.");
  }

  if (!projectResult.data) {
    return fail("المشروع لم يعد موجودًا.");
  }

  if ((countResult.count ?? 0) >= PROJECT_IMAGE_CONFIG.maxImages) {
    return fail("وصل المشروع للحد الأقصى: 10 صور.");
  }

  let buffer: Buffer;

  try {
    buffer = await optimizeCatalogImage(image);
  } catch (error) {
    return fail(
      error instanceof Error
        ? error.message
        : "تعذّرت معالجة الصورة. جرّب صورة أخرى.",
    );
  }

  const path = `${projectId}/${randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(PROJECT_IMAGE_CONFIG.bucket)
    .upload(path, buffer, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    console.error("Failed to upload project image");

    return fail("تعذّر رفع الصورة. حاول مرة أخرى.");
  }

  const { data: publicUrl } = supabase.storage
    .from(PROJECT_IMAGE_CONFIG.bucket)
    .getPublicUrl(path);

  const { error: insertError } = await supabase.from("project_images").insert({
    project_id: projectId,
    src: publicUrl.publicUrl,
    alt: alt || projectResult.data.title_ar,
  });

  if (insertError) {
    console.error("Failed to attach project image", {
      code: insertError.code,
    });

    // رفض مؤكد من قاعدة البيانات أو واجهة PostgREST.
    // لا نحذف الملف عند نتيجة اتصال غير مؤكدة؛ فقد يكون الربط نجح.
    const isDefiniteRejection =
      /^[0-9A-Z]{5}$/.test(insertError.code) ||
      /^PGRST\d+$/.test(insertError.code);

    if (isDefiniteRejection) {
      const { error: queueError } = await supabase
        .from("project_image_cleanup_jobs")
        .insert({
          project_id: projectId,
          src: publicUrl.publicUrl,
        });

      if (queueError && queueError.code !== "23505") {
        console.error("Failed to queue unattached project image", {
          path,
          code: queueError.code,
        });
      } else {
        try {
          await cleanupProjectImageJobs(supabase, projectId);
        } catch {
          console.error("Project image cleanup needs retry", {
            projectId,
          });
        }
      }
    }

    revalidatePath(`/admin/projects/${projectId}/edit`);

    if (
      insertError.code === "23514" &&
      insertError.message.includes("project_image_limit_exceeded")
    ) {
      return fail("وصل المشروع للحد الأقصى: 10 صور. حدّث الصفحة.");
    }

    return fail("تعذّر تأكيد حفظ الصورة. حدّث الصفحة للتحقق قبل إعادة الرفع.");
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/", "layout");

  return {
    error: null,
    successId: randomUUID(),
  };
}

export async function manageProjectImage(
  projectId: string,
  _previousState: ProjectImageActionState,
  formData: FormData,
): Promise<ProjectImageActionState> {
  const { supabase } = await requireAdmin();

  const fail = (error: string): ProjectImageActionState => ({
    error,
    successId: null,
    message: null,
    warning: null,
  });

  if (!UUID_PATTERN.test(projectId)) {
    return fail("معرّف المشروع غير صحيح.");
  }

  const operation = formData.get("operation");

  if (
    operation !== "earlier" &&
    operation !== "later" &&
    operation !== "first" &&
    operation !== "delete" &&
    operation !== "cleanup"
  ) {
    return fail("العملية المطلوبة غير صحيحة.");
  }

  if (operation !== "cleanup") {
    const imageId = formData.get("image_id");

    if (typeof imageId !== "string" || !UUID_PATTERN.test(imageId)) {
      return fail("معرّف الصورة غير صحيح.");
    }

    const { data, error } = await supabase.rpc("manage_project_image", {
      p_project_id: projectId,
      p_image_id: imageId,
      p_action: operation,
    });

    if (error || data !== true) {
      console.error("Failed to manage project image", {
        code: error?.code,
      });

      if (error?.code === "P0002") {
        return fail("الصورة أو المشروع لم يعد موجودًا. حدّث الصفحة.");
      }

      if (
        error?.code === "23514" &&
        error.message.includes("cannot_delete_last_published_image")
      ) {
        return fail("لا يمكن حذف آخر صورة لمشروع منشور. أخفِ المشروع أولًا.");
      }

      return fail("تعذّر حفظ التغيير. حدّث الصفحة للتحقق وحاول مرة أخرى.");
    }
  }

  let warning: string | null = null;

  try {
    const { remaining } = await cleanupProjectImageJobs(supabase, projectId);

    if (remaining > 0) {
      warning =
        "توجد صور قديمة لم يكتمل تنظيفها من التخزين. أعد محاولة التنظيف.";
    }
  } catch {
    warning =
      "تعذّر تنظيف التخزين حاليًا. طلبات التنظيف محفوظة لإعادة المحاولة.";
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}/edit`);
  revalidatePath("/", "layout");

  const message =
    operation === "delete"
      ? "تم حذف الصورة من المشروع."
      : operation === "first"
        ? "تم تحديث غلاف المشروع."
        : operation === "cleanup"
          ? "تم تنفيذ محاولة تنظيف الصور القديمة."
          : "تم حفظ ترتيب الصور.";

  return {
    error: null,
    successId: randomUUID(),
    message,
    warning,
  };
}
