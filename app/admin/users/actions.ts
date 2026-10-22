"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireOwner } from "@/lib/auth/require-owner";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type {
  CreateAdminState,
  AdminStatusState,
} from "@/lib/admin/user-form-types";
import { randomUUID } from "node:crypto";
import { getPasswordValidationError } from "@/lib/auth/password-policy";

export async function createCatalogAdmin(
  _previousState: CreateAdminState,
  formData: FormData,
): Promise<CreateAdminState> {
  const { user } = await requireOwner();

  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const confirmationValue = formData.get("confirm_password");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";

  const password = typeof passwordValue === "string" ? passwordValue : "";

  const confirmation =
    typeof confirmationValue === "string" ? confirmationValue : "";

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "اكتب بريدًا إلكترونيًا صحيحًا." };
  }

  const passwordError = getPasswordValidationError(password);

  if (passwordError) {
    return { error: passwordError };
  }

  if (password !== confirmation) {
    return { error: "تأكيد كلمة المرور غير مطابق." };
  }

  let adminClient: ReturnType<typeof createSupabaseAdminClient>;

  try {
    adminClient = createSupabaseAdminClient();
  } catch {
    return {
      error: "إعدادات إدارة الحسابات غير مكتملة على السيرفر.",
    };
  }

  let createdUserId: string | null = null;

  try {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        elkholy_catalog_admin: true,
        created_by_admin: user.id,
      },
    });

    if (error) {
      console.error("Failed to create catalog admin", {
        code: error.code,
        status: error.status,
      });

      if (
        error.code === "email_exists" ||
        error.code === "user_already_exists"
      ) {
        return { error: "البريد الإلكتروني مستخدم بالفعل." };
      }

      if (error.code === "weak_password") {
        return {
          error: "كلمة المرور لا تطابق سياسة الأمان. اختر كلمة أقوى.",
        };
      }

      if (error.status === 429) {
        return {
          error: "محاولات كثيرة خلال وقت قصير. انتظر قليلًا.",
        };
      }

      return {
        error: "تعذّر إنشاء الحساب. راجع الإعدادات وحاول مرة أخرى.",
      };
    }

    createdUserId = data.user?.id ?? null;
  } catch {
    return {
      error: "تعذّر تأكيد إنشاء الحساب. راجع المستخدمين قبل إعادة المحاولة.",
    };
  }

  if (!createdUserId) {
    return { error: "لم يتم تأكيد إنشاء الحساب." };
  }

  revalidatePath("/admin/users");

  redirect("/admin/users?success=created");
}

export async function changeAdminStatus(
  userId: string,
  _previousState: AdminStatusState,
  formData: FormData,
): Promise<AdminStatusState> {
  const { supabase } = await requireOwner();

  const fail = (error: string): AdminStatusState => ({
    error,
    successId: null,
    message: null,
  });

  const isValidId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      userId,
    );

  if (!isValidId) {
    return fail("معرّف الحساب غير صحيح.");
  }

  const operation = formData.get("operation");

  if (operation !== "activate" && operation !== "deactivate") {
    return fail("عملية غير صحيحة.");
  }

  const shouldActivate = operation === "activate";

  const { data, error } = await supabase.rpc("set_catalog_admin_active", {
    p_user_id: userId,
    p_is_active: shouldActivate,
  });

  if (error) {
    console.error("Failed to change admin account status", {
      code: error.code,
    });

    if (error.message === "cannot_change_own_admin_status") {
      return fail("لا يمكنك تغيير حالة حسابك من هذا الإجراء.");
    }

    if (error.message === "owner_account_protected") {
      return fail("حساب المدير الرئيسي محمي من التعطيل.");
    }

    if (error.code === "P0002") {
      return fail("الحساب لم يعد موجودًا. حدّث الصفحة.");
    }

    return fail("تعذّر تغيير حالة الحساب. حاول مرة أخرى.");
  }

  if (data !== shouldActivate) {
    return fail("تعذّر تأكيد حالة الحساب. حدّث الصفحة وراجع حالته.");
  }

  revalidatePath("/admin/users");

  return {
    error: null,
    successId: randomUUID(),
    message: shouldActivate
      ? "تم تفعيل الحساب مجددًا"
      : "تم تعطيل وصول الحساب إلى لوحة الإدارة",
  };
}
