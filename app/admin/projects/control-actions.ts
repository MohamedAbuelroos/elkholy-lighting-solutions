"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { cleanupProjectImageJobs } from "@/lib/admin/images/cleanup-project-image-jobs";
import type { ProjectActionState } from "@/lib/admin/project-action-types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(error: string): ProjectActionState {
  return {
    error,
    successId: null,
    message: null,
  };
}

function refreshProjects(projectId?: string) {
  revalidatePath("/admin/projects");

  if (projectId) {
    revalidatePath(`/admin/projects/${projectId}/edit`);
  }

  revalidatePath("/", "layout");
}

export async function changeProjectPublication(
  projectId: string,
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(projectId)) {
    return fail("معرّف المشروع غير صحيح.");
  }

  const operation = formData.get("operation");

  if (operation !== "publish" && operation !== "hide") {
    return fail("العملية المطلوبة غير صحيحة.");
  }

  const isActive = operation === "publish";

  const { data, error } = await supabase.rpc("set_project_publication", {
    p_project_id: projectId,
    p_is_active: isActive,
  });

  // false نتيجة نجاح صحيحة لعملية الإخفاء.
  if (error || data !== isActive) {
    console.error("Failed to change project publication", {
      code: error?.code,
    });

    if (error?.code === "P0002") {
      return fail("المشروع لم يعد موجودًا. حدّث الصفحة.");
    }

    if (
      error?.code === "23514" &&
      error.message.includes("project_requires_image")
    ) {
      return fail("أضف صورة واحدة على الأقل قبل نشر المشروع.");
    }

    return fail("تعذّر تأكيد تغيير حالة المشروع. حدّث الصفحة.");
  }

  refreshProjects(projectId);

  return {
    error: null,
    successId: randomUUID(),
    message: isActive ? "تم نشر المشروع." : "تم إخفاء المشروع.",
  };
}

export async function deleteProject(
  projectId: string,
  _previousState: ProjectActionState,
  _formData: FormData,
): Promise<ProjectActionState> {
  const { supabase } = await requireAdmin();

  if (!UUID_PATTERN.test(projectId)) {
    return fail("معرّف المشروع غير صحيح.");
  }

  const { data, error } = await supabase.rpc("delete_catalog_project", {
    p_project_id: projectId,
  });

  if (error || data !== projectId) {
    console.error("Failed to delete project", {
      code: error?.code,
    });

    if (error?.code === "P0002") {
      return fail("المشروع لم يعد موجودًا. ارجع لقائمة المشاريع.");
    }

    if (
      error?.code === "23514" &&
      error.message.includes("hide_project_before_deleting")
    ) {
      return fail("أخفِ المشروع أولًا قبل حذفه.");
    }

    return fail("تعذّر تأكيد حذف المشروع. حدّث الصفحة للتحقق.");
  }

  try {
    const { remaining } = await cleanupProjectImageJobs(supabase, projectId);

    if (remaining > 0) {
      console.warn("Project deleted with pending image cleanup", {
        projectId,
        remaining,
      });
    }
  } catch {
    console.error("Project deleted but image cleanup needs retry", {
      projectId,
    });
  }

  refreshProjects(projectId);

  redirect("/admin/projects?success=deleted");
}

export async function retryProjectImageCleanup(
  _previousState: ProjectActionState,
  _formData: FormData,
): Promise<ProjectActionState> {
  const { supabase } = await requireAdmin();

  try {
    const { remaining } = await cleanupProjectImageJobs(supabase);

    refreshProjects();

    return {
      error: null,
      successId: randomUUID(),
      message:
        remaining > 0
          ? `توجد ${remaining} مهمة تنظيف متبقية. أعد المحاولة.`
          : "اكتمل تنظيف صور المشاريع القديمة.",
    };
  } catch {
    return fail("تعذّر تنظيف التخزين حاليًا. حاول مرة أخرى.");
  }
}
