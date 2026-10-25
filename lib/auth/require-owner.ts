import "server-only";

import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/require-admin";

export async function requireOwner() {
  const context = await requireAdmin();

  const { data, error } = await context.supabase.rpc("current_user_is_owner");

  if (error) {
    console.error("Failed to verify owner access", {
      code: error.code,
    });

    throw new Error("تعذّر التحقق من صلاحيات الحساب.");
  }

  if (data !== true) {
    notFound();
  }

  return context;
}
