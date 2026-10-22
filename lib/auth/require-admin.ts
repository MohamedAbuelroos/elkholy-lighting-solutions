import "server-only";

import { redirect } from "next/navigation";

import { createAuthClient } from "@/lib/supabase/auth-server";

export async function requireAdmin() {
  const supabase = await createAuthClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: isAdmin, error: permissionError } = await supabase.rpc(
    "current_user_is_admin",
  );

  if (permissionError) {
    console.error("Admin authorization check failed:", {
      code: permissionError.code,
      message: permissionError.message,
    });

    throw new Error("تعذّر التحقق من صلاحيات الإدارة.");
  }

  if (isAdmin !== true) {
    redirect("/login?reason=forbidden");
  }

  return { supabase, user };
}
