"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";
import { getPasswordValidationError } from "@/lib/auth/password-policy";
import type { ChangePasswordState } from "@/lib/admin/user-form-types";

function getPasswordField(formData: FormData, name: string): string {
  const value = formData.get(name);

  // كلمات المرور لا يتم حذف المسافات منها.
  return typeof value === "string" ? value : "";
}

export async function changeOwnPassword(
  _previousState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const { supabase, user } = await requireAdmin();

  const fail = (error: string): ChangePasswordState => ({
    error,
    successId: null,
  });

  const currentPassword = getPasswordField(formData, "current_password");

  const newPassword = getPasswordField(formData, "new_password");
  const confirmation = getPasswordField(formData, "confirm_password");

  if (!user.email) {
    return fail("هذا الحساب لا يدعم تغيير كلمة المرور بهذه الطريقة.");
  }

  if (!currentPassword || currentPassword.length > 1024) {
    return fail("اكتب كلمة المرور الحالية.");
  }

  const passwordError = getPasswordValidationError(newPassword);

  if (passwordError) {
    return fail(passwordError);
  }

  if (newPassword !== confirmation) {
    return fail("تأكيد كلمة المرور غير مطابق.");
  }

  if (newPassword === currentPassword) {
    return fail("اختر كلمة مرور مختلفة عن الحالية.");
  }

  // التحقق من الحالية وإنشاء جلسة حديثة لنفس المستخدم.
  const { data: verification, error: verificationError } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

  if (verificationError) {
    if (verificationError.code === "invalid_credentials") {
      return fail("كلمة المرور الحالية غير صحيحة.");
    }

    if (verificationError.status === 429) {
      return fail("محاولات كثيرة خلال وقت قصير. انتظر قليلًا.");
    }

    console.error("Password verification failed", {
      code: verificationError.code,
      status: verificationError.status,
    });

    return fail("تعذّر التحقق من كلمة المرور الحالية. حاول مرة أخرى.");
  }

  if (verification.user?.id !== user.id) {
    await supabase.auth.signOut({ scope: "local" });
    redirect("/login");
  }

  // إعادة مراجعة صلاحية الإدارة بعد تسجيل الدخول.
  const { data: isAdmin, error: permissionError } = await supabase.rpc(
    "current_user_is_admin",
  );

  if (permissionError) {
    return fail("تعذّر التحقق من صلاحيات الحساب. حاول مرة أخرى.");
  }

  if (isAdmin !== true) {
    await supabase.auth.signOut({ scope: "local" });
    redirect("/login?reason=forbidden");
  }

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
    current_password: currentPassword,
  });

  if (error) {
    console.error("Password update failed", {
      code: error.code,
      status: error.status,
    });

    if (error.code === "current_password_mismatch") {
      return fail("كلمة المرور الحالية غير صحيحة.");
    }

    if (error.code === "same_password") {
      return fail("اختر كلمة مرور مختلفة عن الحالية.");
    }

    if (error.code === "weak_password") {
      return fail("كلمة المرور لا تطابق سياسة الأمان. اختر كلمة أقوى.");
    }

    if (error.code === "reauthentication_needed") {
      return fail("أعد تسجيل الدخول، ثم حاول تغيير كلمة المرور.");
    }

    if (error.status === 429) {
      return fail("محاولات كثيرة خلال وقت قصير. انتظر قليلًا.");
    }

    return fail("تعذّر تغيير كلمة المرور. حاول مرة أخرى.");
  }

  if (data.user?.id !== user.id) {
    return fail("تعذّر تأكيد تغيير كلمة المرور. أعد تسجيل الدخول وراجع حسابك.");
  }

  revalidatePath("/admin/account");
  revalidatePath("/admin/users");

  return {
    error: null,
    successId: randomUUID(),
  };
}
