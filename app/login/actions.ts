"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createAuthClient } from "@/lib/supabase/auth-server";

export type LoginState = {
  error: string | null;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  if (typeof rawEmail !== "string" || typeof rawPassword !== "string") {
    return { error: "أدخل البريد الإلكتروني وكلمة المرور." };
  }

  const email = rawEmail.trim();
  const password = rawPassword;

  if (!email || email.length > 254 || !password || password.length > 1024) {
    return { error: "راجع بيانات الدخول وحاول مرة أخرى." };
  }

  const supabase = await createAuthClient();

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      error:
        signInError.status === 429
          ? "محاولات كثيرة. انتظر قليلًا وحاول مرة أخرى."
          : "تعذّر تسجيل الدخول. راجع بياناتك وحاول مرة أخرى.",
    };
  }

  const { data: isAdmin, error: permissionError } = await supabase.rpc(
    "current_user_is_admin",
  );

  if (permissionError || isAdmin !== true) {
    await supabase.auth.signOut({ scope: "local" });

    return {
      error: permissionError
        ? "تعذّر التحقق من الصلاحيات. حاول مرة أخرى."
        : "هذا الحساب غير مصرح له بدخول لوحة الإدارة.",
    };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createAuthClient();

  const { error } = await supabase.auth.signOut({
    scope: "local",
  });

  if (error) {
    throw new Error("تعذّر تسجيل الخروج. حاول مرة أخرى.");
  }

  revalidatePath("/admin", "layout");
  redirect("/login");
}
